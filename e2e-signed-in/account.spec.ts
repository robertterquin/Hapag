import { execFileSync } from 'node:child_process'
import { expect, test, type Page } from '@playwright/test'
import { recipeFixtures } from '../src/data/fixtures.ts'

// Each test signs up its own throwaway account on the local Supabase, so tests never share data.
const PASSWORD = 'hapag-test-password-1'
const recipe = recipeFixtures[0]
const supabaseUrl = () => process.env.LOCAL_SUPABASE_URL as string

async function signUp(page: Page) {
  const email = `cook-${Date.now()}-${Math.floor(Math.random() * 1e6)}@hapag.test`
  await page.goto('/auth')
  await page.getByRole('tab', { name: 'Register' }).click()
  await page.getByLabel('Full name').fill('Test Cook')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
  await page.getByLabel('Confirm password').fill(PASSWORD)
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page.getByRole('heading', { name: 'You’re signed in.' })).toBeVisible()
  return email
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto('/auth')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Sign in' }).last().click()
}

// Reads a table straight from the local database container, to check what really got stored.
// (The app's tables are granted only to signed-in users, so no API key can read them all.)
async function rows(table: string, email: string): Promise<Array<Record<string, unknown>> | null> {
  const sql = `select case when exists (select 1 from auth.users where email = '${email.replace(/'/g, "''")}')
    then coalesce((select json_agg(t) from public.${table} t join auth.users u on u.id = t.user_id where u.email = '${email.replace(/'/g, "''")}'), '[]') end`
  const out = execFileSync('docker', ['exec', 'supabase_db_hapag', 'psql', '-U', 'postgres', '-tAc', sql], { encoding: 'utf8' }).trim()
  return out ? JSON.parse(out) : null
}

test('save a recipe: it stays saved after a reload and shows on the Saved page', async ({ page }) => {
  const email = await signUp(page)
  await page.goto(`/recipes/${recipe.id}`)
  await page.getByRole('button', { name: 'Save recipe' }).click()
  await expect(page.getByRole('button', { name: 'Saved. Remove from saved' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Saved. Remove from saved' })).toBeVisible()
  await page.goto('/saved')
  await expect(page.getByRole('heading', { name: recipe.title })).toBeVisible()
  expect((await rows('saved_recipes', email))?.map((row) => row.recipe_id)).toEqual([recipe.id])
})

test('finish cooking: it is recorded as cooked, with feedback', async ({ page }) => {
  const email = await signUp(page)
  await page.goto(`/recipes/${recipe.id}/cook`)
  for (let step = 1; step < recipe.steps.length; step += 1) await page.getByRole('button', { name: /^Next/ }).click()
  await page.getByRole('button', { name: /^Finish/ }).click()
  await page.getByRole('button', { name: 'Helpful', exact: true }).click()
  await page.getByRole('button', { name: 'Mark as cooked' }).click()
  await expect(page).toHaveURL(new RegExp(`/recipes/${recipe.id}$`))
  await expect.poll(async () => (await rows('cooked_events', email))?.length).toBe(1)
  await expect.poll(async () => (await rows('recipe_feedback', email))?.map((row) => row.feedback_type)).toEqual(['helpful'])
  await page.goto('/saved')
  await expect(page.getByRole('heading', { name: 'Cooked Dishes' })).toBeVisible()
})

test('staples and preferences live in the account, not the browser', async ({ page }) => {
  const email = await signUp(page)
  await page.goto('/ulam')
  await page.locator('.staples-card').getByRole('button', { name: /Edit/ }).click()
  const firstStaple = page.locator('.staples-picker button').first()
  const wasPressed = await firstStaple.getAttribute('aria-pressed')
  await firstStaple.click()
  await page.getByRole('button', { name: 'Done' }).click()
  await expect.poll(async () => (await rows('pantry_items', email))?.length).toBeGreaterThan(0)
  const staplesAfterToggle = (await rows('pantry_items', email))?.length

  await page.goto('/profile')
  await page.getByRole('radio', { name: 'Spicy' }).click()
  await page.getByRole('button', { name: 'Save preferences' }).click()
  await expect.poll(async () => (await rows('user_preferences', email))?.[0]?.spice_level).toBe('hot')

  // Allergies typed in the Ulam sheet are saved to the profile when the sheet closes.
  await page.goto('/ulam')
  await page.locator('.preferences-summary').click()
  await page.getByLabel('Allergies').fill('hipon')
  await page.getByRole('button', { name: 'Done' }).click()
  await expect.poll(async () => (await rows('user_preferences', email))?.[0]?.allergies).toEqual(['hipon'])

  // A fresh browser (no local storage) signed in to the same account sees the same data.
  await page.context().clearCookies()
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
  await signIn(page, email, PASSWORD)
  await expect(page).not.toHaveURL(/\/auth$/)
  await page.goto('/ulam')
  await expect(page.locator('.preferences-summary')).toContainText('Spicy')
  await expect(page.locator('.preferences-summary')).toContainText('No hipon')
  expect((await rows('pantry_items', email))?.length).toBe(staplesAfterToggle)
  expect(wasPressed).not.toBeNull()
  const local = await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('hapag')))
  expect(local).toEqual([])
})

test('one account cannot read another account’s rows', async ({ page, browser }) => {
  const ownerEmail = await signUp(page)
  await page.goto(`/recipes/${recipe.id}`)
  await page.getByRole('button', { name: 'Save recipe' }).click()
  await expect.poll(async () => (await rows('saved_recipes', ownerEmail))?.length).toBe(1)
  const ownerRow = (await rows('saved_recipes', ownerEmail))?.[0]

  const other = await browser.newPage()
  await signUp(other)
  const seen = await other.evaluate(async ({ url, anonKey, ownerId }) => {
    const key = Object.keys(localStorage).find((name) => name.endsWith('-auth-token'))
    const token = key ? (JSON.parse(localStorage.getItem(key) as string) as { access_token: string }).access_token : ''
    const response = await fetch(`${url}/rest/v1/saved_recipes?user_id=eq.${ownerId}&select=recipe_id`, { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } })
    return response.json()
  }, { url: supabaseUrl(), anonKey: process.env.LOCAL_SUPABASE_ANON_KEY as string, ownerId: ownerRow?.user_id })
  expect(seen).toEqual([])
  await other.close()
})

test('forgot password: the emailed link lets you set a new password', async ({ page }) => {
  const email = await signUp(page)
  await page.goto('/profile')
  await page.getByRole('button', { name: 'Sign out' }).first().click()
  await page.goto('/auth')
  await page.getByLabel('Email address').fill(email)
  await page.getByRole('button', { name: 'Forgot password?' }).click()
  await expect(page.getByText(/a reset link is on its way/)).toBeVisible()

  const mail = process.env.LOCAL_MAIL_URL as string
  let link = ''
  await expect.poll(async () => {
    const list = await (await fetch(`${mail}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`)).json() as { messages?: Array<{ ID: string; Subject: string }> }
    const reset = list.messages?.find((message) => /reset/i.test(message.Subject))
    if (!reset) return ''
    const body = await (await fetch(`${mail}/api/v1/message/${reset.ID}`)).json() as { HTML: string; Text: string }
    link = (`${body.Text} ${body.HTML}`.match(/https?:\/\/[^\s"'<>]+verify[^\s"'<>]+/)?.[0] ?? '').replace(/&amp;/g, '&')
    return link
  }, { timeout: 20_000 }).not.toBe('')

  await page.goto(link)
  await expect(page.getByRole('heading', { name: 'Set a new password' })).toBeVisible()
  await page.getByLabel('New password', { exact: true }).fill('hapag-new-password-2')
  await page.getByLabel('Confirm new password').fill('hapag-new-password-2')
  await page.getByRole('button', { name: 'Save new password' }).click()
  await expect(page.getByText('Password updated. You’re signed in.')).toBeVisible()

  await page.getByRole('button', { name: 'Sign out' }).click()
  await signIn(page, email, 'hapag-new-password-2')
  await expect(page).not.toHaveURL(/\/auth$/)
})

test('delete account: the account and all its rows are gone', async ({ page }) => {
  const email = await signUp(page)
  await page.goto(`/recipes/${recipe.id}`)
  await page.getByRole('button', { name: 'Save recipe' }).click()
  await expect.poll(async () => (await rows('saved_recipes', email))?.length).toBe(1)

  await page.goto('/profile')
  await page.getByLabel('Type DELETE to confirm').fill('DELETE')
  await page.getByRole('button', { name: 'Delete my account' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect.poll(async () => rows('saved_recipes', email)).toBeNull()

  await signIn(page, email, PASSWORD)
  await expect(page.getByRole('alert')).toBeVisible()
})

import { expect, test } from '@playwright/test'
import { recipeFixtures } from '../src/data/fixtures.ts'

// Smoke checks for the features outside the main flow, signed out.
test.beforeEach(async ({ page }) => {
  await page.route('**/generate-recipes', (route) => route.fulfill({ json: { recipes: recipeFixtures } }))
})

test('Surprise me starts a search from a dish', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Surprise me/ }).first().click()
  await expect(page).toHaveURL(/\/(ulam|results)$/)
  await expect(page.getByRole('list', { name: 'Recognized ingredients' }).getByRole('listitem').first()).toBeVisible()
})

test('the cooking timer starts and counts down', async ({ page }) => {
  await page.goto('/recipes/sardines-egg-pechay/cook')
  const timer = page.getByRole('button', { name: /^Start \d/ })
  await timer.click()
  await page.waitForTimeout(1500)
  await expect(page.getByText(/^0?1:5\d$/).first()).toBeVisible()
})

test('Saved asks signed-out visitors to sign in, and Save leads to sign in', async ({ page }) => {
  await page.goto('/saved')
  await expect(page.getByText('Sign in to view your saved recipes')).toBeVisible()
  await page.goto('/recipes/sardines-egg-pechay')
  await page.getByRole('button', { name: 'Save recipe' }).click()
  await expect(page).toHaveURL(/\/auth$/)
})

test('Forgot password asks for an email first', async ({ page }) => {
  await page.goto('/auth')
  await page.getByRole('button', { name: 'Forgot password?' }).click()
  await expect(page.getByText('Enter your email address first, then tap Forgot password.')).toBeVisible()
})

test('unknown pages show not found', async ({ page }) => {
  await page.goto('/no-such-page')
  await expect(page.getByText('Page not found')).toBeVisible()
})

test('signed-out preferences survive a reload', async ({ page }) => {
  await page.goto('/ulam')
  await page.locator('.preferences-summary').click()
  await page.getByRole('radio', { name: 'Spicy' }).click()
  await page.getByRole('button', { name: 'Done' }).click()
  await expect(page.locator('.preferences-summary')).toContainText('Spicy')
  await page.reload()
  await expect(page.locator('.preferences-summary')).toContainText('Spicy')
})

test('icons are bundled: nothing is fetched from Iconify', async ({ page }) => {
  const iconRequests: string[] = []
  await page.route(/api\.(iconify\.design|simplesvg\.com|unisvg\.com)/, (route) => { iconRequests.push(route.request().url()); return route.abort() })
  await page.goto('/ulam')
  await expect(page.locator('.item-emoji svg').first()).toBeVisible()
  await expect(page.locator('.preferences-summary svg').first()).toBeVisible()
  expect(iconRequests).toEqual([])
})

test('the old /pantry link opens Ulam AI', async ({ page }) => {
  await page.goto('/pantry')
  await expect(page).toHaveURL(/\/ulam$/)
})

test('while the AI works, the loading screen shows real steps and the catalog shortlist', async ({ page }) => {
  // Needs the real AI endpoint to intercept; without Supabase settings the sample data answers instantly.
  const fs = await import('node:fs')
  const aiConfigured = process.env.VITE_SUPABASE_URL ?? (fs.existsSync('.env.local') ? 'from .env.local' : '')
  test.skip(!aiConfigured, 'No AI endpoint configured to slow down')
  await page.route('**/generate-recipes', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 4000))
    await route.fulfill({ json: { recipes: recipeFixtures } })
  })
  await page.goto('/ulam')
  const input = page.getByPlaceholder('e.g. 1/2 kg manok, patatas, bawang')
  await input.fill('manok, toyo, suka, bawang')
  await input.press('Escape')
  await page.getByRole('button', { name: 'Add', exact: true }).click()
  await page.getByRole('button', { name: "Let's cook" }).click()

  await expect(page.getByRole('heading', { level: 1, name: 'Finding dishes…' })).toBeVisible()
  await expect(page.getByText(/^3 of 4 · Writing steps and prices/)).toBeVisible()
  await expect(page.getByText('This can take up to 25 seconds.')).toBeVisible()
  const shortlist = page.locator('.dish-shortlist-card')
  await expect(shortlist.first()).toBeVisible()
  await expect(page.locator('.dish-shortlist-card', { hasText: 'Chicken Adobo' })).toContainText('You have all 4')
  await expect(page.getByRole('heading', { name: 'Dishes you can cook' })).toBeVisible({ timeout: 10_000 })
})

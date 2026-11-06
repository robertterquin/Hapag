import { expect, test } from '@playwright/test'
import { recipeFixtures } from '../src/data/fixtures.ts'

// Smoke checks for the features outside the main flow, signed out.
test.beforeEach(async ({ page }) => {
  await page.route('**/generate-recipes', (route) => route.fulfill({ json: { recipes: recipeFixtures } }))
})

test('Surprise me starts a search from a dish', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.home-meal-chip')).toContainText(/\d{1,2}:\d{2} [AP]M · (Almusal|Tanghalian|Merienda|Hapunan|Gabi) na/)
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

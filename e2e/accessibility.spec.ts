import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { recipeFixtures } from '../src/data/fixtures.ts'

// WCAG 2.1 A and AA checks on each main screen.
const scan = async (page: import('@playwright/test').Page) => {
  // Let the page transition finish so the outgoing screen isn't scanned too.
  await page.waitForTimeout(900)
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  return violations.map((violation) => `${violation.id} (${violation.impact}): ${violation.nodes.length}x ${violation.nodes[0]?.target.join(' ')}`)
}

test('main screens have no WCAG A/AA violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/generate-recipes', (route) => route.fulfill({ json: { recipes: recipeFixtures } }))
  const found: Record<string, string[]> = {}

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  found.home = await scan(page)

  await page.goto('/ulam')
  await page.getByPlaceholder('e.g. 1/2 kg manok, patatas, bawang').fill('sardinas, itlog, pechay')
  await page.getByRole('button', { name: 'Add', exact: true }).click()
  found.ulam = await scan(page)

  await page.getByRole('button', { name: "Let's cook" }).click()
  await expect(page.getByRole('heading', { name: 'Dishes you can cook' })).toBeVisible()
  found.results = await scan(page)

  await page.getByRole('heading', { name: recipeFixtures[0].title }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  found.detail = await scan(page)

  await page.getByRole('button', { name: /Start cooking/ }).click()
  await expect(page.getByText(recipeFixtures[0].steps[0].action)).toBeVisible()
  found.cooking = await scan(page)

  expect(found).toEqual({ home: [], ulam: [], results: [], detail: [], cooking: [] })
})

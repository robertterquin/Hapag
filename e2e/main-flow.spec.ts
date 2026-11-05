import { expect, test } from '@playwright/test'
import { recipeFixtures } from '../src/data/fixtures.ts'

const [sardines] = recipeFixtures

test('ingredients to results to recipe to cooking mode', async ({ page }) => {
  // The AI answer is canned so the flow is the same with or without real AI configured.
  await page.route('**/generate-recipes', (route) => route.fulfill({ json: { recipes: recipeFixtures } }))
  await page.goto('/ulam')

  await page.getByPlaceholder('e.g. 1/2 kg manok, patatas, bawang').fill('sardinas, itlog, pechay')
  await page.getByRole('button', { name: 'Add', exact: true }).click()
  await expect(page.getByRole('list', { name: 'Recognized ingredients' }).getByRole('listitem')).toHaveCount(3)

  await page.getByRole('button', { name: "Let's cook" }).click()
  await expect(page.getByRole('heading', { name: 'Dishes you can cook' })).toBeVisible()

  await page.getByRole('heading', { name: sardines.title }).click()
  await expect(page.getByRole('heading', { level: 1, name: sardines.title })).toBeVisible()

  await page.getByRole('button', { name: /Start cooking/ }).click()
  await expect(page.getByText(sardines.steps[0].action)).toBeVisible()
  await page.getByRole('button', { name: /Next/ }).click()
  await expect(page.getByText(sardines.steps[1].action)).toBeVisible()
})

test('when the AI fails, catalog dishes still show', async ({ page }) => {
  await page.route('**/generate-recipes', (route) => route.fulfill({ status: 503, json: { error: 'unavailable' } }))
  await page.goto('/ulam')

  await page.getByPlaceholder('e.g. 1/2 kg manok, patatas, bawang').fill('baboy, suka, toyo, bawang')
  await page.getByRole('button', { name: 'Add', exact: true }).click()
  await page.getByRole('button', { name: "Let's cook" }).click()

  await expect(page.getByText(/come from Hapag's Filipino dish catalog/)).toBeVisible()
  await expect(page.locator('.dish-idea-card').first()).toBeVisible()
})

test('a cooking link to a missing recipe offers a way out', async ({ page }) => {
  await page.goto('/recipes/no-such-recipe/cook')
  await expect(page.getByRole('heading', { name: "We couldn't find that recipe" })).toBeVisible()
  await page.getByRole('button', { name: 'Start over' }).click()
  await expect(page).toHaveURL(/\/ulam$/)
})

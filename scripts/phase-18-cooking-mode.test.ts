import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { recipeFixtures } from '../src/data/fixtures.ts'
import { getLeftovers, getStepIngredients } from '../src/lib/stepIngredients.ts'
import { normalizeIngredientInput } from '../src/lib/ingredientParser.ts'
import type { Recipe } from '../src/types/domain.ts'

const fixture = (id: string) => recipeFixtures.find((recipe) => recipe.id === id) as Recipe
const namesForStep = (recipe: Recipe, order: number) => getStepIngredients(recipe.steps[order - 1], recipe.ingredients).map((ingredient) => ingredient.name)

test('each step lists the ingredients it mentions, across English and Tagalog names', () => {
  const sardines = fixture('sardines-egg-pechay')
  assert.deepEqual(namesForStep(sardines, 1), ['Bawang', 'Mantika'])
  assert.deepEqual(namesForStep(sardines, 2), ['Sardines', 'Pechay'])
  assert.deepEqual(namesForStep(sardines, 3), ['Itlog'])

  const pechay = fixture('ginisang-pechay-egg')
  assert.deepEqual(namesForStep(pechay, 1), ['Kamatis', 'Sibuyas', 'Mantika'])
  assert.deepEqual(namesForStep(pechay, 2), ['Pechay'])
})

test('step matching handles plurals and whole words only', () => {
  const ingredients = [
    { id: 'a', name: 'Kamatis', canonicalName: 'tomato', quantity: 2, unit: 'piece' as const, available: true },
    { id: 'b', name: 'Asin', canonicalName: 'salt', quantity: 'to taste', unit: 'to-taste' as const, available: false },
    { id: 'c', name: 'Itlog', canonicalName: 'egg', quantity: 2, unit: 'piece' as const, available: true },
  ]
  assert.deepEqual(getStepIngredients({ action: 'Slice the tomatoes and beat the eggs.' }, ingredients).map((item) => item.id), ['a', 'c'])
  assert.deepEqual(getStepIngredients({ action: 'Serve on an eggplant leaf with salted crackers.' }, ingredients).map((item) => item.id), [])
})

test('leftovers are the searched ingredients the recipe did not use', () => {
  const sardines = fixture('sardines-egg-pechay')
  const session = normalizeIngredientInput('sardinas, pechay, itlog, kamatis, sibuyas')
  assert.deepEqual(getLeftovers(session, sardines).map((item) => item.canonicalName), ['tomato', 'onion'])
  assert.deepEqual(getLeftovers(normalizeIngredientInput('sardinas, itlog'), sardines), [])
})

test('cooking route is full screen with one step counter, a timer pill, and Escape to exit', async () => {
  const shell = await readFile('src/components/AppShell.tsx', 'utf8')
  const page = await readFile('src/pages/CookingPage.tsx', 'utf8')
  assert.match(shell, /const immersive = routeName === 'cooking'/)
  assert.match(shell, /\{immersive \? null : \(\n\s+<nav className="mobile-nav"/)
  assert.equal(page.match(/\{stepIndex \+ 1\} \/ \{stepCount\}/g)?.length, 1)
  assert.doesNotMatch(page, /Step \{step\.order\} of/)
  assert.match(page, /className=\{`timer-pill/)
  assert.match(page, /event\.key === 'Escape'/)
  assert.match(page, /Luto na!/)
  assert.match(page, /onUseLeftovers/)
})

test('changing steps keeps the timer running instead of resetting it', async () => {
  const page = await readFile('src/pages/CookingPage.tsx', 'utf8')
  const handler = page.slice(page.indexOf('const handleStepChange'), page.indexOf('const goNext'))
  assert.doesNotMatch(handler, /setTimer/)
})

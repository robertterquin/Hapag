import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { recipeFixtures } from '../src/data/fixtures.ts'
import { loadRecentRecipes, MAX_RECENT_RECIPES, mergeRecentRecipes, RECENT_RECIPES_KEY, saveRecentRecipes } from '../src/lib/recipeSessionCache.ts'
import { buildShoppingList, formatShoppingList } from '../src/lib/shoppingList.ts'
import { scaleRecipe } from '../src/lib/recipeControls.ts'
import type { Recipe } from '../src/types/domain.ts'

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial))
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
}

const sardines = recipeFixtures[0]
const withId = (recipe: Recipe, id: string): Recipe => ({ ...recipe, id })

test('recent recipes are kept newest first, without duplicates, up to the cap', () => {
  const a = withId(sardines, 'a'), b = withId(sardines, 'b'), c = withId(sardines, 'c')
  assert.deepEqual(mergeRecentRecipes([a, b], [c]).map((recipe) => recipe.id), ['c', 'a', 'b'])
  assert.deepEqual(mergeRecentRecipes([a, b, c], [b]).map((recipe) => recipe.id), ['b', 'a', 'c'])
  const many = Array.from({ length: 20 }, (_, index) => withId(sardines, `r${index}`))
  assert.equal(mergeRecentRecipes([], many).length, MAX_RECENT_RECIPES)
})

test('recent recipes round-trip through session storage and are re-validated', () => {
  const storage = memoryStorage()
  saveRecentRecipes([withId(sardines, 'ai-1')], storage)
  saveRecentRecipes([withId(sardines, 'ai-2')], storage)
  assert.deepEqual(loadRecentRecipes(storage).map((recipe) => recipe.id), ['ai-2', 'ai-1'])

  const mixed = memoryStorage({ [RECENT_RECIPES_KEY]: JSON.stringify([withId(sardines, 'ok'), { id: 'broken' }, 'nope']) })
  assert.deepEqual(loadRecentRecipes(mixed).map((recipe) => recipe.id), ['ok'])
})

test('corrupt or unavailable storage falls back to an empty cache without throwing', () => {
  assert.deepEqual(loadRecentRecipes(memoryStorage({ [RECENT_RECIPES_KEY]: '{not json' })), [])
  assert.deepEqual(loadRecentRecipes(memoryStorage({ [RECENT_RECIPES_KEY]: '{"id":"x"}' })), [])
  assert.deepEqual(loadRecentRecipes(undefined), [])
  const blocked = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('full') } }
  assert.deepEqual(loadRecentRecipes(blocked), [])
  assert.doesNotThrow(() => saveRecentRecipes([sardines], blocked))
})

test('the recipe service hydrates its cache from recent recipes and saves AI results', async () => {
  const service = await readFile('src/services/recipeService.ts', 'utf8')
  assert.match(service, /for \(const recipe of loadRecentRecipes\(\)\) recipeCache\.set\(recipe\.id, recipe\)/)
  assert.match(service, /saveRecentRecipes\(recipes\)/)
})

test('shopping list leaves out what you have and, by default, kusina staples', () => {
  assert.deepEqual(buildShoppingList(sardines, { includeStaples: false }).items, [])
  const withStaples = buildShoppingList(sardines, { includeStaples: true })
  assert.deepEqual(withStaples.items.map((item) => [item.name, item.staple]), [['Bawang', true], ['Mantika', true]])
  assert.equal(withStaples.knownTotal, undefined)
  assert.equal(withStaples.unpricedCount, 2)
})

test('shopping list prices missing items from cost lines matched by ingredient name', () => {
  const recipe: Recipe = {
    ...sardines,
    ingredients: sardines.ingredients.map((ingredient) => ingredient.name === 'Itlog' ? { ...ingredient, available: false } : ingredient),
  }
  const list = buildShoppingList(recipe, { includeStaples: false })
  assert.deepEqual(list.items.map((item) => [item.name, item.quantity, item.estimatedCost]), [['Itlog', '2 pcs', 24]])
  assert.equal(list.knownTotal, 24)

  const doubled = buildShoppingList(scaleRecipe(recipe, 6), { includeStaples: false })
  assert.deepEqual(doubled.items.map((item) => [item.quantity, item.estimatedCost]), [['4 pcs', 48]])

  assert.equal(formatShoppingList(recipe, list), 'Hapag shopping list: Sardines with egg and pechay (3 servings)\n- 2 pcs Itlog (about ₱24)\nEstimated total: about ₱24')
})

test('detail page puts its main actions in the sticky bar and lists sections in order', async () => {
  const page = await readFile('src/pages/RecipeDetailPage.tsx', 'utf8')
  assert.match(page, /<StickyActionBar>/)
  assert.match(page, /onStartOver/)
  const order = ['ingredients-heading', '<ShoppingListPanel', 'steps-heading', 'substitutions-heading', 'why-heading'].map((marker) => page.indexOf(marker))
  assert.ok(order.every((position) => position > 0))
  assert.deepEqual([...order].sort((a, b) => a - b), order)
})

test('the sticky bar only hides for the keyboard while a text field has focus', async () => {
  const hook = await readFile('src/hooks/useKeyboardOpen.ts', 'utf8')
  assert.match(hook, /!isEditable\(document\.activeElement\)/)
  assert.match(hook, /focusin/)
})

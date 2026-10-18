import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { normalizeIngredientInput } from '../src/lib/ingredientParser.ts'
import { formatIngredientLabel, getIngredientLabel, labelForIngredient, labelForName } from '../src/lib/ingredientLabels.ts'
import { defaultStaples, parseStoredStaples, readStoredStaples, STAPLES_STORAGE_KEY, staplesToAdd, toggleStapleInList, writeStoredStaples } from '../src/lib/pantryStaples.ts'
import { getEverydayDishes, pickSurpriseDish } from '../src/lib/surprise.ts'
import { summarizeConstraints } from '../src/lib/preferenceOptions.ts'

test('ingredient labels follow the display language', () => {
  assert.deepEqual(getIngredientLabel('chicken', 'manok', 'Taglish'), { primary: 'Manok', secondary: 'chicken' })
  assert.deepEqual(getIngredientLabel('chicken', 'manok', 'English'), { primary: 'Chicken' })
  assert.deepEqual(getIngredientLabel('chicken', 'manok', 'Tagalog'), { primary: 'Manok' })
  assert.deepEqual(getIngredientLabel('soy sauce', undefined, 'Taglish'), { primary: 'Soy Sauce' })
  assert.deepEqual(getIngredientLabel('Pechay', 'pechay', 'Taglish'), { primary: 'Pechay' })
  assert.equal(formatIngredientLabel({ primary: 'Toyo', secondary: 'soy sauce' }), 'Toyo (soy sauce)')
})

test('parsed ingredients get Taglish labels whatever language was typed', () => {
  const [fromEnglish] = normalizeIngredientInput('chicken')
  const [fromTagalog] = normalizeIngredientInput('manok')
  assert.equal(labelForIngredient(fromEnglish, 'Taglish'), 'Manok (chicken)')
  assert.equal(labelForIngredient(fromTagalog, 'Taglish'), 'Manok (chicken)')
  assert.equal(labelForIngredient(fromTagalog, 'English'), 'Chicken')
  assert.equal(labelForName('oil', 'Taglish'), 'Mantika (oil)')
})

test('stored staples are parsed defensively', () => {
  assert.equal(parseStoredStaples(null), null)
  assert.equal(parseStoredStaples('not json'), null)
  assert.equal(parseStoredStaples('{"garlic":true}'), null)
  assert.deepEqual(parseStoredStaples('[]'), [])
  assert.deepEqual(parseStoredStaples('[" Garlic ", "garlic", 3, "", "oil"]'), ['garlic', 'oil'])
})

test('staples round-trip through storage and survive storage failures', () => {
  const values = new Map<string, string>()
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
  assert.equal(readStoredStaples(storage), null)
  writeStoredStaples(['garlic', 'salt'], storage)
  assert.equal(values.get(STAPLES_STORAGE_KEY), '["garlic","salt"]')
  assert.deepEqual(readStoredStaples(storage), ['garlic', 'salt'])

  const broken = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('full') } }
  assert.equal(readStoredStaples(broken), null)
  assert.doesNotThrow(() => writeStoredStaples(['garlic'], broken))
})

test('staples can be toggled and only missing ones are added', () => {
  assert.deepEqual(toggleStapleInList(['garlic'], 'salt'), ['garlic', 'salt'])
  assert.deepEqual(toggleStapleInList(['garlic', 'salt'], 'garlic'), ['salt'])
  assert.deepEqual(staplesToAdd(defaultStaples, ['garlic', 'chicken', 'oil']), ['onion', 'salt', 'soy sauce', 'vinegar'])
  assert.deepEqual(staplesToAdd(['garlic'], ['garlic']), [])
})

test('default staples are all recognized by the ingredient parser', () => {
  for (const staple of defaultStaples) {
    const [parsed] = normalizeIngredientInput(staple)
    assert.equal(parsed.canonicalName, staple)
    assert.equal(parsed.confidence, 'high')
  }
})

test('Surprise me picks an everyday ulam deterministically from the random source', () => {
  const pool = getEverydayDishes()
  assert.ok(pool.length > 50)
  assert.ok(pool.every((dish) => ['main-dish', 'soup', 'stew', 'vegetable-dish'].includes(dish.mealType)))
  assert.equal(pickSurpriseDish(undefined, () => 0)?.id, pool[0].id)
  assert.equal(pickSurpriseDish(undefined, () => 0.9999)?.id, pool[pool.length - 1].id)
  assert.equal(pickSurpriseDish([], () => 0), undefined)
})

test('preference summary reads naturally', () => {
  assert.equal(summarizeConstraints({ servings: 3, allergies: [], spiceLevel: 'mild' }), '3 servings · Mild · Any budget')
  assert.equal(summarizeConstraints({ servings: 1, allergies: [], spiceLevel: 'hot', budgetLimit: 100, dietaryPreference: 'vegetarian' }), '1 serving · Spicy · Under ₱100 · Vegetarian')
})

test('signed-in staples sync to Supabase pantry_items', async () => {
  const service = await readFile('src/services/persistenceService.ts', 'utf8')
  const hook = await readFile('src/hooks/useKusinaStaples.ts', 'utf8')
  assert.match(service, /from\('pantry_items'\)\.upsert\(/)
  assert.match(service, /onConflict: 'user_id,canonical_name'/)
  assert.match(hook, /loadPantryStaples\(userId\)/)
  assert.match(hook, /writeStoredStaples\(next\)/)
})

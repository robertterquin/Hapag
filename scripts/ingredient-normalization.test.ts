import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeIngredientInput, normalizeIngredientName } from '../src/lib/ingredientParser.ts'

test('Tagalog and English aliases share catalog-aligned canonical names', () => {
  const cases = [
    ['bawang', 'garlic'],
    ['garlic', 'garlic'],
    ['sibuyas', 'onion'],
    ['itlog', 'egg'],
    ['eggs', 'egg'],
    ['sardinas', 'sardines'],
    ['canned sardines', 'sardines'],
    ['pechay', 'bok choy'],
    ['bok choy', 'bok choy'],
    ['hipon', 'shrimp'],
    ['bangus', 'milkfish'],
    ['sitaw', 'long beans'],
    ['gata', 'coconut milk'],
    ['toyo', 'soy sauce'],
  ] as const

  for (const [input, expected] of cases) assert.equal(normalizeIngredientName(input), expected)
})

test('normalization cleans case, whitespace, punctuation, quantities, and units', () => {
  assert.equal(normalizeIngredientName('  BAWANG  '), 'garlic')
  assert.equal(normalizeIngredientName('kamatises'), 'tomato')
  const [ingredient] = normalizeIngredientInput('2 lata sardinas')
  assert.equal(ingredient.canonicalName, 'sardines')
  assert.equal(ingredient.quantity, 2)
  assert.equal(ingredient.unit, 'can')
  assert.equal(ingredient.name, 'sardinas')
})

test('unknown ingredients remain editable and low confidence', () => {
  const [ingredient] = normalizeIngredientInput('dragon fruit')
  assert.equal(ingredient.canonicalName, 'dragon fruit')
  assert.equal(ingredient.confidence, 'low')
})

test('Tagalog-English duplicates resolve to one canonical ingredient', () => {
  const ingredients = normalizeIngredientInput('bawang, garlic, sardinas, canned sardines')
  assert.deepEqual([...new Set(ingredients.map((item) => item.canonicalName))], ['garlic', 'sardines'])
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeIngredientInput } from '../src/lib/ingredientParser.ts'
import { matchRecipeCatalog } from '../src/services/recipeMatcher.ts'

test('matcher ranks Chicken Adobo for matching chicken ingredients', () => {
  const ingredients = normalizeIngredientInput('manok, bawang, toyo, suka')
  const [match] = matchRecipeCatalog(ingredients)

  assert.equal(match.dish.id, 'chicken-adobo')
  assert.equal(match.score, 80)
  assert.equal(match.kind, 'strong-match')
  assert.deepEqual(match.availableIngredients, ['chicken', 'garlic', 'soy sauce', 'vinegar'])
  assert.deepEqual(match.missingIngredients, [])
})

test('matcher reports missing ingredients for partial dishes', () => {
  const ingredients = normalizeIngredientInput('manok, bawang, toyo')
  const [match] = matchRecipeCatalog(ingredients)

  assert.equal(match.dish.id, 'chicken-adobo')
  assert.equal(match.score, 60)
  assert.equal(match.kind, 'partial-match')
  assert.deepEqual(match.missingIngredients, ['vinegar'])
})

test('matcher uses normalized Tagalog and English aliases', () => {
  const ingredients = normalizeIngredientInput('sardinas, itlog, bawang')
  const [match] = matchRecipeCatalog(ingredients)

  assert.equal(match.dish.id, 'sardines-with-egg')
  assert.equal(match.kind, 'partial-match')
  assert.deepEqual(match.availableIngredients, ['sardines', 'egg', 'garlic'])
})

test('matcher returns adaptation candidates for weak matches', () => {
  const ingredients = normalizeIngredientInput('butter')
  const [match] = matchRecipeCatalog(ingredients)

  assert.equal(match.kind, 'adaptation-candidate')
  assert.equal(match.score, 0)
})

test('matcher handles empty input and custom limits', () => {
  assert.deepEqual(matchRecipeCatalog([]), [])
  const matches = matchRecipeCatalog(normalizeIngredientInput('egg, tomato'), undefined, 2)
  assert.equal(matches.length, 2)
})

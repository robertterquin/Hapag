import assert from 'node:assert/strict'
import { test } from 'node:test'
import { clampServings, normalizeConstraints, scaleRecipe } from '../src/lib/recipeControls.ts'
import { recipeFixtures } from '../src/data/fixtures.ts'

test('serving controls clamp values to the supported range', () => {
  assert.equal(clampServings(0), 1)
  assert.equal(clampServings(3.6), 4)
  assert.equal(clampServings(99), 20)
  assert.equal(clampServings(Number.NaN), 1)
})

test('constraint normalization removes invalid budget and duplicate allergies', () => {
  const normalized = normalizeConstraints({ servings: 99, budgetLimit: -10, allergies: [' egg ', 'egg', ''], spiceLevel: 'hot' })
  assert.equal(normalized.servings, 20)
  assert.equal(normalized.budgetLimit, undefined)
  assert.deepEqual(normalized.allergies, ['egg'])
  assert.equal(normalized.dietaryPreference, 'none')
})

test('recipe scaling updates quantities, total cost, and cost lines', () => {
  const recipe = scaleRecipe(recipeFixtures[0], 6)
  assert.equal(recipe.servings, 6)
  assert.equal(recipe.estimatedCost.min, Math.round(recipeFixtures[0].estimatedCost.min * 2))
  assert.equal(recipe.costBreakdown[0].estimatedCost, Math.round(recipeFixtures[0].costBreakdown[0].estimatedCost * 2))
})

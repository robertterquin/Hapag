import assert from 'node:assert/strict'
import test from 'node:test'
import { recipeFixtures } from '../src/data/fixtures.ts'
import { validateRecipe } from '../src/schemas/recipeSchema.ts'

test('recipe results support authenticity and match metadata', () => {
  const recipe = validateRecipe({
    ...recipeFixtures[0],
    authenticity: 'classic',
    matchScore: 86,
  })
  assert.equal(recipe.authenticity, 'classic')
  assert.equal(recipe.matchScore, 86)
})

test('existing fixture recipes remain backward compatible without metadata', () => {
  const recipe = validateRecipe(recipeFixtures[0])
  assert.equal(recipe.authenticity, undefined)
  assert.equal(recipe.matchScore, undefined)
})

test('match score is constrained to a percentage', () => {
  assert.throws(() => validateRecipe({ ...recipeFixtures[0], matchScore: 101 }))
  assert.throws(() => validateRecipe({ ...recipeFixtures[0], matchScore: -1 }))
})

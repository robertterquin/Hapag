import assert from 'node:assert/strict'
import { test } from 'node:test'
import { recipeFixtures } from '../src/data/fixtures.ts'
import { RecipeValidationError, validateRecipe, validateRecipeList } from '../src/schemas/recipeSchema.ts'

test('all Phase 3 fixtures validate as recipe.v1', () => {
  const validated = validateRecipeList(recipeFixtures)
  assert.equal(validated.length, 3)
  assert.ok(validated.every((recipe) => recipe.schemaVersion === 'recipe.v1'))
})

test('malformed recipe data is rejected before rendering', () => {
  const malformed = { ...recipeFixtures[0], estimatedCost: { ...recipeFixtures[0].estimatedCost, min: 999, max: 1 } }

  assert.throws(() => validateRecipe(malformed), (error) => {
    assert.ok(error instanceof RecipeValidationError)
    assert.match(error.message, /failed validation/i)
    return true
  })
})

test('non-consecutive cooking steps are rejected', () => {
  const malformed = { ...recipeFixtures[0], steps: recipeFixtures[0].steps.map((step, index) => ({ ...step, order: index === 1 ? 4 : step.order })) }

  assert.throws(() => validateRecipe(malformed), RecipeValidationError)
})

import { validateRecipe, validateRecipeList } from './recipeSchema.ts'
import type { Recipe } from '../types/domain.ts'

export function adaptRecipePayload(payload: unknown): Recipe {
  return validateRecipe(payload)
}

export function adaptRecipeListPayload(payload: unknown): Recipe[] {
  return validateRecipeList(payload)
}

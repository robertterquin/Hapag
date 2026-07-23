import { validateRecipe, validateRecipeList } from './recipeSchema.ts'
import type { Recipe } from '../types/domain.ts'

function removeAdaptationTitlePrefix(recipe: Recipe): Recipe {
  if (recipe.authenticity !== 'hapag-adaptation') return recipe
  const title = recipe.title.replace(/^(?:hapag(?:\s+|-|:)\s*)+/i, '').trim()
  return title ? { ...recipe, title } : recipe
}

export function adaptRecipePayload(payload: unknown): Recipe {
  return removeAdaptationTitlePrefix(validateRecipe(payload))
}

export function adaptRecipeListPayload(payload: unknown): Recipe[] {
  return validateRecipeList(payload).map(removeAdaptationTitlePrefix)
}

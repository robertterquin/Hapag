import { validateRecipe, validateRecipeList } from './recipeSchema.ts'
import type { Recipe } from '../types/domain.ts'
import { generateDishCulinaryInsight } from '../lib/culinaryInsights.ts'

function removeAdaptationTitlePrefix(recipe: Recipe): Recipe {
  if (recipe.authenticity !== 'hapag-adaptation') return recipe
  const title = recipe.title.replace(/^(?:hapag(?:\s+|-|:)\s*)+/i, '').trim()
  return title ? { ...recipe, title } : recipe
}

function sanitizeRecipe(recipe: Recipe): Recipe {
  let cleaned = removeAdaptationTitlePrefix(recipe)
  if (
    !cleaned.matchReason ||
    /(?:candidate|score|\bgrounded\b|from the session|supplied|marked.*available|marks.*as unavailable|availableingredients|missingingredients|preserves.*identity|still needed|natural fit for this dish|already have on hand|minarkahang available)/i.test(
      cleaned.matchReason
    )
  ) {
    const availableNames = cleaned.ingredients.filter((i) => i.available).map((i) => i.name)
    cleaned = {
      ...cleaned,
      matchReason: generateDishCulinaryInsight(cleaned.title, availableNames),
    }
  }
  return cleaned
}

export function adaptRecipePayload(payload: unknown): Recipe {
  return sanitizeRecipe(validateRecipe(payload))
}

export function adaptRecipeListPayload(payload: unknown): Recipe[] {
  return validateRecipeList(payload).map(sanitizeRecipe)
}

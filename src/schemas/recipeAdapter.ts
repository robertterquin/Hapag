import { validateRecipe, validateRecipeList } from './recipeSchema.ts'
import type { Recipe } from '../types/domain.ts'

function removeAdaptationTitlePrefix(recipe: Recipe): Recipe {
  if (recipe.authenticity !== 'hapag-adaptation') return recipe
  const title = recipe.title.replace(/^(?:hapag(?:\s+|-|:)\s*)+/i, '').trim()
  return title ? { ...recipe, title } : recipe
}

function sanitizeRecipe(recipe: Recipe): Recipe {
  let cleaned = removeAdaptationTitlePrefix(recipe)
  if (cleaned.matchReason && /(?:candidate|match at \d+|availableingredients|minarkahang available|preserves classic|still needed:)/i.test(cleaned.matchReason)) {
    const availableNames = cleaned.ingredients.filter((i) => i.available).map((i) => i.name).join(', ')
    cleaned = {
      ...cleaned,
      matchReason: availableNames
        ? `Your ${availableNames} are a natural fit for this dish — the cooking method brings out the best in these ingredients without needing much else.`
        : cleaned.description,
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

import { validateRecipe, validateRecipeList } from './recipeSchema.ts'
import type { Recipe } from '../types/domain.ts'

function removeAdaptationTitlePrefix(recipe: Recipe): Recipe {
  if (recipe.authenticity !== 'hapag-adaptation') return recipe
  const title = recipe.title.replace(/^(?:hapag(?:\s+|-|:)\s*)+/i, '').trim()
  return title ? { ...recipe, title } : recipe
}

function sanitizeRecipe(recipe: Recipe): Recipe {
  let cleaned = removeAdaptationTitlePrefix(recipe)
  if (cleaned.matchReason && /(?:candidate match|match at \d+|supplied candidate|preserves classic .* identity|still needed:)/i.test(cleaned.matchReason)) {
    const availableNames = cleaned.ingredients.filter((i) => i.available).map((i) => i.name).join(', ')
    cleaned = {
      ...cleaned,
      matchReason: availableNames
        ? `Bagay lutuin gamit ang ${availableNames} na meron ka na sa kusina.`
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

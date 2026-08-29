import { validateRecipe, validateRecipeList } from './recipeSchema.ts'
import type { Recipe } from '../types/domain.ts'
import { generateDishCulinaryInsight } from '../lib/culinaryInsights.ts'

export function cleanDishTitle(title: string): string {
  if (!title || typeof title !== 'string') return ''
  const cleaned = title
    // Strip leading prefixes like "Hapag ", "Home-Style ", "Quick ", "Authentic "
    .replace(/^(?:hapag|home-style|quick|authentic)(?:\s+|-|:)\s*/i, '')
    // Strip artificial descriptive suffixes like "na may inihaw-style na bawang", "style na..."
    .replace(/\s+(?:na\s+may|may)\s+[a-z0-9\s-]+style(?:\s+na)?\s+[\w\s]+$/i, '')
    // Strip artificial aromatic compound suffixes like "sa sibuyas at paminta", "sa bawang at sibuyas"
    .replace(/\s+sa\s+(?:sibuyas|bawang|paminta|kamatis|luya|toyo|suka|mantika|asin|gata)(?:\s+(?:at|&)\s+(?:sibuyas|bawang|paminta|kamatis|luya|toyo|suka|mantika|asin|gata))?$/i, '')
    // Strip "with [ingredient] and [ingredient]"
    .replace(/\s+with\s+(?:garlic|onion|pepper|black pepper|ginger|salt|oil|soy sauce|vinegar)(?:\s+(?:and|&)\s+(?:garlic|onion|pepper|black pepper|ginger|salt|oil|soy sauce|vinegar))?$/i, '')
    .trim()

  return cleaned || title
}

function sanitizeRecipe(recipe: Recipe): Recipe {
  const title = cleanDishTitle(recipe.title)
  const localTitle = recipe.localTitle ? cleanDishTitle(recipe.localTitle) : recipe.localTitle
  let cleaned: Recipe = {
    ...recipe,
    title,
    localTitle,
  }
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

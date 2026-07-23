import type { NormalizedIngredient } from '../types/domain.ts'
import { filipinoRecipeCatalog } from '../data/filipinoRecipeCatalog.ts'
import type { FilipinoRecipeCatalogEntry } from '../data/filipinoRecipeCatalog.ts'

export type RecipeMatchKind = 'strong-match' | 'partial-match' | 'adaptation-candidate'

export interface RecipeMatch {
  dish: FilipinoRecipeCatalogEntry
  score: number
  kind: RecipeMatchKind
  availableIngredients: string[]
  missingIngredients: string[]
  optionalAvailableIngredients: string[]
}

function unique(values: string[]) {
  return [...new Set(values)]
}

function getCanonicalIngredients(ingredients: NormalizedIngredient[]) {
  return new Set(ingredients.map((ingredient) => ingredient.canonicalName))
}

function getMatchKind(score: number): RecipeMatchKind {
  if (score >= 75) return 'strong-match'
  if (score >= 40) return 'partial-match'
  return 'adaptation-candidate'
}

function scoreDish(dish: FilipinoRecipeCatalogEntry, available: Set<string>, ingredientFrequency: Map<string, number>): RecipeMatch {
  const required = unique(dish.requiredIngredients)
  const optional = unique(dish.optionalIngredients)
  const availableRequired = required.filter((ingredient) => available.has(ingredient))
  const missingRequired = required.filter((ingredient) => !available.has(ingredient))
  const availableOptional = optional.filter((ingredient) => available.has(ingredient))

  // Required ingredients drive the score; optional ingredients provide a small tie-breaker.
  const requiredScore = required.length === 0 ? 0 : (availableRequired.length / required.length) * 80
  const optionalScore = optional.length === 0 ? 0 : (availableOptional.length / optional.length) * 20
  const distinctiveBonus = availableRequired.some((ingredient) => (ingredientFrequency.get(ingredient) ?? 0) <= 2) ? 15 : 0
  const score = Math.min(100, Math.round(requiredScore + optionalScore + distinctiveBonus))

  return {
    dish,
    score,
    kind: getMatchKind(score),
    availableIngredients: availableRequired,
    missingIngredients: missingRequired,
    optionalAvailableIngredients: availableOptional,
  }
}

export function matchRecipeCatalog(
  ingredients: NormalizedIngredient[],
  catalog: FilipinoRecipeCatalogEntry[] = filipinoRecipeCatalog,
  limit = 3,
) {
  if (ingredients.length === 0 || limit <= 0) return []
  const available = getCanonicalIngredients(ingredients)
  const ingredientFrequency = new Map<string, number>()
  for (const dish of catalog) {
    for (const ingredient of unique(dish.requiredIngredients)) {
      ingredientFrequency.set(ingredient, (ingredientFrequency.get(ingredient) ?? 0) + 1)
    }
  }

  return catalog
    .map((dish) => scoreDish(dish, available, ingredientFrequency))
    .sort((left, right) => right.score - left.score || left.missingIngredients.length - right.missingIngredients.length || left.dish.name.localeCompare(right.dish.name))
    .slice(0, limit)
}

import type { NormalizedIngredient } from '../types/domain.ts'
import { filipinoRecipeCatalog } from '../data/filipinoRecipeCatalog.ts'
import type { FilipinoRecipeCatalogEntry } from '../data/filipinoRecipeCatalog.ts'
import { normalizeIngredientName } from '../lib/ingredientParser.ts'

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

function canonicalizeCatalogIngredients(values: string[]) {
  return unique(values.map((value) => normalizeIngredientName(value)))
}

function getCanonicalIngredients(ingredients: NormalizedIngredient[]) {
  return new Set(ingredients.map((ingredient) => ingredient.canonicalName))
}

function getMatchKind(score: number, matchedRequiredCount: number): RecipeMatchKind {
  if (score >= 75) return 'strong-match'
  if (score >= 40 && matchedRequiredCount >= 2) return 'partial-match'
  return 'adaptation-candidate'
}

function scoreDish(dish: FilipinoRecipeCatalogEntry, available: Set<string>, ingredientFrequency: Map<string, number>): RecipeMatch {
  const required = canonicalizeCatalogIngredients(dish.requiredIngredients)
  const optional = canonicalizeCatalogIngredients(dish.optionalIngredients)
  const availableRequired = required.filter((ingredient) => available.has(ingredient))
  const missingRequired = required.filter((ingredient) => !available.has(ingredient))
  const availableOptional = optional.filter((ingredient) => available.has(ingredient))

  // A single ingredient is not enough evidence for a catalog match. A distinctive
  // required ingredient can still support a candidate when the user supplied a
  // second ingredient, even if that second ingredient is not yet cataloged for it.
  const hasDistinctiveRequired = availableRequired.some((ingredient) => (ingredientFrequency.get(ingredient) ?? 0) <= 2)
  const hasMinimumEvidence = availableRequired.length >= 2 || (availableRequired.length === 1 && available.size >= 2 && hasDistinctiveRequired)
  // Required ingredients drive the score; optional ingredients provide a small tie-breaker.
  const requiredScore = !hasMinimumEvidence || required.length === 0 ? 0 : (availableRequired.length / required.length) * 80
  const optionalScore = !hasMinimumEvidence || optional.length === 0 ? 0 : (availableOptional.length / optional.length) * 20
  const distinctiveBonus = hasMinimumEvidence && hasDistinctiveRequired ? 15 : 0
  const score = Math.min(100, Math.round(requiredScore + optionalScore + distinctiveBonus))

  return {
    dish,
    score,
    kind: getMatchKind(score, availableRequired.length),
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

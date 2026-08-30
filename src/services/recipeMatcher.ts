import type { NormalizedIngredient } from '../types/domain.ts'
import { filipinoRecipeCatalog } from '../data/filipinoRecipeCatalog.ts'
import type { FilipinoRecipeCatalogEntry } from '../data/filipinoRecipeCatalog.ts'
import { normalizeIngredientName } from '../lib/ingredientParser.ts'
import { ingredientSubstitutionRules } from '../data/ingredientGroups.ts'
import { dishMatchingRules } from '../data/dishMatchingRules.ts'

export type RecipeMatchKind = 'strong-match' | 'partial-match' | 'adaptation-candidate'

export interface RecipeMatch {
  dish: FilipinoRecipeCatalogEntry
  score: number
  kind: RecipeMatchKind
  availableIngredients: string[]
  missingIngredients: string[]
  optionalAvailableIngredients: string[]
  substitutedIngredients: Array<{
    requiredIngredient: string
    providedIngredient: string
    note: string
  }>
}

// A catalog result needs meaningful evidence before it is sent to the AI.
// Keeping this threshold here makes the matcher safe for both the UI and the
// server-side generation prompt without changing their public interfaces.
export const MINIMUM_MATCH_SCORE = 20

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

function getSubstitution(requiredIngredient: string, available: Set<string>, dish: FilipinoRecipeCatalogEntry) {
  const dishRules = dish.commonSubstitutions.map((rule) => ({
    ingredient: normalizeIngredientName(rule.ingredient),
    substitute: normalizeIngredientName(rule.substitute),
    note: rule.note,
  }))
  const rules = [...dishRules, ...ingredientSubstitutionRules]
  return rules.find((rule) => rule.ingredient === requiredIngredient && available.has(rule.substitute))
}

function canonicalizeRuleValues(values: string[] = []) {
  return values.map((value) => normalizeIngredientName(value))
}

function passesIdentityRules(dish: FilipinoRecipeCatalogEntry, available: Set<string>) {
  const rule = dishMatchingRules[dish.id]
  if (!rule) return true

  const excluded = new Set(canonicalizeRuleValues(rule.excludedIfPresent))
  if ([...excluded].some((ingredient) => available.has(ingredient))) return false

  return (rule.requiredAny ?? []).every((group) => group.some((ingredient) => available.has(normalizeIngredientName(ingredient))))
}

function scoreDish(dish: FilipinoRecipeCatalogEntry, available: Set<string>, ingredientFrequency: Map<string, number>): RecipeMatch & { weightedScore: number } {
  const required = canonicalizeCatalogIngredients(dish.requiredIngredients)
  const optional = canonicalizeCatalogIngredients(dish.optionalIngredients)
  const essential = new Set(canonicalizeCatalogIngredients(dish.essentialIngredients))
  const identityRule = dishMatchingRules[dish.id]
  const availableRequired = required.filter((ingredient) => available.has(ingredient))
  const substitutedIngredients = required.flatMap((ingredient) => {
    if (available.has(ingredient)) return []
    const substitution = getSubstitution(ingredient, available, dish)
    return substitution ? [{ requiredIngredient: ingredient, providedIngredient: substitution.substitute, note: substitution.note }] : []
  })
  const substitutedRequired = new Set(substitutedIngredients.map((item) => item.requiredIngredient))
  const missingRequired = required.filter((ingredient) => !available.has(ingredient) && !substitutedRequired.has(ingredient))
  const availableOptional = optional.filter((ingredient) => available.has(ingredient))

  // A single ingredient is never enough evidence for a catalog match. The
  // second piece of evidence must be another required ingredient or an
  // explicitly accepted substitution; unrelated ingredients must not rescue a
  // weak candidate.
  const hasDistinctiveRequired = availableRequired.some((ingredient) => (ingredientFrequency.get(ingredient) ?? 0) <= 2)
  const evidenceCount = availableRequired.length + substitutedIngredients.length
  const hasMinimumEvidence = evidenceCount >= 2
  const primaryEssential = [...essential][0]
  const hasPrimaryEssentialEvidence = primaryEssential
    ? available.has(primaryEssential) || substitutedRequired.has(primaryEssential)
    : false
  // Required ingredients drive the score; optional ingredients provide a small tie-breaker.
  const passesRules = passesIdentityRules(dish, available)
  const requiredScore = !hasMinimumEvidence || !hasPrimaryEssentialEvidence || !passesRules || required.length === 0 ? 0 : ((availableRequired.length + substitutedIngredients.length * 0.15) / required.length) * 80
  const optionalScore = !hasMinimumEvidence || !hasPrimaryEssentialEvidence || !passesRules || optional.length === 0 ? 0 : (availableOptional.length / optional.length) * 20
  const distinctiveBonus = hasMinimumEvidence && hasPrimaryEssentialEvidence && passesRules && hasDistinctiveRequired ? 15 : 0
  const exactEssentialCount = availableRequired.filter((ingredient) => essential.has(ingredient)).length
  const substitutedEssentialCount = substitutedIngredients.filter((item) => essential.has(item.requiredIngredient)).length
  const essentialCoverage = essential.size === 0
    ? 0
    : (exactEssentialCount + substitutedEssentialCount * 0.15) / essential.size
  const essentialPenalty = essential.size === 0 ? 0 : 0.7 + Math.min(1, essentialCoverage) * 0.3
  const score = Math.min(100, Math.round((requiredScore + optionalScore + distinctiveBonus) * essentialPenalty))
  const preferredMatches = canonicalizeRuleValues(identityRule?.preferredIngredients).filter((ingredient) => available.has(ingredient)).length
  const weightedScore = Math.round(score * 0.6 + essentialCoverage * 40 + preferredMatches * 2)

  return {
    dish,
    score,
    kind: getMatchKind(score, evidenceCount),
    availableIngredients: availableRequired,
    missingIngredients: missingRequired,
    optionalAvailableIngredients: availableOptional,
    substitutedIngredients,
    weightedScore,
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
    for (const ingredient of canonicalizeCatalogIngredients(dish.requiredIngredients)) {
      ingredientFrequency.set(ingredient, (ingredientFrequency.get(ingredient) ?? 0) + 1)
    }
  }

  return catalog
    .map((dish) => scoreDish(dish, available, ingredientFrequency))
    .filter((match) => match.score >= MINIMUM_MATCH_SCORE)
    .sort((left, right) => right.weightedScore - left.weightedScore || right.score - left.score || left.substitutedIngredients.length - right.substitutedIngredients.length || left.missingIngredients.length - right.missingIngredients.length || left.dish.name.localeCompare(right.dish.name))
    .slice(0, limit)
    .map((match) => {
      const { weightedScore, ...publicMatch } = match
      void weightedScore
      return publicMatch
    })
}

export function countRecipeMatches(
  ingredients: NormalizedIngredient[],
  catalog: FilipinoRecipeCatalogEntry[] = filipinoRecipeCatalog,
) {
  if (ingredients.length === 0) return 0
  const available = getCanonicalIngredients(ingredients)
  const ingredientFrequency = new Map<string, number>()
  for (const dish of catalog) {
    for (const ingredient of canonicalizeCatalogIngredients(dish.requiredIngredients)) {
      ingredientFrequency.set(ingredient, (ingredientFrequency.get(ingredient) ?? 0) + 1)
    }
  }
  return catalog
    .map((dish) => scoreDish(dish, available, ingredientFrequency))
    .filter((match) => match.score >= MINIMUM_MATCH_SCORE)
    .length
}

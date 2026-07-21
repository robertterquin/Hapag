import type { GenerationConstraints, Recipe } from '../types/domain.ts'

export const MIN_SERVINGS = 1
export const MAX_SERVINGS = 20

export function clampServings(value: number) {
  if (!Number.isFinite(value)) return MIN_SERVINGS
  return Math.min(MAX_SERVINGS, Math.max(MIN_SERVINGS, Math.round(value)))
}

export function normalizeConstraints(constraints: GenerationConstraints): GenerationConstraints {
  const budgetLimit = constraints.budgetLimit !== undefined && Number.isFinite(constraints.budgetLimit) && constraints.budgetLimit > 0 ? Math.round(constraints.budgetLimit) : undefined
  return { ...constraints, servings: clampServings(constraints.servings), budgetLimit, allergies: [...new Set(constraints.allergies.map((allergy) => allergy.trim()).filter(Boolean))], dietaryPreference: constraints.dietaryPreference ?? 'none', spiceLevel: constraints.spiceLevel ?? 'mild' }
}

export function scaleRecipe(recipe: Recipe, requestedServings: number): Recipe {
  const servings = clampServings(requestedServings)
  const factor = servings / recipe.servings
  const scale = (value: number) => Math.round(value * factor * 10) / 10
  return { ...recipe, servings, ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient, quantity: typeof ingredient.quantity === 'number' ? scale(ingredient.quantity) : ingredient.quantity })), estimatedCost: { ...recipe.estimatedCost, min: Math.round(recipe.estimatedCost.min * factor), max: Math.round(recipe.estimatedCost.max * factor) }, costBreakdown: recipe.costBreakdown.map((line) => ({ ...line, estimatedCost: Math.round(line.estimatedCost * factor) })) }
}

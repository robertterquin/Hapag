import type { IngredientUnit, Recipe } from '../types/domain.ts'

export function formatCost(cost: Recipe['estimatedCost']) {
  return `₱${cost.min}–₱${cost.max}`
}

export function formatUnit(unit: IngredientUnit, quantity?: number | string) {
  const isPlural = typeof quantity === 'number' ? quantity > 1 : false
  const units: Record<IngredientUnit, string> = {
    piece: isPlural ? 'pcs' : 'pc',
    can: isPlural ? 'cans' : 'can',
    bundle: isPlural ? 'bundles' : 'bundle',
    clove: isPlural ? 'cloves' : 'clove',
    cup: isPlural ? 'cups' : 'cup',
    tablespoon: 'tbsp',
    teaspoon: 'tsp',
    pinch: isPlural ? 'pinches' : 'pinch',
    gram: 'g',
    kilogram: 'kg',
    block: isPlural ? 'blocks' : 'block',
    'to-taste': 'to taste',
  }
  return units[unit] || unit
}

export function formatQuantity(quantity: number | string, unit: IngredientUnit) {
  if (unit === 'to-taste') return 'to taste'
  return `${quantity} ${formatUnit(unit, quantity)}`
}


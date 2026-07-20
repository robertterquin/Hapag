import type { IngredientUnit, Recipe } from '../types/domain.ts'

export function formatCost(cost: Recipe['estimatedCost']) {
  return `₱${cost.min}–₱${cost.max}`
}

export function formatUnit(unit: IngredientUnit) {
  const units: Record<IngredientUnit, string> = {
    piece: 'piraso',
    can: 'lata',
    bundle: 'tali',
    clove: 'butil',
    cup: 'tasa',
    tablespoon: 'kutsara',
    teaspoon: 'kutsarita',
    pinch: 'pakurot',
    gram: 'gramo',
    kilogram: 'kilo',
    block: 'block',
    'to-taste': 'ayon sa panlasa',
  }
  return units[unit]
}

export function formatQuantity(quantity: number | string, unit: IngredientUnit) {
  return `${quantity} ${formatUnit(unit)}`
}

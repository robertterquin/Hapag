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

export function formatTagalogSangkap(count: number, capitalize = false): string {
  const map: Record<number, string> = {
    1: 'isang sangkap',
    2: 'dalawang sangkap',
    3: 'tatlong sangkap',
    4: 'apat na sangkap',
    5: 'limang sangkap',
    6: 'anim na sangkap',
    7: 'pitong sangkap',
    8: 'walong sangkap',
    9: 'siyam na sangkap',
    10: 'sampung sangkap',
    11: 'labing-isang sangkap',
    12: 'labindalawang sangkap',
  }
  const result = count <= 0 ? 'walang sangkap' : (map[count] ?? `${count} na sangkap`)
  return capitalize ? result.charAt(0).toUpperCase() + result.slice(1) : result
}


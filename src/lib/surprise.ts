import { filipinoRecipeCatalog } from '../data/filipinoRecipeCatalog.ts'
import type { FilipinoRecipeCatalogEntry } from '../data/filipinoRecipeCatalog.ts'

const everydayMealTypes = new Set(['main-dish', 'soup', 'stew', 'vegetable-dish'])

export function getEverydayDishes(catalog: readonly FilipinoRecipeCatalogEntry[] = filipinoRecipeCatalog) {
  return catalog.filter((dish) => everydayMealTypes.has(dish.mealType) && dish.verificationStatus === 'reviewed')
}

// Picks a random everyday ulam; `random` is injectable so tests can be deterministic.
export function pickSurpriseDish(catalog: readonly FilipinoRecipeCatalogEntry[] = filipinoRecipeCatalog, random: () => number = Math.random) {
  const pool = getEverydayDishes(catalog)
  if (pool.length === 0) return undefined
  const index = Math.min(pool.length - 1, Math.floor(random() * pool.length))
  return pool[index]
}

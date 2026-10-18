import { normalizeIngredientName } from './ingredientParser.ts'

// Pantry staples are ingredients a household almost always has. They are stored as canonical
// ingredient names (the parser's English names, e.g. "oil", "soy sauce").

export const stapleCandidates = [
  'garlic', 'onion', 'oil', 'salt', 'soy sauce', 'vinegar',
  'black pepper', 'fish sauce', 'sugar', 'ginger', 'tomato', 'egg', 'uncooked rice',
] as const

export const defaultStaples: readonly string[] = ['garlic', 'onion', 'oil', 'salt', 'soy sauce', 'vinegar']

export const STAPLES_STORAGE_KEY = 'hapag_pantry_staples'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

// Returns null when nothing valid was saved, so callers can fall back to the defaults.
export function parseStoredStaples(raw: string | null): string[] | null {
  if (raw === null) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (!Array.isArray(value)) return null
    return [...new Set(value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map((item) => item.trim().toLowerCase()))]
  } catch {
    return null
  }
}

export function readStoredStaples(storage: StorageLike | undefined = globalThis.localStorage): string[] | null {
  try {
    return parseStoredStaples(storage?.getItem(STAPLES_STORAGE_KEY) ?? null)
  } catch {
    return null
  }
}

export function writeStoredStaples(staples: readonly string[], storage: StorageLike | undefined = globalThis.localStorage) {
  try {
    storage?.setItem(STAPLES_STORAGE_KEY, JSON.stringify(staples))
  } catch {
    // Storage can be full or blocked; staples still work for this session.
  }
}

export function toggleStapleInList(staples: readonly string[], canonicalName: string) {
  return staples.includes(canonicalName)
    ? staples.filter((item) => item !== canonicalName)
    : [...staples, canonicalName]
}

// Staples that are not already in the current ingredient list.
export function staplesToAdd(staples: readonly string[], currentCanonicalNames: readonly string[]) {
  const current = new Set(currentCanonicalNames)
  return staples.filter((item) => !current.has(item))
}

// Ingredients most Filipino kitchens keep on hand. Recipes that "miss" one of these show it as
// a neutral staple rather than a red missing ingredient.
const commonStaples = new Set(['garlic', 'onion', 'oil', 'salt', 'black pepper', 'soy sauce', 'vinegar', 'fish sauce', 'sugar', 'water'])

// Accepts English, Tagalog, or canonical names ("Bawang", "garlic", "cooking oil").
export function isPantryStaple(name: string) {
  return commonStaples.has(normalizeIngredientName(name))
}

export type IngredientStatus = 'have' | 'staple' | 'missing'

// One rule for cards and the detail page: provided > staple > missing.
export function getIngredientStatus(line: { name: string; canonicalName: string; available: boolean }): IngredientStatus {
  if (line.available) return 'have'
  return isPantryStaple(line.canonicalName) || isPantryStaple(line.name) ? 'staple' : 'missing'
}

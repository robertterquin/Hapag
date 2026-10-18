import { adaptRecipePayload } from '../schemas/recipeAdapter.ts'
import type { Recipe } from '../types/domain.ts'

// Generated recipes only live in memory, so /recipes/:id would break on refresh or when the
// link is opened in a new tab. Keep the most recent ones for the browser session.
export const RECENT_RECIPES_KEY = 'hapag_recent_recipes'
export const MAX_RECENT_RECIPES = 12

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

function sessionStore(): StorageLike | undefined {
  try {
    return globalThis.sessionStorage
  } catch {
    return undefined
  }
}

// Newest first; a recipe seen again moves to the front instead of being duplicated.
export function mergeRecentRecipes(existing: readonly Recipe[], incoming: readonly Recipe[]) {
  const incomingIds = new Set(incoming.map((recipe) => recipe.id))
  return [...incoming, ...existing.filter((recipe) => !incomingIds.has(recipe.id))].slice(0, MAX_RECENT_RECIPES)
}

// Every stored recipe is re-validated; anything corrupt or from an older schema is dropped.
export function loadRecentRecipes(storage: StorageLike | undefined = sessionStore()): Recipe[] {
  let raw: string | null
  try {
    raw = storage?.getItem(RECENT_RECIPES_KEY) ?? null
  } catch {
    return []
  }
  if (!raw) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  return parsed.flatMap((item) => {
    try {
      return [adaptRecipePayload(item)]
    } catch {
      return []
    }
  })
}

export function saveRecentRecipes(recipes: readonly Recipe[], storage: StorageLike | undefined = sessionStore()) {
  try {
    storage?.setItem(RECENT_RECIPES_KEY, JSON.stringify(mergeRecentRecipes(loadRecentRecipes(storage), recipes)))
  } catch {
    // Storage can be full or blocked; the recipe still works until the page is reloaded.
  }
}

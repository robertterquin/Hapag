import { useState } from 'react'

export function useSavedRecipes() {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [cookedIds, setCookedIds] = useState<string[]>([])

  const toggleSaved = (recipeId: string) => {
    setSavedIds((ids) => ids.includes(recipeId) ? ids.filter((id) => id !== recipeId) : [...ids, recipeId])
  }

  const toggleCooked = (recipeId: string) => {
    setCookedIds((ids) => ids.includes(recipeId) ? ids.filter((id) => id !== recipeId) : [...ids, recipeId])
  }

  return { savedIds, cookedIds, toggleSaved, toggleCooked }
}

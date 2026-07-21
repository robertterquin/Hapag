import { useEffect, useState } from 'react'
import { recipeService } from '../services/recipeService.ts'
import type { Recipe } from '../types/domain.ts'

export type RecipeLoadStatus = 'loading' | 'success' | 'error'

export function useRecipe(recipeId: string) {
  const [state, setState] = useState<{ recipeId: string; recipe?: Recipe; status: RecipeLoadStatus }>({ recipeId, status: 'loading' })

  useEffect(() => {
    let active = true
    recipeService.getRecipe(recipeId).then((nextRecipe) => {
      if (!active) return
      setState({ recipeId, recipe: nextRecipe, status: nextRecipe ? 'success' : 'error' })
    }).catch(() => {
      if (active) setState({ recipeId, status: 'error' })
    })
    return () => { active = false }
  }, [recipeId])

  if (state.recipeId !== recipeId) return { recipe: undefined, status: 'loading' as const }
  return { recipe: state.recipe, status: state.status }
}

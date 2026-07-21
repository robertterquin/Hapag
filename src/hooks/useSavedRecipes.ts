import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { recipeService } from '../services/recipeService.ts'
import { persistenceService } from '../services/persistenceService.ts'
import type { Recipe } from '../types/domain.ts'

export function useSavedRecipes(session: Session | null) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [cookedRecipes, setCookedRecipes] = useState<Recipe[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    let mounted = true
    void persistenceService.loadRecipeState(session.user.id).then((state) => {
      if (mounted) { setSavedRecipes(state.saved); setCookedRecipes(state.cooked); setStatus('ready') }
    }).catch((reason: unknown) => {
      if (mounted) { setError(reason instanceof Error ? reason.message : 'Unable to load saved recipes.'); setStatus('error') }
    })
    return () => { mounted = false }
  }, [session])

  const toggleSaved = async (recipeId: string) => {
    if (!session) throw new Error('Sign in to save recipes.')
    const alreadySaved = savedRecipes.some((recipe) => recipe.id === recipeId)
    if (alreadySaved) {
      await persistenceService.removeSavedRecipe(session.user.id, recipeId)
      setSavedRecipes((recipes) => recipes.filter((recipe) => recipe.id !== recipeId))
      return
    }
    const recipe = await recipeService.getRecipe(recipeId)
    if (!recipe) throw new Error('This recipe is no longer available.')
    await persistenceService.saveRecipe(session.user.id, recipe)
    setSavedRecipes((recipes) => [recipe, ...recipes.filter((item) => item.id !== recipe.id)])
  }

  const toggleCooked = async (recipeId: string) => {
    if (!session) throw new Error('Sign in to record cooked recipes.')
    const recipe = await recipeService.getRecipe(recipeId)
    if (!recipe) throw new Error('This recipe is no longer available.')
    await persistenceService.markCooked(session.user.id, recipe)
    setCookedRecipes((recipes) => [recipe, ...recipes])
  }

  return {
    savedIds: savedRecipes.map((recipe) => recipe.id), cookedIds: cookedRecipes.map((recipe) => recipe.id),
    savedRecipes, cookedRecipes, status, error, toggleSaved, toggleCooked,
  }
}

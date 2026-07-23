import { useCallback, useMemo, useState } from 'react'
import type { Recipe } from '../types/domain.ts'

export type RecipeFeedbackKind = 'helpful' | 'not-relevant' | 'missing-ingredient' | 'not-filipino'
export type RecipeFeedbackMap = Record<string, RecipeFeedbackKind>

const STORAGE_KEY = 'hapag.recipe-feedback.v1'

function readFeedback(): RecipeFeedbackMap {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => value === 'helpful' || value === 'not-relevant' || value === 'missing-ingredient' || value === 'not-filipino'))
  } catch { return {} }
}

function writeFeedback(feedback: RecipeFeedbackMap) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback)) } catch { /* optional browser storage */ }
}

export function useRecipeFeedback() {
  const [feedback, setFeedback] = useState<RecipeFeedbackMap>(readFeedback)
  const setRecipeFeedback = useCallback((recipeId: string, kind: RecipeFeedbackKind) => {
    setFeedback((current) => {
      const next = current[recipeId] === kind ? Object.fromEntries(Object.entries(current).filter(([id]) => id !== recipeId)) : { ...current, [recipeId]: kind }
      writeFeedback(next)
      return next
    })
  }, [])
  const rankRecipes = useCallback((recipes: Recipe[]) => [...recipes].sort((left, right) => {
    const weight = (recipe: Recipe) => feedback[recipe.id] === 'helpful' ? 2 : feedback[recipe.id] === 'missing-ingredient' ? -1 : feedback[recipe.id] === 'not-relevant' || feedback[recipe.id] === 'not-filipino' ? -2 : 0
    return weight(right) - weight(left)
  }), [feedback])
  return useMemo(() => ({ feedback, setRecipeFeedback, rankRecipes }), [feedback, setRecipeFeedback, rankRecipes])
}

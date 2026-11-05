import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { persistenceService } from '../services/persistenceService.ts'
import type { Recipe } from '../types/domain.ts'

export type RecipeFeedbackKind = 'helpful' | 'not-relevant' | 'missing-ingredient' | 'not-filipino'
export type RecipeFeedbackMap = Record<string, RecipeFeedbackKind>

const STORAGE_KEY = 'hapag.recipe-feedback.v1'

const isKind = (value: unknown): value is RecipeFeedbackKind => value === 'helpful' || value === 'not-relevant' || value === 'missing-ingredient' || value === 'not-filipino'

function readFeedback(): RecipeFeedbackMap {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => isKind(value)))
  } catch { return {} }
}

function writeFeedback(feedback: RecipeFeedbackMap) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback)) } catch { /* Storage can be full or blocked; feedback still works for this session. */ }
}

const toggled = (current: RecipeFeedbackMap, recipeId: string, kind: RecipeFeedbackKind): RecipeFeedbackMap =>
  current[recipeId] === kind ? Object.fromEntries(Object.entries(current).filter(([id]) => id !== recipeId)) : { ...current, [recipeId]: kind }

// Signed-in cooks read and keep feedback in Supabase (recipe_feedback); only signed-out visitors use this browser.
export function useRecipeFeedback(session: Session | null) {
  const userId = session?.user.id
  const [local, setLocal] = useState<RecipeFeedbackMap>(readFeedback)
  const [remote, setRemote] = useState<{ userId: string; feedback: RecipeFeedbackMap } | null>(null)

  useEffect(() => {
    if (!userId) return
    let active = true
    persistenceService.loadRecipeFeedback(userId)
      .then((rows) => { if (active) setRemote({ userId, feedback: Object.fromEntries(rows.filter((row) => isKind(row.feedback_type)).map((row) => [row.recipe_id, row.feedback_type as RecipeFeedbackKind])) }) })
      .catch(() => { if (active) setRemote({ userId, feedback: {} }) })
    return () => { active = false }
  }, [userId])

  const feedback = useMemo(() => (userId ? (remote?.userId === userId ? remote.feedback : {}) : local), [userId, remote, local])

  const setRecipeFeedback = useCallback((recipeId: string, kind: RecipeFeedbackKind) => {
    if (userId) {
      setRemote((current) => ({ userId, feedback: toggled(current?.userId === userId ? current.feedback : {}, recipeId, kind) }))
      return
    }
    setLocal((current) => {
      const next = toggled(current, recipeId, kind)
      writeFeedback(next)
      return next
    })
  }, [userId])
  const rankRecipes = useCallback((recipes: Recipe[]) => [...recipes].sort((left, right) => {
    const weight = (recipe: Recipe) => feedback[recipe.id] === 'helpful' ? 2 : feedback[recipe.id] === 'missing-ingredient' ? -1 : feedback[recipe.id] === 'not-relevant' || feedback[recipe.id] === 'not-filipino' ? -2 : 0
    return weight(right) - weight(left)
  }), [feedback])
  return useMemo(() => ({ feedback, setRecipeFeedback, rankRecipes }), [feedback, setRecipeFeedback, rankRecipes])
}

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { recipeService } from '../services/recipeService.ts'
import { persistenceService } from '../services/persistenceService.ts'
import type { NormalizedIngredient } from '../types/domain.ts'

export function usePantry(session: Session | null) {
  const [pantryItems, setPantryItems] = useState<NormalizedIngredient[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    if (!session) {
      void Promise.resolve().then(() => { if (mounted) { setPantryItems([]); setStatus('ready'); setError(null) } })
      return () => { mounted = false }
    }
    void persistenceService.loadPantryItems(session.user.id).then((items) => {
      if (mounted) { setPantryItems(items); setStatus('ready') }
    }).catch((reason: unknown) => {
      if (mounted) { setError(reason instanceof Error ? reason.message : 'Unable to load your pantry.'); setStatus('error') }
    })
    return () => { mounted = false }
  }, [session])

  const addPantryItem = async (value: string) => {
    const additions = recipeService.normalizeIngredients(value)
    const uniqueAdditions = additions.filter((addition) => !pantryItems.some((item) => item.name.toLowerCase() === addition.name.toLowerCase()))
    if (!session) {
      setPantryItems((items) => [...items, ...uniqueAdditions])
      return
    }
    try {
      const savedItems = await Promise.all(uniqueAdditions.map((item) => persistenceService.savePantryItem(session.user.id, item)))
      setPantryItems((items) => [...items, ...savedItems.filter((item) => !items.some((existing) => existing.name.toLowerCase() === item.name.toLowerCase()))])
      setError(null)
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Unable to save pantry items.')
    }
  }

  const removePantryItem = async (id: string) => {
    if (session) {
      try { await persistenceService.removePantryItem(session.user.id, id) } catch (reason: unknown) { setError(reason instanceof Error ? reason.message : 'Unable to remove this pantry item.'); return }
    }
    setPantryItems((items) => items.filter((item) => item.id !== id))
  }

  return { pantryItems, status, error, addPantryItem, removePantryItem }
}

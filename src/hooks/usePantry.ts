import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { recipeService } from '../services/recipeService.ts'
import { persistenceService } from '../services/persistenceService.ts'
import type { NormalizedIngredient, PantryUnit } from '../types/domain.ts'
import { getErrorMessage } from '../lib/errors.ts'

export interface PantryItemUpdate {
  id: string
  name: string
  quantity: number
  unit: PantryUnit
}

function withPantrySource(item: NormalizedIngredient): NormalizedIngredient {
  return { ...item, source: 'pantry' }
}

export function usePantry(session: Session | null) {
  const [pantryItems, setPantryItems] = useState<NormalizedIngredient[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let mounted = true
    if (!session) {
      void Promise.resolve().then(() => {
        if (mounted) { setPantryItems([]); setStatus('ready'); setError(null) }
      })
      return () => { mounted = false }
    }
    void Promise.resolve().then(() => { if (mounted) setStatus('loading') })
    void persistenceService.loadPantryItems(session.user.id).then((items) => {
      if (mounted) { setPantryItems(items); setStatus('ready'); setError(null) }
    }).catch((reason: unknown) => {
      if (mounted) { setError(getErrorMessage(reason, 'Unable to load your pantry.')); setStatus('error') }
    })
    return () => { mounted = false }
  }, [session, reloadKey])

  const addPantryItems = async (value: string) => {
    const additions = recipeService.normalizeIngredients(value, 'pantry')
    if (additions.length === 0) return

    try {
      const workingItems = [...pantryItems]
      const operations: Array<{ type: 'insert' | 'update'; item: NormalizedIngredient }> = []
      for (const addition of additions) {
        const existingIndex = workingItems.findIndex((item) => item.canonicalName === addition.canonicalName)
        if (existingIndex >= 0) {
          const existing = workingItems[existingIndex]
          if (existing.unit !== addition.unit) {
            throw new Error(`${existing.name} is already measured in ${existing.unit}. Edit the existing row instead of mixing units.`)
          }
          const merged = withPantrySource({ ...existing, quantity: existing.quantity + addition.quantity, originalText: `${existing.originalText}, ${addition.originalText}` })
          workingItems[existingIndex] = merged
          operations.push({ type: 'update', item: merged })
        } else {
          const additionForPantry = withPantrySource(addition)
          workingItems.push(additionForPantry)
          operations.push({ type: 'insert', item: additionForPantry })
        }
      }
      if (session) {
        const savedItems: NormalizedIngredient[] = []
        for (const { type, item } of operations) {
          savedItems.push(type === 'insert' ? await persistenceService.savePantryItem(session.user.id, item) : await persistenceService.updatePantryItem(session.user.id, item))
        }
        const savedByCanonicalName = new Map(savedItems.map((item) => [item.canonicalName, item]))
        setPantryItems(workingItems.map((item) => savedByCanonicalName.get(item.canonicalName) ?? item))
      } else {
        setPantryItems(workingItems)
      }
      setError(null)
    } catch (reason: unknown) {
      setError(getErrorMessage(reason, 'Unable to save pantry items.'))
    }
  }

  const updatePantryItem = async ({ id, name, quantity, unit }: PantryItemUpdate) => {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError('Quantity must be greater than zero.')
      return
    }
    const parsed = recipeService.normalizeIngredients(name, 'pantry')[0]
    const existing = pantryItems.find((item) => item.id === id)
    if (!parsed || !existing) {
      setError('Enter a valid ingredient name.')
      return
    }
    if (pantryItems.some((item) => item.id !== id && item.canonicalName === parsed.canonicalName)) {
      setError(`${parsed.name} is already in your pantry. Edit the existing row instead.`)
      return
    }
    const updated = withPantrySource({ ...existing, ...parsed, id, name: parsed.name, originalText: name.trim(), quantity, unit })
    try {
      const saved = session ? await persistenceService.updatePantryItem(session.user.id, updated) : updated
      setPantryItems((items) => items.map((item) => item.id === id ? saved : item))
      setError(null)
    } catch (reason: unknown) {
      setError(getErrorMessage(reason, 'Unable to update this pantry item.'))
    }
  }

  const removePantryItem = async (id: string) => {
    try {
      if (session) await persistenceService.removePantryItem(session.user.id, id)
      setPantryItems((items) => items.filter((item) => item.id !== id))
      setError(null)
    } catch (reason: unknown) {
      setError(getErrorMessage(reason, 'Unable to remove this pantry item.'))
    }
  }

  return {
    pantryItems,
    status,
    error,
    reload: () => setReloadKey((key) => key + 1),
    addPantryItems,
    updatePantryItem,
    removePantryItem,
  }
}

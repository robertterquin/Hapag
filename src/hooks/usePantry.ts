import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { normalizeIngredientDraft } from '../lib/ingredientParser.ts'
import { persistenceService } from '../services/persistenceService.ts'
import type { IngredientDraft, NormalizedIngredient } from '../types/domain.ts'
import { getErrorMessage } from '../lib/errors.ts'

export interface PantryItemUpdate { id: string; name: string }

function withPantrySource(item: NormalizedIngredient): NormalizedIngredient {
  return { ...item, quantity: 1, unit: 'piece', source: 'pantry' }
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

  const addPantryItem = async (input: IngredientDraft) => {
    const addition = normalizeIngredientDraft(input, 'pantry')
    if (!addition) {
      const validationError = new Error('Enter an ingredient name.')
      setError(validationError.message)
      throw validationError
    }
    try {
      const workingItems = [...pantryItems]
      const operations: Array<{ type: 'insert' | 'update'; item: NormalizedIngredient }> = []
      const existingIndex = workingItems.findIndex((item) => item.canonicalName === addition.canonicalName)
      if (existingIndex >= 0) {
        throw new Error(`${workingItems[existingIndex].name} is already in My Ingredients.`)
      } else {
        const additionForPantry = withPantrySource(addition)
        workingItems.push(additionForPantry)
        operations.push({ type: 'insert', item: additionForPantry })
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
      throw reason
    }
  }

  const updatePantryItem = async ({ id, name }: PantryItemUpdate) => {
    const parsed = normalizeIngredientDraft({ name }, 'pantry')
    const existing = pantryItems.find((item) => item.id === id)
    if (!parsed || !existing) {
      const validationError = new Error('Enter a valid ingredient name.')
      setError(validationError.message)
      throw validationError
    }
    if (pantryItems.some((item) => item.id !== id && item.canonicalName === parsed.canonicalName)) {
      const validationError = new Error(`${parsed.name} is already in your pantry. Edit the existing row instead.`)
      setError(validationError.message)
      throw validationError
    }
    const updated = withPantrySource({ ...existing, ...parsed, id, name: parsed.name, originalText: name.trim() })
    try {
      const saved = session ? await persistenceService.updatePantryItem(session.user.id, updated) : updated
      setPantryItems((items) => items.map((item) => item.id === id ? saved : item))
      setError(null)
    } catch (reason: unknown) {
      setError(getErrorMessage(reason, 'Unable to update this pantry item.'))
      throw reason
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
    addPantryItem,
    updatePantryItem,
    removePantryItem,
  }
}

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { persistenceService } from '../services/persistenceService.ts'
import { normalizeIngredientInput } from '../lib/ingredientParser.ts'
import { defaultStaples, readStoredStaples, toggleStapleInList, writeStoredStaples } from '../lib/pantryStaples.ts'

interface RemoteStaples {
  userId: string
  staples: string[]
}

function stapleRow(canonicalName: string) {
  return { canonicalName, name: normalizeIngredientInput(canonicalName)[0]?.name ?? canonicalName }
}

// Signed-in users keep staples in Supabase pantry_items; everyone else uses this browser.
export function useKusinaStaples(session: Session | null) {
  const userId = session?.user.id
  const [localStaples, setLocalStaples] = useState<string[]>(() => readStoredStaples() ?? [...defaultStaples])
  const [remote, setRemote] = useState<RemoteStaples | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    let active = true
    void (async () => {
      try {
        let staples = await persistenceService.loadPantryStaples(userId)
        if (staples.length === 0) {
          // First sign-in on this account: carry over what this browser already had.
          staples = readStoredStaples() ?? [...defaultStaples]
          await Promise.all(staples.map((item) => persistenceService.addPantryStaple(userId, stapleRow(item))))
        }
        if (active) { setRemote({ userId, staples }); setError(null) }
      } catch {
        if (active) setError('Could not load your saved staples.')
      }
    })()
    return () => { active = false }
  }, [userId])

  const isRemote = Boolean(userId && remote?.userId === userId)
  const staples = isRemote && remote ? remote.staples : localStaples

  const toggleStaple = async (canonicalName: string) => {
    const next = toggleStapleInList(staples, canonicalName)
    if (!userId) {
      setLocalStaples(next)
      writeStoredStaples(next)
      return
    }
    const previous = staples
    setRemote({ userId, staples: next })
    try {
      if (next.includes(canonicalName)) await persistenceService.addPantryStaple(userId, stapleRow(canonicalName))
      else await persistenceService.removePantryStaple(userId, canonicalName)
      setError(null)
    } catch {
      setRemote({ userId, staples: previous })
      setError('Could not update your staples. Please try again.')
    }
  }

  return { staples, toggleStaple, error }
}

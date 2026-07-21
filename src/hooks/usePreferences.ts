import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { persistenceService, type UserPreferences } from '../services/persistenceService.ts'

export const defaultPreferences: UserPreferences = { language: 'Taglish', default_servings: 3, dietary_preference: 'none', allergies: [], spice_level: 'mild' }

export function usePreferences(session: Session | null) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'saving' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    let mounted = true
    void persistenceService.loadPreferences(session.user.id).then((value) => {
      if (mounted) { setPreferences(value ?? defaultPreferences); setStatus('ready') }
    }).catch((reason: unknown) => {
      if (mounted) { setError(reason instanceof Error ? reason.message : 'Unable to load preferences.'); setStatus('error') }
    })
    return () => { mounted = false }
  }, [session])

  const save = async (next: UserPreferences) => {
    if (!session) throw new Error('Sign in to save preferences.')
    setStatus('saving'); setError(null)
    try { await persistenceService.savePreferences(session.user.id, next); setPreferences(next); setStatus('ready') } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Unable to save preferences.'); setStatus('error'); throw reason
    }
  }

  return { preferences, status, error, save }
}

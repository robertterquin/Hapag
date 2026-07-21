import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase.ts'
import { persistenceService } from '../services/persistenceService.ts'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(supabase ? 'loading' : 'ready')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return undefined
    let mounted = true
    void persistenceService.getSession().then((currentSession) => {
      if (mounted) { setSession(currentSession); setStatus('ready') }
    }).catch((reason: unknown) => {
      if (mounted) { setError(reason instanceof Error ? reason.message : 'Unable to load your account.'); setStatus('error') }
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) { setSession(nextSession); setStatus('ready'); setError(null) }
    })
    return () => { mounted = false; data.subscription.unsubscribe() }
  }, [])

  const signIn = async (email: string) => {
    setError(null)
    try { await persistenceService.signInWithOtp(email) } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : 'Unable to send the sign-in link.'
      setError(message); throw reason
    }
  }

  const signOut = async () => { await persistenceService.signOut() }

  return { session, status, error, signIn, signOut }
}

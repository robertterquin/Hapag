import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase.ts'
import { persistenceService } from '../services/persistenceService.ts'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(supabase ? 'loading' : 'ready')
  const [error, setError] = useState<string | null>(null)
  // True after the user opens a password-reset link, until they set a new password.
  const [recovering, setRecovering] = useState(false)

  useEffect(() => {
    if (!supabase) return undefined
    let mounted = true
    void persistenceService.getSession().then((currentSession) => {
      if (mounted) { setSession(currentSession); setStatus('ready') }
    }).catch((reason: unknown) => {
      if (mounted) { setError(reason instanceof Error ? reason.message : 'Unable to load your account.'); setStatus('error') }
    })
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      if (event === 'SIGNED_OUT') setRecovering(false)
      setSession(nextSession); setStatus('ready'); setError(null)
    })
    return () => { mounted = false; data.subscription.unsubscribe() }
  }, [])

  const signIn = async (email: string, password: string) => {
    setError(null)
    try { await persistenceService.signInWithPassword(email, password) } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : 'Unable to sign in with those credentials.'
      setError(message); throw reason
    }
  }

  const signUp = async (input: { fullName: string; email: string; password: string }) => {
    setError(null)
    try {
      const result = await persistenceService.signUp(input)
      return { requiresEmailConfirmation: !result.session }
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : 'Unable to create your account.'
      setError(message)
      throw reason
    }
  }

  const signOut = async () => { await persistenceService.signOut() }

  const requestPasswordReset = async (email: string) => {
    setError(null)
    try { await persistenceService.sendPasswordReset(email) } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Unable to send a reset link.'); throw reason
    }
  }

  const updatePassword = async (password: string) => {
    setError(null)
    try { await persistenceService.updatePassword(password); setRecovering(false) } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Unable to update your password.'); throw reason
    }
  }

  const deleteAccount = async () => {
    setError(null)
    try { await persistenceService.deleteAccount() } catch (reason: unknown) {
      setError('Could not delete your account. Please try again.'); throw reason
    }
  }

  return { session, status, error, recovering, signIn, signUp, signOut, requestPasswordReset, updatePassword, deleteAccount }
}

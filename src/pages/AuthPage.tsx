import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'

export interface AuthPageProps {
  session: Session | null
  status: 'loading' | 'ready' | 'error'
  error: string | null
  onSignIn: (email: string) => Promise<void>
  onSignOut: () => Promise<void>
  onContinue: () => void
}

export function AuthPage({ session, status, error, onSignIn, onSignOut, onContinue }: AuthPageProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)

  if (session) return <div className="page-shell auth-page"><section className="auth-card"><span className="eyebrow">Account</span><h1>You’re signed in.</h1><p>{session.user.email} can now access private saved recipes, cooking history, and preferences.</p><button className="button button-secondary" type="button" onClick={() => void onSignOut()}>Sign out</button></section></div>

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true)
    try { await onSignIn(email.trim()); setSubmitted(true) } finally { setBusy(false) }
  }

  return <div className="page-shell auth-page"><section className="auth-card"><span className="eyebrow">Account</span><h1>Save recipes for later.</h1><p>Sign in to keep favorites, cooked history, and preferences private to you. We’ll send a magic link—no password to remember.</p>{submitted ? <div className="success-banner" role="status">Check your email for a secure sign-in link.</div> : null}{error ? <div className="error-banner" role="alert">{error}</div> : null}<form className="auth-form" onSubmit={(event) => void submit(event)}><label className="field-label" htmlFor="auth-email">Email address<input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label><button className="button button-primary full-width" type="submit" disabled={busy || status === 'loading'}>{busy ? 'Sending…' : 'Email me a sign-in link'}</button></form><button className="text-button" type="button" onClick={onContinue}>Continue exploring without signing in</button></section></div>
}

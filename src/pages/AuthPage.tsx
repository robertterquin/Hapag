import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { validateRegistration, type RegistrationErrors } from '../lib/authValidation.ts'

interface SignUpInput { fullName: string; email: string; password: string }

export interface AuthPageProps {
  session: Session | null
  status: 'loading' | 'ready' | 'error'
  error: string | null
  onSignIn: (email: string, password: string) => Promise<void>
  onSignUp: (input: SignUpInput) => Promise<{ requiresEmailConfirmation: boolean }>
  onSignOut: () => Promise<void>
  onContinue: () => void
}

export function AuthPage({ session, status, error, onSignIn, onSignUp, onSignOut, onContinue }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<RegistrationErrors>({})

  if (session) return <div className="page-shell auth-page"><section className="auth-card"><span className="eyebrow">Account</span><h1>You’re signed in.</h1><p>{session.user.email} can now access private saved recipes, cooking history, and preferences.</p><button className="button button-secondary" type="button" onClick={() => void onSignOut()}>Sign out</button></section></div>

  const switchMode = (nextMode: 'signin' | 'register') => {
    setMode(nextMode); setMessage(null); setFieldErrors({})
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMessage(null); setFieldErrors({})
    if (mode === 'register') {
      const errors = validateRegistration({ fullName, email, password, confirmPassword })
      if (Object.keys(errors).length > 0) { setFieldErrors(errors); return }
    } else if (!email.trim() || !password) {
      setMessage('Enter your email and password to continue.')
      return
    }
    setBusy(true)
    try {
      if (mode === 'register') {
        const result = await onSignUp({ fullName: fullName.trim(), email: email.trim(), password })
        setMessage(result.requiresEmailConfirmation ? 'Account created. Check your email to confirm your account before signing in.' : 'Account created. You’re now signed in.')
      } else {
        await onSignIn(email.trim(), password)
        setMessage('You’re signed in.')
      }
    } finally { setBusy(false) }
  }

  const passwordType = showPassword ? 'text' : 'password'
  return <div className="page-shell auth-page"><section className="auth-card"><span className="eyebrow">Account</span><h1>{mode === 'register' ? 'Create your Hapag account.' : 'Save recipes for later.'}</h1><p>{mode === 'register' ? 'Create an account to keep your recipes, pantry, and cooking history private to you.' : 'Sign in with your email and password to keep your cooking decisions private.'}</p><div className="auth-mode-switch" role="tablist" aria-label="Account actions"><button className={mode === 'signin' ? 'auth-mode-active' : ''} type="button" role="tab" aria-selected={mode === 'signin'} onClick={() => switchMode('signin')}>Sign in</button><button className={mode === 'register' ? 'auth-mode-active' : ''} type="button" role="tab" aria-selected={mode === 'register'} onClick={() => switchMode('register')}>Register</button></div>{message ? <div className="success-banner auth-status" role="status">{message}</div> : null}{error ? <div className="error-banner" role="alert">{error}</div> : null}<form className="auth-form" onSubmit={(event) => void submit(event)}>{mode === 'register' ? <label className="field-label" htmlFor="auth-full-name">Full name<input id="auth-full-name" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required />{fieldErrors.fullName ? <small className="auth-field-error">{fieldErrors.fullName}</small> : null}</label> : null}<label className="field-label" htmlFor="auth-email">Email address<input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" required />{fieldErrors.email ? <small className="auth-field-error">{fieldErrors.email}</small> : null}</label><label className="field-label" htmlFor="auth-password">Password<div className="password-field"><input id="auth-password" type={passwordType} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>{fieldErrors.password ? <small className="auth-field-error">{fieldErrors.password}</small> : null}</label>{mode === 'register' ? <label className="field-label" htmlFor="auth-confirm-password">Confirm password<input id="auth-confirm-password" type={passwordType} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required />{fieldErrors.confirmPassword ? <small className="auth-field-error">{fieldErrors.confirmPassword}</small> : null}</label> : null}<button className="button button-primary full-width" type="submit" disabled={busy || status === 'loading'}>{busy ? 'Working…' : mode === 'register' ? 'Create account' : 'Sign in'}</button></form><button className="text-button" type="button" onClick={onContinue}>Continue exploring without signing in</button></section></div>
}

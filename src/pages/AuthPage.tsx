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
  recovering: boolean
  onRequestPasswordReset: (email: string) => Promise<void>
  onUpdatePassword: (password: string) => Promise<void>
}

export function AuthPage({ session, status, error, onSignIn, onSignUp, onSignOut, onContinue, recovering, onRequestPasswordReset, onUpdatePassword }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<RegistrationErrors>({})

  // Opened from a password-reset email: Supabase has signed the user in just to set a new password.
  if (session && recovering) {
    const saveNewPassword = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault(); setMessage(null); setFieldErrors({})
      if (password.length < 8) { setFieldErrors({ password: 'Use at least 8 characters.' }); return }
      if (password !== confirmPassword) { setFieldErrors({ confirmPassword: 'Passwords do not match.' }); return }
      setBusy(true)
      try { await onUpdatePassword(password); setPassword(''); setConfirmPassword(''); setMessage('Password updated. You’re signed in.') } catch { /* The hook shows the error. */ } finally { setBusy(false) }
    }
    return (
      <div className="page-shell auth-page"><section className="auth-card">
        <h1>Set a new password</h1>
        <p>For {session.user.email}.</p>
        {error ? <div className="error-banner" role="alert">{error}</div> : null}
        <form className="auth-form" onSubmit={(event) => void saveNewPassword(event)}>
          <label className="field-label" htmlFor="auth-new-password">New password<input id="auth-new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required />{fieldErrors.password ? <small className="auth-field-error">{fieldErrors.password}</small> : null}</label>
          <label className="field-label" htmlFor="auth-new-password-confirm">Confirm new password<input id="auth-new-password-confirm" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required />{fieldErrors.confirmPassword ? <small className="auth-field-error">{fieldErrors.confirmPassword}</small> : null}</label>
          <button className="button button-primary full-width" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save new password'}</button>
        </form>
      </section></div>
    )
  }

  if (session) return <div className="page-shell auth-page"><section className="auth-card"><h1>You’re signed in.</h1>{message ? <div className="success-banner auth-status" role="status">{message}</div> : null}<p>{session.user.email} can now access private saved recipes, cooking history, and preferences.</p><div className="auth-signed-in-actions"><button className="button button-primary" type="button" onClick={onContinue}>Continue</button><button className="button button-secondary" type="button" onClick={() => void onSignOut()}>Sign out</button></div></section></div>

  const forgotPassword = async () => {
    setMessage(null); setFieldErrors({})
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setFieldErrors({ email: 'Enter your email address first, then tap Forgot password.' }); return }
    setBusy(true)
    try { await onRequestPasswordReset(email.trim()); setMessage(`If an account uses ${email.trim()}, a reset link is on its way. Check your email.`) } catch { /* The hook shows the error. */ } finally { setBusy(false) }
  }

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
        // Back to where they were (for example, the recipe they tried to save).
        onContinue()
      }
    } catch { /* useAuth shows the error banner. */ } finally { setBusy(false) }
  }

  const passwordType = showPassword ? 'text' : 'password'
  return <div className="page-shell auth-page"><section className="auth-card"><h1>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h1><p>{mode === 'register' ? 'Save recipes, cooking history, and preferences to your account.' : 'Sign in to see your saved recipes and preferences.'}</p><div className="auth-mode-switch" role="tablist" aria-label="Account actions"><button className={mode === 'signin' ? 'auth-mode-active' : ''} type="button" role="tab" aria-selected={mode === 'signin'} onClick={() => switchMode('signin')}>Sign in</button><button className={mode === 'register' ? 'auth-mode-active' : ''} type="button" role="tab" aria-selected={mode === 'register'} onClick={() => switchMode('register')}>Register</button></div>{message ? <div className="success-banner auth-status" role="status">{message}</div> : null}{error ? <div className="error-banner" role="alert">{error}</div> : null}<form className="auth-form" onSubmit={(event) => void submit(event)}>{mode === 'register' ? <label className="field-label" htmlFor="auth-full-name">Full name<input id="auth-full-name" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required />{fieldErrors.fullName ? <small className="auth-field-error">{fieldErrors.fullName}</small> : null}</label> : null}<label className="field-label" htmlFor="auth-email">Email address<input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" required />{fieldErrors.email ? <small className="auth-field-error">{fieldErrors.email}</small> : null}</label><label className="field-label" htmlFor="auth-password">Password<div className="password-field"><input id="auth-password" type={passwordType} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>{fieldErrors.password ? <small className="auth-field-error">{fieldErrors.password}</small> : null}</label>{mode === 'signin' ? <button className="text-button auth-forgot" type="button" onClick={() => void forgotPassword()} disabled={busy}>Forgot password?</button> : null}{mode === 'register' ? <label className="field-label" htmlFor="auth-confirm-password">Confirm password<input id="auth-confirm-password" type={passwordType} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required />{fieldErrors.confirmPassword ? <small className="auth-field-error">{fieldErrors.confirmPassword}</small> : null}</label> : null}<button className="button button-primary full-width" type="submit" disabled={busy || status === 'loading'}>{busy ? 'Working…' : mode === 'register' ? 'Create account' : 'Sign in'}</button></form><button className="text-button" type="button" onClick={onContinue}>Continue exploring without signing in</button></section></div>
}

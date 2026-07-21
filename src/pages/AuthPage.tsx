import { useState } from 'react'

export interface AuthPageProps {
  onContinue: () => void
}

export function AuthPage({ onContinue }: AuthPageProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="page-shell auth-page">
      <section className="auth-card">
        <span className="eyebrow">Account</span>
        <h1>Save recipes for later.</h1>
        <p>Sign in to keep favorites, cooked history, and Pantry items private to you.</p>
        {submitted ? <div className="success-banner" role="status">Demo sign-in submitted. Real authentication arrives in Phase 11.</div> : null}
        <form className="auth-form" onSubmit={(event) => { event.preventDefault(); if (email.trim()) setSubmitted(true) }}>
          <label className="field-label" htmlFor="auth-email">Email address<input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
          <button className="button button-primary full-width" type="submit">Continue</button>
        </form>
        <button className="text-button" type="button" onClick={onContinue}>Continue exploring without signing in</button>
      </section>
    </div>
  )
}

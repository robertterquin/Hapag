import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { UserPreferences } from '../services/persistenceService.ts'

interface ProfilePageProps { session: Session | null; preferences: UserPreferences; status: string; error: string | null; onSave: (preferences: UserPreferences) => Promise<void>; onSignIn: () => void; onSignOut: () => Promise<void> }

export function ProfilePage({ session, preferences, status, error, onSave, onSignIn, onSignOut }: ProfilePageProps) {
  const [draft, setDraft] = useState(preferences)
  const [saved, setSaved] = useState(false)
  const preferencesKey = `${preferences.language}-${preferences.default_servings}-${preferences.dietary_preference}-${preferences.spice_level}-${preferences.allergies.join('|')}`

  useEffect(() => {
    if (JSON.stringify(draft) !== JSON.stringify(preferences)) {

      setDraft(preferences)
      setSaved(false)
    }
  }, [preferencesKey])

  if (!session) return <div className="page-shell narrow-page"><span className="eyebrow">Profile and preferences</span><h1>Make Hapag fit your kitchen.</h1><p className="page-intro">Sign in to keep your preferences and saved cooking decisions private to you.</p><button className="button button-primary" type="button" onClick={onSignIn}>Sign in</button></div>
  return (
    <div className="page-shell narrow-page">
      <span className="eyebrow">Profile and preferences</span>
      <h1>Make Hapag fit your kitchen.</h1>
      <p className="page-intro">These preferences shape future suggestions and are stored securely in your account.</p>
      {saved ? <div className="success-banner" role="status">Preferences saved.</div> : null}
      {error ? <div className="error-banner" role="alert">{error}</div> : null}
      <section className="preferences-panel" aria-labelledby="preferences-heading">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Your defaults</span>
            <h2 id="preferences-heading">Cooking preferences</h2>
          </div>
        </div>
        <div className="preference-form">
          <label className="field-label">
            Language preference
            <select value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value as UserPreferences['language'] })}>
              <option>English</option>
              <option>Taglish</option>
              <option>Tagalog</option>
            </select>
          </label>
          <label className="field-label">
            Default servings
            <select value={draft.default_servings} onChange={(event) => setDraft({ ...draft, default_servings: Number(event.target.value) })}>
              {[1, 2, 3, 4, 6].map((value) => <option value={value} key={value}>{value} serving{value === 1 ? '' : 's'}</option>)}
            </select>
          </label>
          <label className="field-label">
            Dietary preference
            <select value={draft.dietary_preference} onChange={(event) => setDraft({ ...draft, dietary_preference: event.target.value as UserPreferences['dietary_preference'] })}>
              <option value="none">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="low-sodium">Low-sodium</option>
              <option value="diabetic-friendly">Diabetic-friendly</option>
            </select>
          </label>
          <label className="field-label">
            Spice level
            <select value={draft.spice_level} onChange={(event) => setDraft({ ...draft, spice_level: event.target.value as UserPreferences['spice_level'] })}>
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="hot">Hot</option>
            </select>
          </label>
          <label className="field-label">
            Allergies (comma-separated)
            <input
              value={draft.allergies.join(', ')}
              onChange={(event) => setDraft({ ...draft, allergies: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })}
              placeholder="e.g. shrimp, peanuts"
            />
          </label>
        </div>
        <div className="allergy-callout">
          <strong>Allergy reminder</strong>
          <span>Always verify product labels and cross-contact. Hapag cannot guarantee allergy safety.</span>
        </div>
        <button className="button button-primary" type="button" disabled={status === 'saving'} onClick={() => void onSave(draft).then(() => setSaved(true))}>
          {status === 'saving' ? 'Saving…' : 'Save preferences'}
        </button>
      </section>
      <section className="account-panel">
        <h2>Account actions</h2>
        <p>{session.user.email}</p>
        <button className="button button-secondary" type="button" onClick={() => void onSignOut()}>Sign out</button>
      </section>
    </div>
  )
}


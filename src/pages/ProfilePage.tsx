import { useState } from 'react'
import { Icon } from '@iconify/react'
import { SegmentedControl } from '../components/SegmentedControl.tsx'
import type { SegmentedOption } from '../components/SegmentedControl.tsx'
import { ServingStepper } from '../components/ServingStepper.tsx'
import { dietOptions, spiceOptions } from '../lib/preferenceOptions.ts'
import type { Session } from '@supabase/supabase-js'
import type { UserPreferences } from '../services/persistenceService.ts'

const languageOptions: readonly SegmentedOption<UserPreferences['language']>[] = [
  { value: 'Taglish', label: 'Taglish' },
  { value: 'Tagalog', label: 'Tagalog' },
  { value: 'English', label: 'English' },
]

interface ProfilePageProps { session: Session | null; preferences: UserPreferences; status: string; error: string | null; onSave: (preferences: UserPreferences) => Promise<void>; onSignIn: () => void; onSignOut: () => Promise<void> }

export function ProfilePage({ session, preferences, status, error, onSave, onSignIn, onSignOut }: ProfilePageProps) {
  const [draft, setDraft] = useState(preferences)
  const [saved, setSaved] = useState(false)
  const preferencesKey = `${preferences.language}-${preferences.default_servings}-${preferences.dietary_preference}-${preferences.spice_level}-${preferences.allergies.join('|')}`

  const [syncedPreferencesKey, setSyncedPreferencesKey] = useState(preferencesKey)
  if (syncedPreferencesKey !== preferencesKey) {
    setSyncedPreferencesKey(preferencesKey)
    if (JSON.stringify(draft) !== JSON.stringify(preferences)) {
      setDraft(preferences)
      setSaved(false)
    }
  }

  if (!session) return <div className="page-shell narrow-page"><h1>Make Hapag fit your kitchen.</h1><p className="page-intro">Sign in to keep your preferences and saved cooking decisions private to you.</p><button className="button button-primary" type="button" onClick={onSignIn}>Sign in</button></div>
  return (
    <div className="page-shell narrow-page">
      <h1>Make Hapag fit your kitchen.</h1>
      <p className="page-intro">Your defaults for every new search.</p>
      {saved ? <div className="success-banner" role="status">Preferences saved.</div> : null}
      {error ? <div className="error-banner" role="alert">{error}</div> : null}
      <section className="preferences-panel" aria-labelledby="preferences-heading">
        <h2 id="preferences-heading">Cooking preferences</h2>
        <div className="preference-form">
          <SegmentedControl
            label="Ingredient names"
            value={draft.language}
            options={languageOptions}
            onChange={(language) => setDraft({ ...draft, language })}
          />
          <ServingStepper value={draft.default_servings} onChange={(default_servings) => setDraft({ ...draft, default_servings })} />
          <SegmentedControl
            label="Spice level"
            value={draft.spice_level}
            options={spiceOptions}
            onChange={(spice_level) => setDraft({ ...draft, spice_level })}
          />
          <SegmentedControl
            label="Dietary preference"
            value={draft.dietary_preference}
            options={dietOptions}
            onChange={(dietary_preference) => setDraft({ ...draft, dietary_preference })}
          />
          <label className="field-label">
            Allergies
            <input
              value={draft.allergies.join(', ')}
              onChange={(event) => setDraft({ ...draft, allergies: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })}
              placeholder="shrimp, peanuts"
            />
          </label>
        </div>
        <p className="allergy-note">
          <Icon icon="lucide:triangle-alert" width={16} height={16} aria-hidden="true" />
          <span>Always check food labels. Hapag can't guarantee allergen-free results.</span>
        </p>
        <button className="button button-primary" type="button" disabled={status === 'saving'} onClick={() => void onSave(draft).then(() => setSaved(true))}>
          {status === 'saving' ? 'Saving…' : 'Save preferences'}
        </button>
      </section>
      <section className="account-panel">
        <h2>Account</h2>
        <p>{session.user.email}</p>
        <button className="button button-secondary" type="button" onClick={() => void onSignOut()}>Sign out</button>
      </section>
    </div>
  )
}


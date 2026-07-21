import { useState } from 'react'

export function ProfilePage() {
  const [saved, setSaved] = useState(false)
  const [servings, setServings] = useState('3')
  const [language, setLanguage] = useState('Taglish')
  const [dietary, setDietary] = useState('none')

  return (
    <div className="page-shell narrow-page">
      <span className="eyebrow">Profile and preferences · static preview</span>
      <h1>Make Hapag fit your kitchen.</h1>
      <p className="page-intro">These preferences will shape future suggestions. They are local-only until Supabase persistence is connected.</p>
      {saved ? <div className="success-banner" role="status">Naisave ang preferences sa demo session.</div> : null}
      <section className="preferences-panel" aria-labelledby="preferences-heading">
        <div className="section-heading-row"><div><span className="section-kicker">Your defaults</span><h2 id="preferences-heading">Cooking preferences</h2></div></div>
        <div className="preference-form">
          <label className="field-label">Language preference
            <select value={language} onChange={(event) => setLanguage(event.target.value)}><option>Taglish</option><option>Tagalog</option><option>English</option></select>
          </label>
          <label className="field-label">Default servings
            <select value={servings} onChange={(event) => setServings(event.target.value)}><option value="1">1 serving</option><option value="2">2 servings</option><option value="3">3 servings</option><option value="4">4 servings</option><option value="6">6 servings</option></select>
          </label>
          <label className="field-label">Dietary preference
            <select value={dietary} onChange={(event) => setDietary(event.target.value)}><option value="none">None</option><option value="vegetarian">Vegetarian</option><option value="low-sodium">Low-sodium guidance</option><option value="diabetic-friendly">Diabetic-friendly guidance</option></select>
          </label>
        </div>
        <div className="allergy-callout"><strong>Allergies</strong><span>Always verify product labels and cross-contact. Hapag cannot guarantee allergy safety.</span></div>
        <button className="button button-primary" type="button" onClick={() => setSaved(true)}>Save preferences</button>
      </section>
      <section className="account-panel"><h2>Account actions</h2><p>Sign in will be connected after the static flow is approved. Data deletion will be explicit and recoverable where possible.</p><button className="button button-secondary" type="button">Sign out (demo)</button></section>
    </div>
  )
}

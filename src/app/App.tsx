import { useEffect, useState, type ReactNode } from 'react'
import '../App.css'
import { useAppRouter } from './router.ts'
import { AppShell } from '../components/AppShell.tsx'
import { CostBreakdown } from '../components/CostBreakdown.tsx'
import { IngredientChips } from '../components/IngredientChips.tsx'
import { IngredientPrompt } from '../components/IngredientPrompt.tsx'
import { RecipeCard } from '../components/RecipeCard.tsx'
import { RecipeMeta } from '../components/RecipeMeta.tsx'
import { ServingStepper } from '../components/ServingStepper.tsx'
import { ResultsSkeleton } from '../components/Skeletons.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import { RoutePlaceholder } from '../components/RoutePlaceholder.tsx'
import { recipeFixtures } from '../data/fixtures.ts'
import { formatQuantity } from '../lib/format.ts'
import { mockRecipeService } from '../services/recipeService.ts'
import type { DiscoverySession, GenerationConstraints, NormalizedIngredient, Recipe } from '../types/domain.ts'

type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'

const defaultConstraints: GenerationConstraints = {
  servings: 3,
  allergies: [],
  spiceLevel: 'mild',
}

function HomePage({ onStart }: { onStart: (value: string) => void }) {
  return (
    <div className="page-shell page-shell-home">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Filipino recipe assistant</span>
          <h1>Ano&apos;ng ulam?</h1>
          <p className="hero-subtitle">May sahog ka? Luto tayo.</p>
          <p className="hero-description">Tell Hapag what you have and get practical meal ideas that fit your time, budget, and household.</p>
          <IngredientPrompt onSubmit={onStart} />
          <div className="trust-note">
            <span className="trust-icon" aria-hidden="true">✦</span>
            <span>AI-generated suggestions with estimated prices. Check the ingredients before cooking.</span>
          </div>
        </div>
        <div className="hero-illustration" aria-label="Illustration of a warm Filipino kitchen" role="img">
          <div className="illustration-pot" aria-hidden="true">🍲</div>
          <span className="ingredient-bubble ingredient-bubble-one">🥚</span>
          <span className="ingredient-bubble ingredient-bubble-two">🌶️</span>
          <span className="ingredient-bubble ingredient-bubble-three">🍅</span>
        </div>
      </section>

      <section className="foundation-grid" aria-label="Hapag product areas">
        <article className="info-card info-card-mango">
          <span className="card-icon" aria-hidden="true">✦</span>
          <h2>Ulam AI</h2>
          <p>From ingredients to three useful choices, with the reason each one fits.</p>
          <button type="button" className="text-button" onClick={() => onStart('')}>Explore the flow <span aria-hidden="true">→</span></button>
        </article>
        <article className="info-card info-card-green">
          <span className="card-icon" aria-hidden="true">♡</span>
          <h2>Save what works</h2>
          <p>Keep recipes and cooking decisions close for the next busy day.</p>
          <span className="card-caption">Sign in when you&apos;re ready</span>
        </article>
      </section>
    </div>
  )
}

function UlamPage({ session, onUpdate, onGenerate, onRemove }: {
  session: DiscoverySession
  onUpdate: (next: DiscoverySession) => void
  onGenerate: () => void
  onRemove: (id: string) => void
}) {
  const updateConstraints = (patch: Partial<GenerationConstraints>) => onUpdate({ ...session, constraints: { ...session.constraints, ...patch } })

  return (
    <div className="page-shell narrow-page">
      <span className="eyebrow">Ulam AI</span>
      <h1>Start with what you have.</h1>
      <p className="page-intro">Review your ingredients before Hapag suggests what to cook. You can type in English, Tagalog, or Taglish.</p>
      <IngredientPrompt
        key={session.rawInput}
        initialValue={session.rawInput}
        onSubmit={(value) => onUpdate({ ...session, rawInput: value, ingredients: mockRecipeService.normalizeIngredients(value) })}
        compact
      />

      <section className="review-panel" aria-labelledby="review-heading">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Ingredient review</span>
            <h2 id="review-heading">Ito ang nakita ko:</h2>
          </div>
          <span className="count-badge">{session.ingredients.length}</span>
        </div>
        <IngredientChips ingredients={session.ingredients} onRemove={onRemove} />
        {session.ingredients.some((ingredient) => ingredient.confidence === 'low') ? <p className="inline-warning">May ingredient na kailangan ng review. Paki-check bago mag-generate.</p> : null}
      </section>

      <section className="constraints-panel" aria-labelledby="constraints-heading">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Optional preferences</span>
            <h2 id="constraints-heading">I-fit natin sa household mo.</h2>
          </div>
        </div>
        <div className="constraint-grid">
          <ServingStepper value={session.constraints.servings} onChange={(value) => updateConstraints({ servings: value })} />
          <label className="field-label">Budget limit
            <select value={session.constraints.budgetLimit ?? ''} onChange={(event) => updateConstraints({ budgetLimit: event.target.value ? Number(event.target.value) : undefined })}>
              <option value="">Any budget</option>
              <option value="100">Under ₱100</option>
              <option value="200">Under ₱200</option>
            </select>
          </label>
          <label className="field-label">Dietary preference
            <select value={session.constraints.dietaryPreference ?? 'none'} onChange={(event) => updateConstraints({ dietaryPreference: event.target.value as GenerationConstraints['dietaryPreference'] })}>
              <option value="none">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="low-sodium">Low-sodium guidance</option>
              <option value="diabetic-friendly">Diabetic-friendly guidance</option>
            </select>
          </label>
          <label className="field-label">Spice level
            <select value={session.constraints.spiceLevel} onChange={(event) => updateConstraints({ spiceLevel: event.target.value as GenerationConstraints['spiceLevel'] })}>
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="hot">Hot</option>
            </select>
          </label>
        </div>
        <div className="allergy-callout">
          <strong>May allergy?</strong>
          <span>Always verify labels and cross-contact. Hapag cannot guarantee allergy safety.</span>
        </div>
      </section>

      <button className="button button-primary full-width" type="button" onClick={onGenerate} disabled={session.ingredients.length === 0}>
        Lutuin natin!
      </button>
    </div>
  )
}

function ResultsPage({ session, status, suggestions, error, savedIds, onOpen, onToggleSave, onRetry, onEdit }: {
  session: DiscoverySession
  status: GenerationStatus
  suggestions: Recipe[]
  error: string | null
  savedIds: string[]
  onOpen: (recipeId: string) => void
  onToggleSave: (recipeId: string) => void
  onRetry: () => void
  onEdit: () => void
}) {
  if (status === 'loading') {
    return <div className="page-shell"><span className="eyebrow">Recipe results</span><h1>Naghahanap ng ulam...</h1><p className="page-intro">Tinitingnan namin kung ano ang puwedeng gawin sa meron mo.</p><ResultsSkeleton /></div>
  }

  if (status === 'error') {
    return <StatePanel tone="error" icon="!" title="Hindi muna ako nakahanap ng ulam." description={error ?? 'May nangyaring hindi inaasahan. Nandito pa rin ang ingredients mo.'} actionLabel="Subukan ulit" onAction={onRetry} secondaryLabel="Ayusin ang ingredients" onSecondary={onEdit} />
  }

  if (status === 'success' && suggestions.length === 0) {
    return <StatePanel tone="empty" title="Wala akong makitang magandang match." description="Bawasan ang filters o magdagdag ng ingredient para mas marami tayong mapagpilian." actionLabel="Ayusin ang ingredients" onAction={onEdit} secondaryLabel="Subukan ulit" onSecondary={onRetry} />
  }

  return (
    <div className="page-shell">
      <div className="results-header">
        <div>
          <span className="eyebrow">Recipe results</span>
          <h1>Mga puwedeng lutuin</h1>
          <p className="page-intro">Tatlong idea mula sa: <strong>{session.rawInput || 'ingredients mo'}</strong></p>
        </div>
        <button className="button button-secondary" type="button" onClick={onEdit}>Ayusin ang ingredients</button>
      </div>
      <div className="active-filter-row" aria-label="Applied constraints">
        <span className="filter-pill">{session.constraints.servings} servings</span>
        {session.constraints.budgetLimit ? <span className="filter-pill">Under ₱{session.constraints.budgetLimit}</span> : null}
        {session.constraints.dietaryPreference && session.constraints.dietaryPreference !== 'none' ? <span className="filter-pill">{session.constraints.dietaryPreference}</span> : null}
      </div>
      <div className="results-grid">
        {suggestions.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} saved={savedIds.includes(recipe.id)} onOpen={() => onOpen(recipe.id)} onToggleSave={() => onToggleSave(recipe.id)} />)}
      </div>
      <div className="results-footer-actions">
        <button className="button button-secondary" type="button" onClick={onRetry}>Subukan ulit</button>
      </div>
      <p className="trust-note trust-note-block">AI-generated suggestions. Prices are estimates. Check ingredients and labels before cooking.</p>
    </div>
  )
}

function RecipeDetailPage({ recipeId, saved, onToggleSave, onStartCooking, onBack }: {
  recipeId: string
  saved: boolean
  onToggleSave: () => void
  onStartCooking: () => void
  onBack: () => void
}) {
  const [recipe, setRecipe] = useState<Recipe | undefined>()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [servings, setServings] = useState(3)
  const [activeSubstitution, setActiveSubstitution] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    mockRecipeService.getRecipe(recipeId).then((nextRecipe) => {
      if (!active) return
      setRecipe(nextRecipe)
      setServings(nextRecipe?.servings ?? 3)
      setStatus(nextRecipe ? 'success' : 'error')
    }).catch(() => {
      if (active) setStatus('error')
    })
    return () => { active = false }
  }, [recipeId])

  if (status === 'loading') return <div className="page-shell"><ResultsSkeleton /></div>
  if (status === 'error' || !recipe) return <StatePanel tone="error" icon="!" title="Recipe unavailable" description="Hindi namin mabuksan ang recipe na ito ngayon." actionLabel="Back to results" onAction={onBack} />

  const scaledRecipe: Recipe = {
    ...recipe,
    servings,
    ingredients: recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: typeof ingredient.quantity === 'number' ? Math.round(ingredient.quantity * (servings / recipe.servings) * 10) / 10 : ingredient.quantity,
    })),
    estimatedCost: {
      ...recipe.estimatedCost,
      min: Math.round(recipe.estimatedCost.min * (servings / recipe.servings)),
      max: Math.round(recipe.estimatedCost.max * (servings / recipe.servings)),
    },
  }

  return (
    <div className="page-shell detail-page">
      <div className="detail-topbar">
        <button className="back-button" type="button" onClick={onBack}>← Results</button>
        <button className={`button ${saved ? 'button-saved' : 'button-secondary'}`} type="button" onClick={onToggleSave}>{saved ? '♥ Saved' : '♡ Save recipe'}</button>
      </div>
      <section className="recipe-hero">
        <span className="recipe-badge">{recipe.tags[0]}</span>
        <h1>{recipe.title}</h1>
        {recipe.localTitle ? <p className="local-title">{recipe.localTitle}</p> : null}
        <p className="detail-description">{recipe.description}</p>
        <RecipeMeta recipe={scaledRecipe} />
        <p className="match-callout"><strong>Why this fits:</strong> {recipe.matchReason}</p>
      </section>

      <div className="detail-layout">
        <div className="detail-main-column">
          <section className="detail-section" aria-labelledby="ingredients-heading">
            <div className="section-heading-row">
              <div><span className="section-kicker">What you need</span><h2 id="ingredients-heading">Ingredients</h2></div>
              <ServingStepper value={servings} onChange={setServings} />
            </div>
            <ul className="detail-ingredient-list">
              {scaledRecipe.ingredients.map((ingredient) => <li className={ingredient.available ? 'ingredient-available' : 'ingredient-missing'} key={ingredient.id}>
                <span className="ingredient-status" aria-hidden="true">{ingredient.available ? '✓' : '+'}</span>
                <span><strong>{formatQuantity(ingredient.quantity, ingredient.unit)} {ingredient.name}</strong>{ingredient.note ? <small>{ingredient.note}</small> : null}</span>
                <em>{ingredient.available ? 'Meron ka' : 'Kulang pa'}</em>
              </li>)}
            </ul>
          </section>

          <section className="detail-section" aria-labelledby="substitutions-heading">
            <div className="section-heading-row"><div><span className="section-kicker">Flexible cooking</span><h2 id="substitutions-heading">Substitutions</h2></div></div>
            <div className="substitution-list">
              {recipe.substitutions.map((substitution) => <button className={`substitution-row ${activeSubstitution === substitution.id ? 'substitution-row-active' : ''}`} type="button" key={substitution.id} onClick={() => setActiveSubstitution(activeSubstitution === substitution.id ? null : substitution.id)}>
                <span><strong>{substitution.original}</strong><span className="substitution-arrow">→</span><strong>{substitution.substitute}</strong></span>
                <small>{activeSubstitution === substitution.id ? substitution.tradeoff : 'View tradeoff'}</small>
              </button>)}
            </div>
          </section>

          <section className="detail-section" aria-labelledby="steps-heading">
            <div className="section-heading-row"><div><span className="section-kicker">Cook it</span><h2 id="steps-heading">Steps</h2></div></div>
            <ol className="step-preview-list">
              {recipe.steps.map((step) => <li key={step.id}><span>{step.order}</span><div><strong>{step.action}</strong><small>{step.durationMinutes ? `${step.durationMinutes} min` : 'As needed'}{step.heat && step.heat !== 'none' ? ` · ${step.heat} heat` : ''}</small></div></li>)}
            </ol>
          </section>
        </div>
        <aside className="detail-side-column">
          <CostBreakdown recipe={scaledRecipe} />
          <div className="safety-note"><strong>Check before cooking</strong><p>AI-generated suggestion. Verify ingredients, labels, and allergy context. Dietary labels are guidance, not medical advice.</p></div>
          <button className="button button-primary full-width" type="button" onClick={onStartCooking}>Simulan ang pagluluto</button>
        </aside>
      </div>
    </div>
  )
}

function CookingPage({ recipeId, onFinish, onBack }: { recipeId: string; onFinish: () => void; onBack: () => void }) {
  const [recipe, setRecipe] = useState<Recipe | undefined>()
  const [stepIndex, setStepIndex] = useState(0)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  useEffect(() => {
    let active = true
    mockRecipeService.getRecipe(recipeId).then((nextRecipe) => { if (active) setRecipe(nextRecipe) })
    return () => { active = false }
  }, [recipeId])

  useEffect(() => {
    if (!timerRunning) return undefined
    const interval = window.setInterval(() => setTimerSeconds((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearInterval(interval)
  }, [timerRunning])

  if (!recipe) return <div className="page-shell"><ResultsSkeleton /></div>
  const step = recipe.steps[stepIndex]
  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, '0')
  const seconds = (timerSeconds % 60).toString().padStart(2, '0')
  const timerLabel = timerSeconds > 0 ? `${minutes}:${seconds}` : step.durationMinutes ? `${String(step.durationMinutes).padStart(2, '0')}:00` : '02:00'

  return (
    <div className="cooking-page">
      <div className="cooking-topbar"><button className="back-button" type="button" onClick={onBack}>← Recipe</button><span className="cooking-title">Cooking mode</span><span className="cooking-dish">{recipe.title}</span></div>
      <div className="cooking-progress-header"><span>Step {step.order} of {recipe.steps.length}</span><strong>{Math.round(((stepIndex + 1) / recipe.steps.length) * 100)}%</strong></div>
      <div className="progress-track"><span style={{ width: `${((stepIndex + 1) / recipe.steps.length) * 100}%` }} /></div>
      <section className="cooking-step-card" aria-live="polite">
        <span className="step-kicker">Do this now</span>
        <h1>{step.action}</h1>
        <div className="step-details"><span>{step.durationMinutes ? `About ${step.durationMinutes} minutes` : 'Until ready'}</span><span>{step.heat && step.heat !== 'none' ? `${step.heat} heat` : 'Prep'}</span></div>
        <button className={`timer-button ${timerRunning ? 'timer-button-active' : ''}`} type="button" onClick={() => { if (!timerRunning && timerSeconds === 0) setTimerSeconds((step.durationMinutes ?? 2) * 60); setTimerRunning(!timerRunning) }}>
          <span aria-hidden="true">◷</span> {timerRunning ? timerLabel : `Start ${timerLabel} timer`}
        </button>
      </section>
      <div className="cooking-controls"><button className="button button-secondary" type="button" disabled={stepIndex === 0} onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}>← Previous</button><button className="button button-primary" type="button" onClick={() => stepIndex === recipe.steps.length - 1 ? onFinish() : setStepIndex(stepIndex + 1)}>{stepIndex === recipe.steps.length - 1 ? 'Finish cooking' : 'Next step →'}</button></div>
      <p className="cooking-note">Keep your phone nearby, and use your best judgment for doneness and food safety.</p>
    </div>
  )
}

function SavedPage({ savedIds, cookedIds, onOpen, onUnsave, onStart }: { savedIds: string[]; cookedIds: string[]; onOpen: (id: string) => void; onUnsave: (id: string) => void; onStart: () => void }) {
  const savedRecipes = recipeFixtures.filter((recipe) => savedIds.includes(recipe.id))
  const cookedRecipes = recipeFixtures.filter((recipe) => cookedIds.includes(recipe.id))

  return (
    <div className="page-shell">
      <span className="eyebrow">Saved recipes</span>
      <h1>Keep the meals that work.</h1>
      <p className="page-intro">Save a recipe or mark it cooked so your next meal starts with less guesswork.</p>
      {savedRecipes.length === 0 && cookedRecipes.length === 0 ? <StatePanel title="Wala pang saved recipes" description="Mag-save ng recipe para mabalikan mo sa susunod." actionLabel="Find something to cook" onAction={onStart} /> : <>
        <section className="saved-section" aria-labelledby="favorites-heading"><div className="section-heading-row"><h2 id="favorites-heading">Favorites</h2><span className="count-badge">{savedRecipes.length}</span></div>{savedRecipes.length > 0 ? <div className="results-grid">{savedRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} saved onOpen={() => onOpen(recipe.id)} onToggleSave={() => onUnsave(recipe.id)} />)}</div> : <p className="muted-copy">Wala pang favorites.</p>}</section>
        <section className="saved-section" aria-labelledby="cooked-heading"><div className="section-heading-row"><h2 id="cooked-heading">I cooked this</h2><span className="count-badge">{cookedRecipes.length}</span></div>{cookedRecipes.length > 0 ? <div className="results-grid">{cookedRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} saved={savedIds.includes(recipe.id)} onOpen={() => onOpen(recipe.id)} onToggleSave={() => onUnsave(recipe.id)} />)}</div> : <p className="muted-copy">Wala pang cooking history.</p>}</section>
      </>}
    </div>
  )
}

function PantryPage({ pantryItems, onAdd, onRemove, onGenerate }: { pantryItems: NormalizedIngredient[]; onAdd: (value: string) => void; onRemove: (id: string) => void; onGenerate: () => void }) {
  return (
    <div className="page-shell narrow-page">
      <span className="eyebrow">Pantry · static preview</span>
      <h1>Your ingredients, ready for the next idea.</h1>
      <p className="page-intro">Add a few ingredients and Hapag can turn your pantry into a new cooking starting point.</p>
      <IngredientPrompt compact onSubmit={onAdd} />
      <section className="pantry-panel" aria-labelledby="pantry-heading">
        <div className="section-heading-row"><div><span className="section-kicker">Available ingredients</span><h2 id="pantry-heading">{pantryItems.length} in your pantry</h2></div></div>
        {pantryItems.length > 0 ? <IngredientChips ingredients={pantryItems} onRemove={onRemove} /> : <StatePanel title="Wala pang laman ang Pantry" description="Magdagdag ng ingredients para makabuo ng pantry-based recipe ideas." />}
        <button className="button button-primary full-width" type="button" disabled={pantryItems.length === 0} onClick={onGenerate}>Generate from Pantry</button>
      </section>
    </div>
  )
}

function ProfilePage() {
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

function AuthPage({ onContinue }: { onContinue: () => void }) {
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

function App() {
  const { route, navigate } = useAppRouter()
  const [session, setSession] = useState<DiscoverySession>({ rawInput: '', ingredients: [], constraints: defaultConstraints })
  const [suggestions, setSuggestions] = useState<Recipe[]>([])
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle')
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [cookedIds, setCookedIds] = useState<string[]>([])
  const [pantryItems, setPantryItems] = useState<NormalizedIngredient[]>([])

  const startDiscovery = (value: string) => {
    setSession((current) => ({ ...current, rawInput: value, ingredients: value ? mockRecipeService.normalizeIngredients(value) : [] }))
    setGenerationStatus('idle')
    navigate('/ulam')
  }

  const generateSuggestions = async () => {
    if (session.ingredients.length === 0) return
    setGenerationStatus('loading')
    setGenerationError(null)
    navigate('/results')
    try {
      const result = await mockRecipeService.generateSuggestions({ rawInput: session.rawInput, ingredients: session.ingredients, constraints: session.constraints })
      setSuggestions(result)
      setGenerationStatus('success')
    } catch {
      setGenerationError('Nandito pa rin ang ingredients mo. Puwede kang mag-retry o bumalik at mag-edit.')
      setGenerationStatus('error')
    }
  }

  const toggleSaved = (recipeId: string) => setSavedIds((ids) => ids.includes(recipeId) ? ids.filter((id) => id !== recipeId) : [...ids, recipeId])
  const toggleCooked = (recipeId: string) => setCookedIds((ids) => ids.includes(recipeId) ? ids.filter((id) => id !== recipeId) : [...ids, recipeId])
  const addPantryItem = (value: string) => setPantryItems((items) => {
    const additions = mockRecipeService.normalizeIngredients(value)
    return [...items, ...additions.filter((addition) => !items.some((item) => item.name === addition.name))]
  })
  const generateFromPantry = () => {
    const input = pantryItems.map((item) => item.name).join(', ')
    setSession((current) => ({ ...current, rawInput: input, ingredients: pantryItems }))
    setGenerationStatus('idle')
    navigate('/ulam')
  }

  const updateSession = (next: DiscoverySession) => setSession(next)
  const removeIngredient = (id: string) => setSession((current) => ({ ...current, ingredients: current.ingredients.filter((ingredient) => ingredient.id !== id) }))

  const page: ReactNode = (() => {
    switch (route.name) {
      case 'home': return <HomePage onStart={startDiscovery} />
      case 'ulam': return <UlamPage session={session} onUpdate={updateSession} onGenerate={generateSuggestions} onRemove={removeIngredient} />
      case 'results': return <ResultsPage session={session} status={generationStatus} suggestions={suggestions} error={generationError} savedIds={savedIds} onOpen={(id) => navigate(`/recipes/${id}`)} onToggleSave={toggleSaved} onRetry={generateSuggestions} onEdit={() => navigate('/ulam')} />
      case 'recipe-detail': return <RecipeDetailPage key={route.recipeId} recipeId={route.recipeId} saved={savedIds.includes(route.recipeId)} onToggleSave={() => toggleSaved(route.recipeId)} onStartCooking={() => navigate(`/recipes/${route.recipeId}/cook`)} onBack={() => navigate('/results')} />
      case 'cooking': return <CookingPage recipeId={route.recipeId} onFinish={() => { toggleCooked(route.recipeId); navigate(`/recipes/${route.recipeId}`) }} onBack={() => navigate(`/recipes/${route.recipeId}`)} />
      case 'saved': return <SavedPage savedIds={savedIds} cookedIds={cookedIds} onOpen={(id) => navigate(`/recipes/${id}`)} onUnsave={toggleSaved} onStart={() => navigate('/ulam')} />
      case 'pantry': return <PantryPage pantryItems={pantryItems} onAdd={addPantryItem} onRemove={(id) => setPantryItems((items) => items.filter((item) => item.id !== id))} onGenerate={generateFromPantry} />
      case 'profile': return <ProfilePage />
      case 'auth': return <AuthPage onContinue={() => navigate('/')} />
      case 'not-found': return <RoutePlaceholder eyebrow="Not found" title="That kitchen corner is empty." description="This route does not exist yet." actionLabel="Back to Home" onAction={() => navigate('/')} />
    }
  })()

  return <AppShell routeName={route.name} onNavigate={navigate}>{page}</AppShell>
}

export default App

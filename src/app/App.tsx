import { useState } from 'react'
import { useAppRouter } from './router.ts'
import { AppShell } from '../components/AppShell.tsx'
import { IngredientPrompt } from '../components/IngredientPrompt.tsx'
import { RoutePlaceholder } from '../components/RoutePlaceholder.tsx'

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
        <div className="hero-illustration" aria-label="Illustration placeholder for a warm Filipino kitchen" role="img">
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

function App() {
  const { route, navigate } = useAppRouter()
  const [rawInput, setRawInput] = useState('')

  const startCooking = (value: string) => {
    if (value) setRawInput(value)
    navigate('/ulam')
  }

  const beginGeneration = (value: string) => {
    setRawInput(value)
    navigate('/results')
  }

  let page: React.ReactNode

  switch (route.name) {
    case 'home':
      page = <HomePage onStart={startCooking} />
      break
    case 'ulam':
      page = (
        <div className="page-shell narrow-page">
          <span className="eyebrow">Ulam AI</span>
          <h1>Start with what you have.</h1>
          <p className="page-intro">Review your ingredients before Hapag suggests what to cook.</p>
          <IngredientPrompt initialValue={rawInput} onSubmit={beginGeneration} compact />
          {rawInput ? <p className="session-note">Current ingredients: {rawInput}</p> : null}
        </div>
      )
      break
    case 'results':
      page = <RoutePlaceholder eyebrow="Recipe results" title="Three ideas are coming next." description="The route, session state, recipe service interface, and fixture data are ready for the static journey phase." actionLabel="Edit ingredients" onAction={() => navigate('/ulam')} />
      break
    case 'recipe-detail':
      page = <RoutePlaceholder eyebrow="Recipe detail" title="A structured recipe belongs here." description={`Recipe route ready for fixture rendering: ${route.recipeId}.`} actionLabel="Back to results" onAction={() => navigate('/results')} />
      break
    case 'cooking':
      page = <RoutePlaceholder eyebrow="Cooking mode" title="One calm step at a time." description={`Cooking session route ready for recipe: ${route.recipeId}.`} actionLabel="Back to recipe" onAction={() => navigate(`/recipes/${route.recipeId}`)} />
      break
    case 'saved':
      page = <RoutePlaceholder eyebrow="Saved recipes" title="Keep the meals that work." description="Saved and cooked history will use the Supabase-backed account service in a later phase." actionLabel="Find something to cook" onAction={() => navigate('/ulam')} />
      break
    case 'pantry':
      page = <RoutePlaceholder eyebrow="Pantry" title="Your ingredients, ready for the next idea." description="Pantry is mapped as a post-core feature. The route is ready without blocking the core recipe loop." actionLabel="Start with ingredients" onAction={() => navigate('/ulam')} />
      break
    case 'profile':
      page = <RoutePlaceholder eyebrow="Profile and preferences" title="Make Hapag fit your kitchen." description="Language, servings, dietary preferences, and account actions will be connected after the static flow is stable." actionLabel="Back to Home" onAction={() => navigate('/')} />
      break
    case 'auth':
      page = <RoutePlaceholder eyebrow="Account" title="Save recipes for later." description="Authentication is intentionally not connected in the frontend foundation phase." actionLabel="Continue exploring" onAction={() => navigate('/')} />
      break
    case 'not-found':
      page = <RoutePlaceholder eyebrow="Not found" title="That kitchen corner is empty." description="This route does not exist yet." actionLabel="Back to Home" onAction={() => navigate('/')} />
      break
  }

  return <AppShell routeName={route.name} onNavigate={navigate}>{page}</AppShell>
}

export default App

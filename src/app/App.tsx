import { type ReactNode, useEffect, useRef } from 'react'
import '../App.css'
import { AppShell } from '../components/AppShell.tsx'
import { useDiscovery } from '../hooks/useDiscovery.ts'
import { useAuth } from '../hooks/useAuth.ts'
import { usePreferences } from '../hooks/usePreferences.ts'
import { useSavedRecipes } from '../hooks/useSavedRecipes.ts'
import { useRecipeFeedback } from '../hooks/useRecipeFeedback.ts'
import { persistenceService } from '../services/persistenceService.ts'
import { AuthPage } from '../pages/AuthPage.tsx'
import { CookingPage } from '../pages/CookingPage.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'
import { ProfilePage } from '../pages/ProfilePage.tsx'
import { RecipeDetailPage } from '../pages/RecipeDetailPage.tsx'
import { ResultsPage } from '../pages/ResultsPage.tsx'
import { SavedPage } from '../pages/SavedPage.tsx'
import { UlamPage } from '../pages/UlamPage.tsx'
import { useAppRouter } from './router.ts'
import { DisplayLanguageContext } from './displayLanguage.ts'
import { useKusinaStaples } from '../hooks/useKusinaStaples.ts'
import { pickSurpriseDish } from '../lib/surprise.ts'

function App() {
  const { route, navigate } = useAppRouter()
  const auth = useAuth()
  const discovery = useDiscovery()
  const savedRecipes = useSavedRecipes(auth.session)
  const preferences = usePreferences(auth.session)
  const kusinaStaples = useKusinaStaples(auth.session)
  const sessionId = auth.session?.user.id
  const { applyPreferences } = discovery
  const appliedPreferencesKey = useRef<string | null>(null)
  useEffect(() => {
    if (!sessionId || preferences.status !== 'ready') return
    const value = preferences.preferences
    const key = [sessionId, value.language, value.default_servings, value.dietary_preference, value.spice_level, value.allergies.join('|')].join(':')
    if (appliedPreferencesKey.current === key) return
    appliedPreferencesKey.current = key
    applyPreferences(value)
  }, [sessionId, preferences.status, preferences.preferences, applyPreferences])
  const recipeFeedback = useRecipeFeedback()
  const startDiscovery = (value: string) => {
    discovery.startDiscovery(value)
    navigate('/ulam')
  }

  const startSurprise = () => {
    const dish = pickSurpriseDish()
    if (!dish) return
    discovery.startDiscovery(dish.requiredIngredients.join(', '), `Surprise! Here's what you need for ${dish.name}. Remove anything you don't have.`)
    navigate('/ulam')
  }

  const generateSuggestions = () => {
    if (discovery.session.ingredients.length === 0) return
    navigate('/results')
    void discovery.generateSuggestions(auth.session?.access_token)
  }

  const navigateFromShell = (path: string) => {
    if (path === '/ulam') discovery.resetDiscovery()
    navigate(path)
  }

  const requireAuth = () => { navigate('/auth') }
  const toggleSaved = (recipeId: string) => {
    if (!auth.session) { requireAuth(); return }
    void savedRecipes.toggleSaved(recipeId)
  }
  const finishCooking = () => {
    if (!auth.session) { requireAuth(); return }
    void savedRecipes.toggleCooked(route.name === 'cooking' ? route.recipeId : '')
    if (route.name === 'cooking') navigate(`/recipes/${route.recipeId}`)
  }
  const submitFeedback = (recipeId: string, kind: import('../hooks/useRecipeFeedback.ts').RecipeFeedbackKind) => {
    const previous = recipeFeedback.feedback[recipeId]
    recipeFeedback.setRecipeFeedback(recipeId, kind)
    if (!auth.session) return
    const operation = previous === kind
      ? persistenceService.removeRecipeFeedback(auth.session.user.id, recipeId)
      : persistenceService.submitRecipeFeedback(auth.session.user.id, {
        recipeId,
        feedbackType: kind,
        ingredients: discovery.session.ingredients,
        candidateDishes: discovery.candidateDishes,
      })
    void operation.catch(() => undefined)
  }

  const page: ReactNode = (() => {
    switch (route.name) {
      case 'home': return <HomePage onStart={startDiscovery} onSurprise={startSurprise} />
      case 'ulam': return <UlamPage session={discovery.session} notice={discovery.notice} staples={kusinaStaples.staples} staplesError={kusinaStaples.error} onAddIngredients={discovery.addIngredients} onReset={discovery.resetDiscovery} onUpdateConstraints={discovery.updateConstraints} onGenerate={generateSuggestions} onRemove={discovery.removeIngredient} onToggleStaple={(item) => void kusinaStaples.toggleStaple(item)} onSurprise={startSurprise} />
      case 'results': return <ResultsPage session={discovery.session} status={discovery.generationStatus} suggestions={recipeFeedback.rankRecipes(discovery.suggestions)} ideas={discovery.ideas} fallback={discovery.fallback} error={discovery.generationError} savedError={savedRecipes.error} savedIds={savedRecipes.savedIds} feedback={recipeFeedback.feedback} onOpen={(id) => navigate(`/recipes/${id}`)} onToggleSave={toggleSaved} onFeedback={submitFeedback} onRetry={generateSuggestions} onEdit={() => navigate('/ulam')} onAddIngredient={(name) => { discovery.addIngredients({ name }); navigate('/ulam') }} />
      case 'recipe-detail': return <RecipeDetailPage key={route.recipeId} recipeId={route.recipeId} saved={savedRecipes.savedIds.includes(route.recipeId)} onToggleSave={() => toggleSaved(route.recipeId)} onStartCooking={() => navigate(`/recipes/${route.recipeId}/cook`)} onBack={() => navigate('/results')} onStartOver={() => navigateFromShell('/ulam')} />
      case 'cooking': return <CookingPage key={route.recipeId} recipeId={route.recipeId} isSignedIn={Boolean(auth.session)} feedback={recipeFeedback.feedback[route.recipeId]} sessionIngredients={discovery.session.ingredients} onFinish={finishCooking} onBack={() => navigate(`/recipes/${route.recipeId}`)} onFeedback={(kind) => submitFeedback(route.recipeId, kind)} onUseLeftovers={(names, recipeTitle) => { discovery.startDiscovery(names.join(', '), `Leftovers from ${recipeTitle}. Add anything else you have, then find your next ulam.`); navigate('/ulam') }} />
      case 'saved': return <SavedPage isAuthenticated={Boolean(auth.session)} status={savedRecipes.status} error={savedRecipes.error} savedIds={savedRecipes.savedIds} savedRecipes={savedRecipes.savedRecipes} cookedRecipes={savedRecipes.cookedRecipes} onOpen={(id) => navigate(`/recipes/${id}`)} onUnsave={(id) => savedRecipes.toggleSaved(id)} onStart={() => navigate('/ulam')} onSignIn={requireAuth} onRetry={savedRecipes.reload} />
      case 'profile': return <ProfilePage key={auth.session?.user.id ?? 'signed-out'} session={auth.session} preferences={preferences.preferences} status={preferences.status} error={preferences.error} onSave={preferences.save} onSignIn={requireAuth} onSignOut={auth.signOut} />
      case 'auth': return <AuthPage session={auth.session} status={auth.status} error={auth.error} onSignIn={auth.signIn} onSignUp={auth.signUp} onSignOut={auth.signOut} onContinue={() => navigate('/')} />
      case 'not-found': return <NotFoundPage onBack={() => navigate('/')} />
    }
  })()

  const contentKey = route.name === 'recipe-detail' || route.name === 'cooking' ? `${route.name}:${route.recipeId}` : route.name
  const rawFullName = auth.session?.user.user_metadata?.full_name
  const fullName = typeof rawFullName === 'string' && rawFullName.trim() ? rawFullName.trim() : undefined
  return (
    <DisplayLanguageContext.Provider value={preferences.preferences.language}>
      <AppShell routeName={route.name} contentKey={contentKey} fullName={fullName} isSignedIn={Boolean(auth.session)} onNavigate={navigateFromShell}>{page}</AppShell>
    </DisplayLanguageContext.Provider>
  )
}

export default App

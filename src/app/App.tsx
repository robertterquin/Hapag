import { useEffect, useRef, useState, type ReactNode } from 'react'
import '../App.css'
import { AppShell } from '../components/AppShell.tsx'
import { useDiscovery } from '../hooks/useDiscovery.ts'
import { useAuth } from '../hooks/useAuth.ts'
import { usePantry } from '../hooks/usePantry.ts'
import { usePreferences } from '../hooks/usePreferences.ts'
import { useSavedRecipes } from '../hooks/useSavedRecipes.ts'
import { AuthPage } from '../pages/AuthPage.tsx'
import { CookingPage } from '../pages/CookingPage.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'
import { PantryPage } from '../pages/PantryPage.tsx'
import { ProfilePage } from '../pages/ProfilePage.tsx'
import { RecipeDetailPage } from '../pages/RecipeDetailPage.tsx'
import { ResultsPage } from '../pages/ResultsPage.tsx'
import { SavedPage } from '../pages/SavedPage.tsx'
import { UlamPage } from '../pages/UlamPage.tsx'
import { useAppRouter } from './router.ts'

function App() {
  const { route, navigate } = useAppRouter()
  const auth = useAuth()
  const discovery = useDiscovery()
  const savedRecipes = useSavedRecipes(auth.session)
  const preferences = usePreferences(auth.session)
  const pantry = usePantry(auth.session)
  const [pantryPickerExpanded, setPantryPickerExpanded] = useState(false)
  const initializedUlamFromIngredients = useRef(false)

  useEffect(() => {
    if (route.name !== 'ulam') {
      initializedUlamFromIngredients.current = false
      return
    }
    if (pantry.status === 'ready' && pantry.pantryItems.length > 0 && discovery.session.ingredients.length === 0 && !initializedUlamFromIngredients.current) {
      initializedUlamFromIngredients.current = true
      discovery.startFromPantry(pantry.pantryItems)
      setPantryPickerExpanded(true)
    }
  }, [route.name, pantry.status, pantry.pantryItems, discovery])

  const startDiscovery = (value: string) => {
    discovery.startDiscovery(value)
    setPantryPickerExpanded(false)
    navigate('/ulam')
  }

  const generateSuggestions = () => {
    if (discovery.session.ingredients.length === 0) return
    navigate('/results')
    void discovery.generateSuggestions()
  }

  const usePantryInUlam = () => {
    discovery.startFromPantry(pantry.pantryItems)
    setPantryPickerExpanded(true)
    navigate('/ulam')
  }

  const navigateFromShell = (path: string) => {
    if (path === '/ulam' && pantry.pantryItems.length > 0 && discovery.session.ingredients.length === 0) {
      discovery.startFromPantry(pantry.pantryItems)
      setPantryPickerExpanded(true)
    } else {
      setPantryPickerExpanded(false)
    }
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

  const page: ReactNode = (() => {
    switch (route.name) {
      case 'home': return <HomePage onStart={startDiscovery} />
      case 'ulam': return <UlamPage session={discovery.session} pantryItems={pantry.pantryItems} pantryPickerExpanded={pantryPickerExpanded} onTogglePantryPicker={() => setPantryPickerExpanded((expanded) => !expanded)} onApplyPantrySelection={discovery.replacePantryIngredients} onAddIngredients={discovery.addIngredients} onUpdateConstraints={discovery.updateConstraints} onGenerate={generateSuggestions} onRemove={discovery.removeIngredient} />
      case 'results': return <ResultsPage session={discovery.session} status={discovery.generationStatus} suggestions={discovery.suggestions} error={discovery.generationError} savedError={savedRecipes.error} savedIds={savedRecipes.savedIds} onOpen={(id) => navigate(`/recipes/${id}`)} onToggleSave={toggleSaved} onRetry={generateSuggestions} onEdit={() => navigate('/ulam')} />
      case 'recipe-detail': return <RecipeDetailPage key={route.recipeId} recipeId={route.recipeId} saved={savedRecipes.savedIds.includes(route.recipeId)} onToggleSave={() => toggleSaved(route.recipeId)} onStartCooking={() => navigate(`/recipes/${route.recipeId}/cook`)} onBack={() => navigate('/results')} />
      case 'cooking': return <CookingPage key={route.recipeId} recipeId={route.recipeId} onFinish={finishCooking} onBack={() => navigate(`/recipes/${route.recipeId}`)} />
      case 'saved': return <SavedPage isAuthenticated={Boolean(auth.session)} status={savedRecipes.status} error={savedRecipes.error} savedIds={savedRecipes.savedIds} savedRecipes={savedRecipes.savedRecipes} cookedRecipes={savedRecipes.cookedRecipes} onOpen={(id) => navigate(`/recipes/${id}`)} onUnsave={(id) => savedRecipes.toggleSaved(id)} onStart={() => navigate('/ulam')} onSignIn={requireAuth} onRetry={savedRecipes.reload} />
      case 'pantry': return <PantryPage isAuthenticated={Boolean(auth.session)} status={pantry.status} error={pantry.error} pantryItems={pantry.pantryItems} onAdd={pantry.addPantryItem} onUpdate={pantry.updatePantryItem} onRemove={pantry.removePantryItem} onUseInUlam={usePantryInUlam} onSignIn={requireAuth} onRetry={pantry.reload} />
      case 'profile': return <ProfilePage key={`${auth.session?.user.id ?? 'signed-out'}-${preferences.preferences.language}-${preferences.preferences.default_servings}-${preferences.preferences.dietary_preference}`} session={auth.session} preferences={preferences.preferences} status={preferences.status} error={preferences.error} onSave={preferences.save} onSignIn={requireAuth} onSignOut={auth.signOut} />
      case 'auth': return <AuthPage session={auth.session} status={auth.status} error={auth.error} onSignIn={auth.signIn} onSignUp={auth.signUp} onSignOut={auth.signOut} onContinue={() => navigate('/')} />
      case 'not-found': return <NotFoundPage onBack={() => navigate('/')} />
    }
  })()

  return <AppShell routeName={route.name} onNavigate={navigateFromShell}>{page}</AppShell>
}

export default App

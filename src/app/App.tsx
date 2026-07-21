import type { ReactNode } from 'react'
import '../App.css'
import { AppShell } from '../components/AppShell.tsx'
import { useDiscovery } from '../hooks/useDiscovery.ts'
import { usePantry } from '../hooks/usePantry.ts'
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
  const discovery = useDiscovery()
  const savedRecipes = useSavedRecipes()
  const pantry = usePantry()

  const startDiscovery = (value: string) => {
    discovery.startDiscovery(value)
    navigate('/ulam')
  }

  const generateSuggestions = () => {
    if (discovery.session.ingredients.length === 0) return
    navigate('/results')
    void discovery.generateSuggestions()
  }

  const generateFromPantry = () => {
    const input = pantry.pantryItems.map((item) => item.name).join(', ')
    discovery.startFromIngredients(input, pantry.pantryItems)
    navigate('/ulam')
  }

  const page: ReactNode = (() => {
    switch (route.name) {
      case 'home': return <HomePage onStart={startDiscovery} />
      case 'ulam': return <UlamPage session={discovery.session} onUpdateIngredients={discovery.updateIngredients} onUpdateConstraints={discovery.updateConstraints} onGenerate={generateSuggestions} onRemove={discovery.removeIngredient} />
      case 'results': return <ResultsPage session={discovery.session} status={discovery.generationStatus} suggestions={discovery.suggestions} error={discovery.generationError} savedIds={savedRecipes.savedIds} onOpen={(id) => navigate(`/recipes/${id}`)} onToggleSave={savedRecipes.toggleSaved} onRetry={generateSuggestions} onEdit={() => navigate('/ulam')} />
      case 'recipe-detail': return <RecipeDetailPage key={route.recipeId} recipeId={route.recipeId} saved={savedRecipes.savedIds.includes(route.recipeId)} onToggleSave={() => savedRecipes.toggleSaved(route.recipeId)} onStartCooking={() => navigate(`/recipes/${route.recipeId}/cook`)} onBack={() => navigate('/results')} />
      case 'cooking': return <CookingPage key={route.recipeId} recipeId={route.recipeId} onFinish={() => { savedRecipes.toggleCooked(route.recipeId); navigate(`/recipes/${route.recipeId}`) }} onBack={() => navigate(`/recipes/${route.recipeId}`)} />
      case 'saved': return <SavedPage savedIds={savedRecipes.savedIds} cookedIds={savedRecipes.cookedIds} onOpen={(id) => navigate(`/recipes/${id}`)} onUnsave={savedRecipes.toggleSaved} onStart={() => navigate('/ulam')} />
      case 'pantry': return <PantryPage pantryItems={pantry.pantryItems} onAdd={pantry.addPantryItem} onRemove={pantry.removePantryItem} onGenerate={generateFromPantry} />
      case 'profile': return <ProfilePage />
      case 'auth': return <AuthPage onContinue={() => navigate('/')} />
      case 'not-found': return <NotFoundPage onBack={() => navigate('/')} />
    }
  })()

  return <AppShell routeName={route.name} onNavigate={navigate}>{page}</AppShell>
}

export default App

import { RecipeCard } from '../components/RecipeCard.tsx'
import { ResultsSkeleton } from '../components/Skeletons.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import type { DiscoverySession, Recipe } from '../types/domain.ts'
import type { GenerationStatus } from '../hooks/useDiscovery.ts'

export interface ResultsPageProps {
  session: DiscoverySession
  status: GenerationStatus
  suggestions: Recipe[]
  error: string | null
  savedIds: string[]
  onOpen: (recipeId: string) => void
  onToggleSave: (recipeId: string) => void
  onRetry: () => void
  onEdit: () => void
}

export function ResultsPage({ session, status, suggestions, error, savedIds, onOpen, onToggleSave, onRetry, onEdit }: ResultsPageProps) {
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

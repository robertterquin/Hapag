import { CookingLoadingState } from '../components/CookingLoadingState.tsx'
import { RecipeCard } from '../components/RecipeCard.tsx'
import { ResultsSkeleton } from '../components/Skeletons.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import type { GenerationStatus } from '../hooks/useDiscovery.ts'
import type { DiscoverySession, Recipe } from '../types/domain.ts'
import type { RecipeFeedbackKind } from '../hooks/useRecipeFeedback.ts'

export interface ResultsPageProps {
  session: DiscoverySession
  status: GenerationStatus
  suggestions: Recipe[]
  error: string | null
  savedError: string | null
  savedIds: string[]
  onOpen: (recipeId: string) => void
  onToggleSave: (recipeId: string) => void
  feedback: Record<string, RecipeFeedbackKind>
  onFeedback: (recipeId: string, kind: RecipeFeedbackKind) => void
  onRetry: () => void
  onEdit: () => void
}

export function ResultsPage({ session, status, suggestions, error, savedError, savedIds, feedback, onOpen, onToggleSave, onFeedback, onRetry, onEdit }: ResultsPageProps) {
  if (status === 'loading') {
    return (
      <div className="page-shell">
        <span className="eyebrow">Mga resulta ng recipe</span>
        <h1>Naghahanap ng ulam…</h1>
        <p className="page-intro">Tinitingnan namin kung ano ang puwedeng lutuin gamit ang mga sangkap mo.</p>
        <CookingLoadingState ingredients={session.ingredients} rawInput={session.rawInput} />
        <ResultsSkeleton />
      </div>
    )
  }

  if (status === 'error') {
    return <StatePanel tone="error" icon="!" title="Wala muna akong nakitang angkop na ulam." description={error ?? 'May nangyaring hindi inaasahan. Nandito pa rin ang mga sangkap mo.'} actionLabel="Subukan ulit" onAction={onRetry} secondaryLabel="Ayusin ang mga sangkap" onSecondary={onEdit} />
  }

  if (status === 'success' && suggestions.length === 0) {
    return <StatePanel tone="empty" title="Wala akong nakitang angkop na ulam." description="Bawasan ang mga filter o magdagdag ng sangkap para mas marami tayong mapagpilian." actionLabel="Ayusin ang mga sangkap" onAction={onEdit} secondaryLabel="Subukan ulit" onSecondary={onRetry} />
  }

  return (
    <div className="page-shell">
      <div className="results-header">
        <div>
          <span className="eyebrow">Mga resulta ng recipe</span>
          <h1>Mga puwedeng lutuin</h1>
          <p className="page-intro">Tatlong ideya mula sa: <strong>{session.rawInput || 'mga sangkap mo'}</strong></p>
        </div>
        <button className="button button-secondary" type="button" onClick={onEdit}>Ayusin ang mga sangkap</button>
      </div>
      {savedError ? <div className="error-banner" role="alert">{savedError}</div> : null}
      <div className="active-filter-row" aria-label="Applied constraints">
        <span className="filter-pill">{session.constraints.servings} servings</span>
        {session.constraints.budgetLimit ? <span className="filter-pill">Mas mababa sa ₱{session.constraints.budgetLimit}</span> : null}
        {session.constraints.dietaryPreference && session.constraints.dietaryPreference !== 'none' ? <span className="filter-pill">{session.constraints.dietaryPreference}</span> : null}
        <span className="filter-pill">{session.constraints.spiceLevel} spice</span>
      </div>
      <div className="results-guidance" role="note">
        <strong>Paano basahin ang resulta:</strong>
        <span><b>Meron ka na</b> — sangkap na inilagay mo</span>
        <span><b>Kulang pa</b> — sangkap na maaaring kailanganin</span>
      </div>
      <div className="results-grid">
        {suggestions.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} animationIndex={index} saved={savedIds.includes(recipe.id)} feedback={feedback[recipe.id]} onOpen={() => onOpen(recipe.id)} onToggleSave={() => onToggleSave(recipe.id)} onFeedback={(kind) => onFeedback(recipe.id, kind)} />)}
      </div>
      <div className="results-footer-actions">
        <button className="button button-secondary" type="button" onClick={onRetry}>Subukan ulit</button>
      </div>
      <p className="trust-note trust-note-block">AI-generated suggestions. Tantiya lamang ang presyo. Suriin ang mga sangkap at labels bago magluto.</p>
    </div>
  )
}

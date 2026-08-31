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
        <span className="eyebrow">Recipe Suggestions</span>
        <h1>Finding dishes…</h1>
        <p className="page-intro">Discovering Filipino dishes you can cook with your ingredients.</p>
        <CookingLoadingState ingredients={session.ingredients} rawInput={session.rawInput} />
        <ResultsSkeleton />
      </div>
    )
  }

  if (status === 'error') {
    return <StatePanel tone="error" icon="!" title="No matching dishes found." description={error ?? 'Something unexpected happened. Your ingredients are still saved.'} actionLabel="Try Again" onAction={onRetry} secondaryLabel="Edit Ingredients" onSecondary={onEdit} />
  }

  if (status === 'success' && suggestions.length === 0) {
    return <StatePanel tone="empty" title="No matching dishes found." description="Try adjusting your filters or adding more ingredients for more options." actionLabel="Edit Ingredients" onAction={onEdit} secondaryLabel="Try Again" onSecondary={onRetry} />
  }

  return (
    <div className="page-shell">
      <div className="results-header">
        <div>
          <span className="eyebrow">Recipe Suggestions</span>
          <h1>Dishes you can cook</h1>
          <p className="page-intro">3 meal ideas matching: <strong>{session.rawInput || 'your ingredients'}</strong></p>
        </div>
        <button className="button button-secondary" type="button" onClick={onEdit}>Edit Ingredients</button>
      </div>
      {savedError ? <div className="error-banner" role="alert">{savedError}</div> : null}
      <div className="active-filter-row" aria-label="Applied constraints">
        <span className="filter-pill">{session.constraints.servings} servings</span>
        {session.constraints.budgetLimit ? <span className="filter-pill">Under ₱{session.constraints.budgetLimit}</span> : null}
        {session.constraints.dietaryPreference && session.constraints.dietaryPreference !== 'none' ? <span className="filter-pill">{session.constraints.dietaryPreference}</span> : null}
        <span className="filter-pill">{session.constraints.spiceLevel} spice</span>
      </div>
      <div className="results-guidance" role="note">
        <strong>Guide:</strong>
        <span><b>You have</b> — ingredients provided</span>
        <span><b>Missing</b> — additional pantry items</span>
      </div>
      <div className="results-grid">
        {suggestions.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} animationIndex={index} saved={savedIds.includes(recipe.id)} feedback={feedback[recipe.id]} onOpen={() => onOpen(recipe.id)} onToggleSave={() => onToggleSave(recipe.id)} onFeedback={(kind) => onFeedback(recipe.id, kind)} />)}
      </div>
      <div className="results-footer-actions">
        <button className="button button-secondary" type="button" onClick={onRetry}>Try Again</button>
      </div>
      <p className="trust-note trust-note-block">AI-generated suggestions. Prices are estimates. Verify ingredients and labels before cooking.</p>
    </div>
  )
}


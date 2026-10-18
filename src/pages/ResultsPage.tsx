import { Icon } from '@iconify/react'
import { CookingLoadingState } from '../components/CookingLoadingState.tsx'
import { labelForIngredient, labelForName } from '../lib/ingredientLabels.ts'
import { useDisplayLanguage } from '../app/displayLanguage.ts'
import { DishIdeaCard } from '../components/DishIdeaCard.tsx'
import { RecipeCard } from '../components/RecipeCard.tsx'
import { ResultsSkeleton } from '../components/Skeletons.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import { suggestUnlockIngredient } from '../lib/catalogIdeas.ts'
import type { DishIdea } from '../lib/catalogIdeas.ts'
import type { FallbackReason, GenerationStatus } from '../hooks/useDiscovery.ts'
import type { DiscoverySession, Recipe } from '../types/domain.ts'
import type { RecipeFeedbackKind } from '../hooks/useRecipeFeedback.ts'

export interface ResultsPageProps {
  session: DiscoverySession
  status: GenerationStatus
  suggestions: Recipe[]
  ideas: DishIdea[]
  fallback: FallbackReason
  error: string | null
  savedError: string | null
  savedIds: string[]
  onOpen: (recipeId: string) => void
  onToggleSave: (recipeId: string) => void
  feedback: Record<string, RecipeFeedbackKind>
  onFeedback: (recipeId: string, kind: RecipeFeedbackKind) => void
  onRetry: () => void
  onEdit: () => void
  onAddIngredient: (name: string) => void
}

const fallbackNotes: Record<Exclude<FallbackReason, null>, string> = {
  'not-configured': "AI recipes aren't set up here, so these are matches from Hapag's Filipino dish catalog. They don't have step-by-step instructions or prices yet.",
  error: 'AI recipes are unavailable right now, so here are matches from our Filipino dish catalog.',
}

export function ResultsPage({ session, status, suggestions, ideas, fallback, error, savedError, savedIds, feedback, onOpen, onToggleSave, onFeedback, onRetry, onEdit, onAddIngredient }: ResultsPageProps) {
  const language = useDisplayLanguage()

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

  const showIdeas = Boolean(fallback) && ideas.length > 0

  // Nothing searched yet in this session, e.g. after a page reload.
  if (status === 'idle' && suggestions.length === 0) {
    return <StatePanel tone="empty" title="No search yet" description="Tell Hapag what's in your kusina to see dishes you can cook." actionLabel="Find dishes" onAction={onEdit} />
  }

  if (status === 'error' && !showIdeas) {
    return <StatePanel tone="error" icon="!" title="We couldn't get recipes right now." description={error ?? 'Something unexpected happened. Your ingredients are still saved.'} actionLabel="Try Again" onAction={onRetry} secondaryLabel="Edit Ingredients" onSecondary={onEdit} />
  }

  if (status === 'success' && suggestions.length === 0 && !showIdeas) {
    const unlock = suggestUnlockIngredient(session.ingredients)
    return (
      <div className="page-shell narrow-page">
        <StatePanel tone="empty" title="No matching dishes yet." description="These ingredients don't match a dish in our catalog. One more ingredient often makes the difference." actionLabel="Edit Ingredients" onAction={onEdit} />
        {unlock ? (
          <div className="unlock-hint">
            <p>Add {labelForName(unlock.name, language)} to unlock {unlock.gain} {unlock.gain === 1 ? 'dish' : 'dishes'}.</p>
            <button className="button button-secondary" type="button" onClick={() => onAddIngredient(unlock.name)}>
              <Icon icon="lucide:plus" width={16} height={16} aria-hidden="true" /> Add {labelForName(unlock.name, language)}
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  const count = suggestions.length > 0 ? suggestions.length : ideas.length
  const ingredientList = session.ingredients.length > 0 ? session.ingredients.map((ingredient) => labelForIngredient(ingredient, language)).join(', ') : 'your ingredients'

  return (
    <div className="page-shell">
      <div className="results-header">
        <div>
          <span className="eyebrow">Recipe Suggestions</span>
          <h1>Dishes you can cook</h1>
          <p className="page-intro">{count} {count === 1 ? 'idea' : 'ideas'} for: <strong>{ingredientList}</strong></p>
        </div>
        <button className="button button-secondary" type="button" onClick={onEdit}>Edit Ingredients</button>
      </div>
      {savedError ? <div className="error-banner" role="alert">{savedError}</div> : null}
      {status === 'error' && error ? <div className="error-banner" role="alert">{error}</div> : null}
      <div className="active-filter-row" aria-label="Applied constraints">
        <span className="filter-pill">{session.constraints.servings} servings</span>
        {session.constraints.budgetLimit ? <span className="filter-pill">Under ₱{session.constraints.budgetLimit}</span> : null}
        {session.constraints.dietaryPreference && session.constraints.dietaryPreference !== 'none' ? <span className="filter-pill">{session.constraints.dietaryPreference}</span> : null}
        <span className="filter-pill">{session.constraints.spiceLevel} spice</span>
      </div>

      {suggestions.length > 0 ? (
        <div className="results-grid">
          {suggestions.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} animationIndex={index} saved={savedIds.includes(recipe.id)} feedback={feedback[recipe.id]} onOpen={() => onOpen(recipe.id)} onToggleSave={() => onToggleSave(recipe.id)} onFeedback={(kind) => onFeedback(recipe.id, kind)} />)}
        </div>
      ) : null}

      {showIdeas && fallback ? (
        <section className="ideas-section" aria-labelledby="ideas-heading">
          <h2 id="ideas-heading">{suggestions.length > 0 ? 'More dishes that match' : 'Dishes that match your ingredients'}</h2>
          <p className="ideas-note">
            <Icon icon="lucide:info" width={16} height={16} aria-hidden="true" />
            <span>{fallbackNotes[fallback]}</span>
          </p>
          <div className="results-grid">
            {ideas.map((idea) => <DishIdeaCard key={idea.id} idea={idea} />)}
          </div>
        </section>
      ) : null}

      <div className="results-footer-actions">
        <button className="button button-secondary" type="button" onClick={onRetry}>Try Again</button>
      </div>
      <p className="trust-note trust-note-block">{suggestions.some((recipe) => recipe.source === 'ai') ? 'AI-generated suggestions. ' : ''}Prices are estimates. Verify ingredients and labels before cooking. Dish photos from Wikimedia Commons; credits on each photo.</p>
    </div>
  )
}

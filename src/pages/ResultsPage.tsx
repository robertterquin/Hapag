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

// One message explains the fallback; it replaces the separate error banner.
const fallbackNotes: Record<Exclude<FallbackReason, null>, string> = {
  'not-configured': "AI recipes aren't set up here, so these come from Hapag's Filipino dish catalog, without steps or prices.",
  error: "AI recipes aren't available right now, so these come from Hapag's Filipino dish catalog.",
}

const spiceLabels = { mild: 'Mild', medium: 'Medium', hot: 'Spicy' } as const

export function ResultsPage({ session, status, suggestions, ideas, fallback, error, savedError, savedIds, feedback, onOpen, onToggleSave, onFeedback, onRetry, onEdit, onAddIngredient }: ResultsPageProps) {
  const language = useDisplayLanguage()

  if (status === 'loading') {
    return (
      <div className="page-shell">
        <h1>Finding dishes…</h1>
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
    return <StatePanel tone="error" icon="!" title="We couldn't get recipes right now." description={error ?? 'Something unexpected happened. Your ingredients are still saved.'} actionLabel="Try again" onAction={onRetry} secondaryLabel="Edit ingredients" onSecondary={onEdit} />
  }

  if (status === 'success' && suggestions.length === 0 && !showIdeas) {
    const unlock = suggestUnlockIngredient(session.ingredients)
    return (
      <div className="page-shell narrow-page">
        <StatePanel tone="empty" title="No matching dishes yet." description="These ingredients don't match a dish in our catalog. One more ingredient often makes the difference." actionLabel="Edit ingredients" onAction={onEdit} />
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

  const ingredientList = session.ingredients.map((ingredient) => labelForIngredient(ingredient, language)).join(', ')
  const { servings, spiceLevel, budgetLimit, dietaryPreference } = session.constraints
  const settings = [
    `${servings} ${servings === 1 ? 'serving' : 'servings'}`,
    spiceLabels[spiceLevel],
    budgetLimit ? `Under ₱${budgetLimit}` : null,
    dietaryPreference && dietaryPreference !== 'none' ? dietaryPreference.replace('-', ' ') : null,
  ].filter(Boolean).join(' · ')
  const hasAiRecipes = suggestions.some((recipe) => recipe.source === 'ai')

  return (
    <div className="page-shell">
      <header className="results-header">
        <h1>Dishes you can cook</h1>
        <p className="results-summary">
          <span>{ingredientList}</span>
          <span className="results-summary-settings">{settings}</span>
          <button className="text-button" type="button" onClick={onEdit}>Edit</button>
        </p>
      </header>
      {savedError ? <div className="error-banner" role="alert">{savedError}</div> : null}

      {suggestions.length > 0 ? (
        <div className="results-grid">
          {suggestions.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} animationIndex={index} saved={savedIds.includes(recipe.id)} feedback={feedback[recipe.id]} onOpen={() => onOpen(recipe.id)} onToggleSave={() => onToggleSave(recipe.id)} onFeedback={(kind) => onFeedback(recipe.id, kind)} />)}
        </div>
      ) : null}

      {showIdeas && fallback ? (
        <section className="ideas-section" aria-labelledby={suggestions.length > 0 ? 'ideas-heading' : undefined} aria-label={suggestions.length > 0 ? undefined : 'Catalog matches'}>
          {suggestions.length > 0 ? <h2 id="ideas-heading">More dishes that match</h2> : null}
          <p className="ideas-note" role={fallback === 'error' ? 'status' : undefined}>
            <Icon icon="lucide:info" width={16} height={16} aria-hidden="true" />
            <span>{fallbackNotes[fallback]}</span>
            {fallback === 'error' ? <button className="text-button" type="button" onClick={onRetry}>Try again</button> : null}
          </p>
          <div className="results-grid">
            {ideas.map((idea) => <DishIdeaCard key={idea.id} idea={idea} />)}
          </div>
        </section>
      ) : null}

      {hasAiRecipes ? (
        <div className="results-footer-actions">
          <button className="text-button" type="button" onClick={onRetry}>
            <Icon icon="lucide:refresh-cw" width={16} height={16} aria-hidden="true" /> Show other dishes
          </button>
        </div>
      ) : null}
      <p className="trust-note trust-note-block">Prices are estimates. Check labels before cooking.</p>
    </div>
  )
}

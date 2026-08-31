import { RecipeCard } from '../components/RecipeCard.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import type { Recipe } from '../types/domain.ts'

export interface SavedPageProps { isAuthenticated: boolean; status: string; error: string | null; savedIds: string[]; savedRecipes: Recipe[]; cookedRecipes: Recipe[]; onOpen: (id: string) => void; onUnsave: (id: string) => Promise<void>; onStart: () => void; onSignIn: () => void; onRetry: () => void }

export function SavedPage({ isAuthenticated, status, error, savedIds, savedRecipes, cookedRecipes, onOpen, onUnsave, onStart, onSignIn, onRetry }: SavedPageProps) {
  if (!isAuthenticated) return <div className="page-shell"><StatePanel title="Sign in to view your saved recipes" description="Saved recipes and cooking history are kept private to your account." actionLabel="Sign In" onAction={onSignIn} secondaryLabel="Find Recipes" onSecondary={onStart} /></div>
  if (status === 'error') return <div className="page-shell"><StatePanel tone="error" title="Could not load your saved recipes" description={error ?? 'Please check your connection and try again.'} actionLabel="Try Again" onAction={onRetry} secondaryLabel="Find Recipes" onSecondary={onStart} /></div>
  if (status !== 'ready') return <div className="page-shell"><span className="eyebrow">Saved Recipes</span><h1>Loading your recipes…</h1></div>
  return (
    <div className="page-shell">
      <span className="eyebrow">Saved Recipes</span>
      <h1>Your personal recipe collection</h1>
      <p className="page-intro">Save your favorite recipes and keep track of dishes you have cooked.</p>
      {savedRecipes.length === 0 && cookedRecipes.length === 0 ? (
        <StatePanel title="No saved recipes yet" description="Save recipes to easily access and cook them anytime." actionLabel="Find Recipes" onAction={onStart} />
      ) : (
        <>
          <section className="saved-section" aria-labelledby="favorites-heading">
            <div className="section-heading-row">
              <h2 id="favorites-heading">Favorites</h2>
              <span className="count-badge">{savedRecipes.length}</span>
            </div>
            {savedRecipes.length > 0 ? (
              <div className="results-grid">
                {savedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} saved onOpen={() => onOpen(recipe.id)} onToggleSave={() => void onUnsave(recipe.id)} />
                ))}
              </div>
            ) : (
              <p className="muted-copy">No favorites saved yet.</p>
            )}
          </section>
          <section className="saved-section" aria-labelledby="cooked-heading">
            <div className="section-heading-row">
              <h2 id="cooked-heading">Cooked Dishes</h2>
              <span className="count-badge">{cookedRecipes.length}</span>
            </div>
            {cookedRecipes.length > 0 ? (
              <div className="results-grid">
                {cookedRecipes.map((recipe) => (
                  <RecipeCard key={`${recipe.id}-${recipe.title}`} recipe={recipe} saved={savedIds.includes(recipe.id)} onOpen={() => onOpen(recipe.id)} onToggleSave={() => void onUnsave(recipe.id)} />
                ))}
              </div>
            ) : (
              <p className="muted-copy">No dishes recorded as cooked yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}


import { RecipeCard } from '../components/RecipeCard.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import { recipeFixtures } from '../data/fixtures.ts'

export interface SavedPageProps {
  savedIds: string[]
  cookedIds: string[]
  onOpen: (id: string) => void
  onUnsave: (id: string) => void
  onStart: () => void
}

export function SavedPage({ savedIds, cookedIds, onOpen, onUnsave, onStart }: SavedPageProps) {
  const savedRecipes = recipeFixtures.filter((recipe) => savedIds.includes(recipe.id))
  const cookedRecipes = recipeFixtures.filter((recipe) => cookedIds.includes(recipe.id))

  return (
    <div className="page-shell">
      <span className="eyebrow">Saved recipes</span>
      <h1>Keep the meals that work.</h1>
      <p className="page-intro">Save a recipe or mark it cooked so your next meal starts with less guesswork.</p>
      {savedRecipes.length === 0 && cookedRecipes.length === 0 ? <StatePanel title="Wala pang saved recipes" description="Mag-save ng recipe para mabalikan mo sa susunod." actionLabel="Find something to cook" onAction={onStart} /> : <>
        <section className="saved-section" aria-labelledby="favorites-heading"><div className="section-heading-row"><h2 id="favorites-heading">Favorites</h2><span className="count-badge">{savedRecipes.length}</span></div>{savedRecipes.length > 0 ? <div className="results-grid">{savedRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} saved onOpen={() => onOpen(recipe.id)} onToggleSave={() => onUnsave(recipe.id)} />)}</div> : <p className="muted-copy">Wala pang favorites.</p>}</section>
        <section className="saved-section" aria-labelledby="cooked-heading"><div className="section-heading-row"><h2 id="cooked-heading">I cooked this</h2><span className="count-badge">{cookedRecipes.length}</span></div>{cookedRecipes.length > 0 ? <div className="results-grid">{cookedRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} saved={savedIds.includes(recipe.id)} onOpen={() => onOpen(recipe.id)} onToggleSave={() => onUnsave(recipe.id)} />)}</div> : <p className="muted-copy">Wala pang cooking history.</p>}</section>
      </>}
    </div>
  )
}

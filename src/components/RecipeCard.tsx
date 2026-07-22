import type { Recipe } from '../types/domain.ts'
import { formatCost } from '../lib/format.ts'

interface RecipeCardProps {
  recipe: Recipe
  saved: boolean
  onOpen: () => void
  onToggleSave: () => void
}

export function RecipeCard({ recipe, saved, onOpen, onToggleSave }: RecipeCardProps) {
  const available = recipe.ingredients.filter((ingredient) => ingredient.available)
  const missing = recipe.ingredients.filter((ingredient) => !ingredient.available)

  return (
    <article className="recipe-card">
      <div className="recipe-card-topline">
        <span className="recipe-badge">{recipe.tags[0]}</span>
        <button className={`save-button ${saved ? 'save-button-saved' : ''}`} type="button" onClick={onToggleSave} aria-label={saved ? `Unsave ${recipe.title}` : `Save ${recipe.title}`} aria-pressed={saved}>
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <button className="recipe-card-main" type="button" onClick={onOpen}>
        <h2>{recipe.title}</h2>
        <p className="recipe-match">{recipe.matchReason}</p>
        <div className="recipe-metrics" aria-label="Recipe summary">
          <span>{recipe.timeMinutes} min</span>
          <span>{recipe.difficulty}</span>
          <span>{formatCost(recipe.estimatedCost)}</span>
          <span>{recipe.servings} serv.</span>
        </div>
        <div className="ingredient-summary">
          <div><strong>Meron ka na</strong>{available.map((ingredient) => <span key={ingredient.id}>{ingredient.name}</span>)}</div>
          <div><strong>Kulang pa</strong>{missing.length > 0 ? missing.map((ingredient) => <span key={ingredient.id}>{ingredient.name}</span>) : <span>Wala</span>}</div>
        </div>
        <span className="card-action">Tingnan ang recipe <span aria-hidden="true">→</span></span>
      </button>
    </article>
  )
}

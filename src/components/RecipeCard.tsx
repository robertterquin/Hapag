import { motion } from 'motion/react'
import type { Recipe } from '../types/domain.ts'
import { formatCost } from '../lib/format.ts'
import type { RecipeAuthenticity } from '../types/domain.ts'
import { RecipeFeedback } from './RecipeFeedback.tsx'
import type { RecipeFeedbackKind } from '../hooks/useRecipeFeedback.ts'

interface RecipeCardProps {
  recipe: Recipe
  saved: boolean
  onOpen: () => void
  onToggleSave: () => void
  feedback?: RecipeFeedbackKind
  onFeedback?: (kind: RecipeFeedbackKind) => void
  animationIndex?: number
}

export function RecipeCard({ recipe, saved, onOpen, onToggleSave, feedback, onFeedback, animationIndex = 0 }: RecipeCardProps) {
  const available = recipe.ingredients.filter((ingredient) => ingredient.available)
  const missing = recipe.ingredients.filter((ingredient) => !ingredient.available)
  const delay = Math.min(animationIndex, 5) * 0.045
  const authenticityLabels: Record<RecipeAuthenticity, string> = {
    classic: 'Klasikong pagkaing Filipino',
    'home-style': 'Lutong-bahay na Filipino',
    'hapag-adaptation': 'Hapag adaptation',
  }

  return (
    <motion.article className="recipe-card" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6, scale: 1.012 }} transition={{ duration: 0.26, delay, ease: 'easeOut' }}>
      {recipe.imageUrl ? (
        <img className="recipe-card-image" src={recipe.imageUrl} alt="" loading="lazy" />
      ) : (
        <div className="recipe-card-image recipe-card-image-placeholder" aria-hidden="true">
          <span className="placeholder-pattern" />
          <span className="placeholder-brand">Hapag Recipe</span>
        </div>
      )}
      <div className="recipe-card-topline">
        <span className="recipe-badge">{recipe.tags[0]}</span>
        {recipe.authenticity ? <span className="recipe-authenticity-badge">{authenticityLabels[recipe.authenticity]}</span> : null}
        <motion.button className={`save-button ${saved ? 'save-button-saved' : ''}`} type="button" onClick={onToggleSave} aria-label={saved ? `Alisin sa mga naka-save: ${recipe.title}` : `I-save ang ${recipe.title}`} aria-pressed={saved} whileTap={{ scale: 0.9 }} transition={{ duration: 0.12 }}>
          <motion.span key={saved ? 'saved' : 'unsaved'} initial={{ scale: 0.7, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.16 }}>{saved ? '♥' : '♡'}</motion.span>
        </motion.button>
      </div>
      <button className="recipe-card-main" type="button" onClick={onOpen}>
        <h2>{recipe.title}</h2>
        <p className="recipe-description">{recipe.description || recipe.matchReason}</p>
        <div className="recipe-metrics" aria-label="Recipe summary">
          <span>{recipe.timeMinutes} min</span>
          <span>{recipe.difficulty}</span>
          <span className="metric-price">{formatCost(recipe.estimatedCost)}</span>
          <span>{recipe.servings} serv.</span>
          {typeof recipe.matchScore === 'number' ? <span className="metric-match">{recipe.matchScore}% match</span> : null}
        </div>
        <div className="ingredient-summary" aria-label="Ingredient evidence">
          <div><strong>Meron ka na ({available.length})</strong>{available.length > 0 ? available.map((ingredient) => <span key={ingredient.id} className="chip-meron">{ingredient.name}</span>) : <span>Wala pa</span>}</div>
          <div><strong>Kulang pa ({missing.length})</strong>{missing.length > 0 ? missing.map((ingredient) => <span key={ingredient.id} className="chip-kulang">{ingredient.name}</span>) : <span>Wala</span>}</div>
        </div>
        <span className="card-action">Tingnan ang recipe <span aria-hidden="true">→</span></span>
      </button>
      {onFeedback ? <RecipeFeedback value={feedback} onChange={onFeedback} /> : null}
    </motion.article>
  )
}

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
    classic: 'Klasikong Filipino',
    'home-style': 'Lutong Bahay',
    'hapag-adaptation': 'Hapag Adaptation',
  }

  return (
    <motion.article className="recipe-card" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} transition={{ duration: 0.24, delay, ease: 'easeOut' }}>
      {recipe.imageUrl ? (
        <img className="recipe-card-image" src={recipe.imageUrl} alt={recipe.title} loading="lazy" />
      ) : (
        <div className="recipe-card-image recipe-card-image-placeholder" aria-hidden="true">
          <span className="placeholder-pattern" />
          <span className="placeholder-brand">Hapag Recipe</span>
        </div>
      )}
      <div className="recipe-card-topline">
        <div className="recipe-tags-group">
          <span className="recipe-badge">{recipe.tags[0]}</span>
          {recipe.authenticity ? <span className="recipe-authenticity-badge">{authenticityLabels[recipe.authenticity]}</span> : null}
        </div>
        <div className="recipe-topline-actions">
          {typeof recipe.matchScore === 'number' ? (
            <span className="recipe-match-pill">{recipe.matchScore}% Match</span>
          ) : null}
          <motion.button className={`save-button ${saved ? 'save-button-saved' : ''}`} type="button" onClick={onToggleSave} aria-label={saved ? `Alisin sa mga naka-save: ${recipe.title}` : `I-save ang ${recipe.title}`} aria-pressed={saved} whileTap={{ scale: 0.9 }} transition={{ duration: 0.12 }}>
            <motion.span key={saved ? 'saved' : 'unsaved'} initial={{ scale: 0.7, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.16 }}>{saved ? '♥' : '♡'}</motion.span>
          </motion.button>
        </div>
      </div>
      <button className="recipe-card-main" type="button" onClick={onOpen}>
        <h2>{recipe.title}</h2>
        <p className="recipe-match">{recipe.matchReason}</p>
        <div className="recipe-metrics" aria-label="Recipe summary">
          <span className="metric-pill">{recipe.timeMinutes} min</span>
          <span className="metric-pill">{recipe.difficulty}</span>
          <span className="metric-pill metric-price">{formatCost(recipe.estimatedCost)}</span>
          <span className="metric-pill">{recipe.servings} serv.</span>
        </div>
        <div className="ingredient-summary" aria-label="Ingredient evidence">
          <div className="ingredient-group">
            <span className="group-label meron">Meron ka na ({available.length})</span>
            <div className="group-chips">
              {available.length > 0 ? available.map((ingredient) => <span key={ingredient.id} className="chip-meron">{ingredient.name}</span>) : <span className="chip-empty">Wala pa</span>}
            </div>
          </div>
          <div className="ingredient-group">
            <span className="group-label kulang">Kulang pa ({missing.length})</span>
            <div className="group-chips">
              {missing.length > 0 ? missing.map((ingredient) => <span key={ingredient.id} className="chip-kulang">{ingredient.name}</span>) : <span className="chip-empty">Kumpleto</span>}
            </div>
          </div>
        </div>
        <span className="card-action">Tingnan ang recipe <span aria-hidden="true">→</span></span>
      </button>
      {onFeedback ? <RecipeFeedback value={feedback} onChange={onFeedback} /> : null}
    </motion.article>
  )
}

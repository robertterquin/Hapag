import { motion } from 'motion/react'
import type { Recipe } from '../types/domain.ts'
import { formatCost } from '../lib/format.ts'
import type { RecipeAuthenticity } from '../types/domain.ts'
import { RecipeFeedback } from './RecipeFeedback.tsx'
import { IngredientChip } from './IngredientChip.tsx'
import { DishImage } from './DishImage.tsx'
import { HaveProgress } from './HaveProgress.tsx'
import { getIngredientStatus } from '../lib/pantryStaples.ts'
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

const authenticityLabels: Record<RecipeAuthenticity, string> = {
  classic: 'Classic Filipino dish',
  'home-style': 'Home-style Filipino',
  'hapag-adaptation': 'Hapag adaptation',
}

export function RecipeCard({ recipe, saved, onOpen, onToggleSave, feedback, onFeedback, animationIndex = 0 }: RecipeCardProps) {
  const have = recipe.ingredients.filter((ingredient) => getIngredientStatus(ingredient) === 'have')
  const staples = recipe.ingredients.filter((ingredient) => getIngredientStatus(ingredient) === 'staple')
  const missing = recipe.ingredients.filter((ingredient) => getIngredientStatus(ingredient) === 'missing')
  const delay = Math.min(animationIndex, 5) * 0.045

  return (
    <motion.article className="recipe-card" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6, scale: 1.012 }} transition={{ duration: 0.26, delay, ease: 'easeOut' }}>
      <DishImage recipe={recipe} variant="card" />
      <div className="recipe-card-topline">
        <span className="recipe-badge">{recipe.tags[0]}</span>
        {/* Only an adaptation needs flagging; "classic" is the default and adds noise. */}
        {recipe.authenticity === 'hapag-adaptation' ? <span className="recipe-authenticity-badge">{authenticityLabels[recipe.authenticity]}</span> : null}
        <motion.button className={`save-button ${saved ? 'save-button-saved' : ''}`} type="button" onClick={onToggleSave} aria-label={saved ? `Remove from saved: ${recipe.title}` : `Save ${recipe.title}`} aria-pressed={saved} whileTap={{ scale: 0.9 }} transition={{ duration: 0.12 }}>
          <motion.span key={saved ? 'saved' : 'unsaved'} initial={{ scale: 0.7, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.16 }}>{saved ? '♥' : '♡'}</motion.span>
        </motion.button>
      </div>
      <button className="recipe-card-main" type="button" onClick={onOpen}>
        <HaveProgress have={have.length} total={have.length + missing.length} />
        <h2>{recipe.title}</h2>
        <div className="recipe-metrics" aria-label="Recipe summary">
          <span className="metric-price">{formatCost(recipe.estimatedCost)}</span>
          <span>{recipe.timeMinutes} min</span>
          <span>{recipe.difficulty}</span>
          <span>{recipe.servings} serv.</span>
        </div>
        <p className="recipe-description">{recipe.description || recipe.matchReason}</p>
        <div className="ingredient-summary" aria-label="Ingredient evidence">
          <div><strong>You have</strong>{have.length > 0 ? have.map((ingredient) => <IngredientChip key={ingredient.id} name={ingredient.name} variant="have" />) : <span className="summary-empty">None</span>}</div>
          {missing.length > 0 ? <div><strong>To buy</strong>{missing.map((ingredient) => <IngredientChip key={ingredient.id} name={ingredient.name} variant="missing" />)}</div> : null}
          {staples.length > 0 ? <div><strong>Staples</strong>{staples.map((ingredient) => <IngredientChip key={ingredient.id} name={ingredient.name} variant="staple" />)}</div> : null}
        </div>
        <span className="card-action">View recipe <span aria-hidden="true">→</span></span>
      </button>
      {onFeedback ? <RecipeFeedback value={feedback} onChange={onFeedback} /> : null}
    </motion.article>
  )
}

import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import type { Recipe } from '../types/domain.ts'
import { formatCost } from '../lib/format.ts'
import type { RecipeAuthenticity } from '../types/domain.ts'
import { IngredientChip } from './IngredientChip.tsx'
import { DishImage } from './DishImage.tsx'
import { HaveProgress } from './HaveProgress.tsx'
import { getIngredientStatus } from '../lib/pantryStaples.ts'

interface RecipeCardProps {
  recipe: Recipe
  saved: boolean
  onOpen: () => void
  onToggleSave: () => void
  animationIndex?: number
}

const authenticityLabels: Record<RecipeAuthenticity, string> = {
  classic: 'Classic Filipino dish',
  'home-style': 'Home-style Filipino',
  'hapag-adaptation': 'Hapag adaptation',
}

export function RecipeCard({ recipe, saved, onOpen, onToggleSave, animationIndex = 0 }: RecipeCardProps) {
  const have = recipe.ingredients.filter((ingredient) => getIngredientStatus(ingredient) === 'have')
  const staples = recipe.ingredients.filter((ingredient) => getIngredientStatus(ingredient) === 'staple')
  const missing = recipe.ingredients.filter((ingredient) => getIngredientStatus(ingredient) === 'missing')
  const delay = Math.min(animationIndex, 5) * 0.045

  return (
    <motion.article className="recipe-card" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6, scale: 1.012 }} transition={{ duration: 0.26, delay, ease: 'easeOut' }}>
      <DishImage recipe={recipe} variant="card" />
      <div className="recipe-card-topline">
        {/* Only an adaptation needs flagging; "classic" is the default and adds noise. */}
        <motion.button className={`save-button ${saved ? 'save-button-saved' : ''}`} type="button" onClick={onToggleSave} aria-label={saved ? `Remove from saved: ${recipe.title}` : `Save ${recipe.title}`} aria-pressed={saved} whileTap={{ scale: 0.9 }} transition={{ duration: 0.12 }}>
          <motion.span key={saved ? 'saved' : 'unsaved'} initial={{ scale: 0.7, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.16 }}><Icon icon="lucide:heart" width={18} height={18} aria-hidden="true" /></motion.span>
        </motion.button>
      </div>
      <button className="recipe-card-main" type="button" onClick={onOpen}>
        <HaveProgress have={have.length} total={have.length + missing.length} />
        <h2>{recipe.title}</h2>
        {recipe.localTitle && recipe.localTitle !== recipe.title ? <p className="recipe-card-local-title">{recipe.localTitle}</p> : null}
        <div className="recipe-metrics" aria-label="Recipe summary">
          <span className="metric-price">{formatCost(recipe.estimatedCost)}</span>
          <span>{recipe.timeMinutes} min</span>
          <span>{recipe.difficulty}</span>
          <span>{recipe.servings} serv.</span>
          {recipe.tags[0] ? <span>{recipe.tags[0].replace(/^./, (letter) => letter.toUpperCase())}</span> : null}
          {recipe.authenticity === 'hapag-adaptation' ? <span>{authenticityLabels[recipe.authenticity]}</span> : null}
        </div>
        <p className="recipe-description">{recipe.description || recipe.matchReason}</p>
        {missing.length + staples.length > 0 ? (
          <div className="ingredient-summary" aria-label="Ingredient evidence">
            {missing.length > 0 ? <div><strong>To buy</strong>{missing.map((ingredient) => <IngredientChip key={ingredient.id} name={ingredient.name} variant="missing" />)}</div> : null}
            {staples.length > 0 ? <div><strong>Staples</strong>{staples.map((ingredient) => <IngredientChip key={ingredient.id} name={ingredient.name} variant="staple" />)}</div> : null}
          </div>
        ) : null}
        <span className="card-action">View recipe <span aria-hidden="true">→</span></span>
      </button>
    </motion.article>
  )
}

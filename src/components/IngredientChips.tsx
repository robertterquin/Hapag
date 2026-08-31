import { AnimatePresence, motion } from 'motion/react'
import type { NormalizedIngredient } from '../types/domain.ts'
import { formatIngredientQuantity } from '../lib/ingredientParser.ts'

interface IngredientChipsProps {
  ingredients: NormalizedIngredient[]
  onRemove: (id: string) => void
}

export function IngredientChips({ ingredients, onRemove }: IngredientChipsProps) {
  if (ingredients.length === 0) return <p className="muted-copy">No ingredients added yet. Add at least one to get started.</p>

  return (
    <ul className="ingredient-chips" aria-label="Recognized ingredients">
      <AnimatePresence initial={false}>
        {ingredients.map((ingredient) => (
          <motion.li layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.16 }} className={`ingredient-chip ${ingredient.confidence === 'low' ? 'ingredient-chip-uncertain' : ''}`} key={ingredient.id}>
            <span>{ingredient.quantity === 1 && ingredient.unit === 'piece' ? ingredient.name : `${formatIngredientQuantity(ingredient)} ${ingredient.name}`}</span>
            {ingredient.confidence === 'low' ? <span className="chip-warning" title="Needs review">?</span> : null}
            <button type="button" onClick={() => onRemove(ingredient.id)} aria-label={`Remove ${ingredient.name}`}>×</button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}


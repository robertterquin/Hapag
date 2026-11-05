import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'motion/react'
import type { NormalizedIngredient } from '../types/domain.ts'
import { formatIngredientQuantity } from '../lib/ingredientParser.ts'
import { labelForIngredient } from '../lib/ingredientLabels.ts'
import { useDisplayLanguage } from '../app/displayLanguage.ts'

interface IngredientChipsProps {
  ingredients: NormalizedIngredient[]
  onRemove: (id: string) => void
}

export function IngredientChips({ ingredients, onRemove }: IngredientChipsProps) {
  const language = useDisplayLanguage()
  if (ingredients.length === 0) {
    return (
      <div className="empty-ingredients-tray" role="status">
        <span className="empty-pot-icon" aria-hidden="true">🍲</span>
        <strong className="empty-pot-title">Walang laman ang palayok</strong>
        <p className="empty-pot-subtitle muted-copy">Type ingredients above, or tap items from your pantry below.</p>
      </div>
    )
  }

  return (
    <ul className="ingredient-chips" aria-label="Recognized ingredients">
      <AnimatePresence initial={false}>
        {ingredients.map((ingredient) => {
          const label = labelForIngredient(ingredient, language)
          return (
          <motion.li layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.16 }} className={`ingredient-chip ${ingredient.confidence === 'low' ? 'ingredient-chip-uncertain' : ''}`} key={ingredient.id}>
            <span>{ingredient.quantity === 1 && ingredient.unit === 'piece' ? label : `${formatIngredientQuantity(ingredient)} ${label}`}</span>
            {ingredient.confidence === 'low' ? <span className="chip-warning" title="Needs review">?</span> : null}
            <button type="button" onClick={() => onRemove(ingredient.id)} aria-label={`Remove ${label}`}><Icon icon="lucide:x" width={14} height={14} aria-hidden="true" /></button>
          </motion.li>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}


import type { NormalizedIngredient } from '../types/domain.ts'
import { formatIngredientQuantity } from '../lib/ingredientParser.ts'

interface IngredientChipsProps {
  ingredients: NormalizedIngredient[]
  onRemove: (id: string) => void
}

export function IngredientChips({ ingredients, onRemove }: IngredientChipsProps) {
  if (ingredients.length === 0) {
    return <p className="muted-copy">Wala pang sangkap. Magdagdag ng kahit isa para makapagsimula.</p>
  }

  return (
    <ul className="ingredient-chips" aria-label="Mga nakilalang sangkap">
      {ingredients.map((ingredient) => (
        <li className={`ingredient-chip ${ingredient.confidence === 'low' ? 'ingredient-chip-uncertain' : ''}`} key={ingredient.id}>
          <span>{ingredient.quantity === 1 && ingredient.unit === 'piece' ? ingredient.name : `${formatIngredientQuantity(ingredient)} ${ingredient.name}`}</span>
          {ingredient.confidence === 'low' ? <span className="chip-warning" title="Kailangang suriin">?</span> : null}
          <button type="button" onClick={() => onRemove(ingredient.id)} aria-label={`Alisin ang ${ingredient.name}`}>×</button>
        </li>
      ))}
    </ul>
  )
}

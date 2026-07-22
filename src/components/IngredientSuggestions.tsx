import { commonIngredients } from '../data/ingredientSuggestions.ts'

interface IngredientSuggestionsProps {
  items?: readonly string[]
  onSelect: (ingredient: string) => void
}

export function IngredientSuggestions({ items = commonIngredients, onSelect }: IngredientSuggestionsProps) {
  return (
    <div className="ingredient-suggestions" aria-label="Common ingredient suggestions">
      <span className="suggestions-label">Try adding:</span>
      <div className="suggestion-list">
        {items.map((ingredient) => (
          <button className="suggestion-chip" key={ingredient} type="button" onClick={() => onSelect(ingredient)}>
            + {ingredient}
          </button>
        ))}
      </div>
    </div>
  )
}

import type { Recipe } from '../types/domain.ts'
import { formatCost } from '../lib/format.ts'

export function RecipeMeta({ recipe }: { recipe: Recipe }) {
  return (
    <div className="recipe-metrics recipe-metrics-large" aria-label="Recipe summary">
      <span><strong>{recipe.timeMinutes}</strong> min</span>
      <span><strong>{recipe.difficulty}</strong></span>
      <span><strong>{formatCost(recipe.estimatedCost)}</strong></span>
      <span><strong>{recipe.servings}</strong> servings</span>
    </div>
  )
}

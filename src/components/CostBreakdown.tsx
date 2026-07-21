import type { Recipe } from '../types/domain.ts'
import { formatCost } from '../lib/format.ts'

export function CostBreakdown({ recipe }: { recipe: Recipe }) {
  return <section className="cost-panel" aria-labelledby="cost-heading"><div className="section-heading-row"><div><span className="section-kicker">Budget check</span><h2 id="cost-heading">Estimated cost</h2></div><strong className="cost-total">{formatCost(recipe.estimatedCost)}</strong></div><ul className="cost-list">{recipe.costBreakdown.map((line) => <li key={line.ingredient}><span>{line.ingredient} {line.available ? <small>· meron ka</small> : <small className="missing-text">· kulang pa</small>}</span><strong>₱{line.estimatedCost}</strong></li>)}</ul><p className="cost-note">{recipe.estimatedCost.note} Tantya lang ang presyo.</p></section>
}

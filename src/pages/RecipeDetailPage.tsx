import { useState } from 'react'
import { CostBreakdown } from '../components/CostBreakdown.tsx'
import { RecipeMeta } from '../components/RecipeMeta.tsx'
import { ResultsSkeleton } from '../components/Skeletons.tsx'
import { ServingStepper } from '../components/ServingStepper.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import { formatQuantity } from '../lib/format.ts'
import { useRecipe } from '../hooks/useRecipe.ts'
import type { Recipe } from '../types/domain.ts'

export interface RecipeDetailPageProps {
  recipeId: string
  saved: boolean
  onToggleSave: () => void
  onStartCooking: () => void
  onBack: () => void
}

export function RecipeDetailPage({ recipeId, saved, onToggleSave, onStartCooking, onBack }: RecipeDetailPageProps) {
  const { recipe, status } = useRecipe(recipeId)
  const [servings, setServings] = useState(3)
  const [activeSubstitution, setActiveSubstitution] = useState<string | null>(null)

  if (status === 'loading') return <div className="page-shell"><ResultsSkeleton /></div>
  if (status === 'error' || !recipe) return <StatePanel tone="error" icon="!" title="Recipe unavailable" description="Hindi namin mabuksan ang recipe na ito ngayon." actionLabel="Back to results" onAction={onBack} />

  const scaledRecipe: Recipe = {
    ...recipe,
    servings,
    ingredients: recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: typeof ingredient.quantity === 'number' ? Math.round(ingredient.quantity * (servings / recipe.servings) * 10) / 10 : ingredient.quantity,
    })),
    estimatedCost: {
      ...recipe.estimatedCost,
      min: Math.round(recipe.estimatedCost.min * (servings / recipe.servings)),
      max: Math.round(recipe.estimatedCost.max * (servings / recipe.servings)),
    },
  }

  return (
    <div className="page-shell detail-page">
      <div className="detail-topbar">
        <button className="back-button" type="button" onClick={onBack}>← Results</button>
        <button className={`button ${saved ? 'button-saved' : 'button-secondary'}`} type="button" onClick={onToggleSave}>{saved ? '♥ Saved' : '♡ Save recipe'}</button>
      </div>
      <section className="recipe-hero">
        <span className="recipe-badge">{recipe.tags[0]}</span>
        <h1>{recipe.title}</h1>
        {recipe.localTitle ? <p className="local-title">{recipe.localTitle}</p> : null}
        <p className="detail-description">{recipe.description}</p>
        <RecipeMeta recipe={scaledRecipe} />
        <p className="match-callout"><strong>Why this fits:</strong> {recipe.matchReason}</p>
      </section>

      <div className="detail-layout">
        <div className="detail-main-column">
          <section className="detail-section" aria-labelledby="ingredients-heading">
            <div className="section-heading-row">
              <div><span className="section-kicker">What you need</span><h2 id="ingredients-heading">Ingredients</h2></div>
              <ServingStepper value={servings} onChange={setServings} />
            </div>
            <ul className="detail-ingredient-list">
              {scaledRecipe.ingredients.map((ingredient) => <li className={ingredient.available ? 'ingredient-available' : 'ingredient-missing'} key={ingredient.id}>
                <span className="ingredient-status" aria-hidden="true">{ingredient.available ? '✓' : '+'}</span>
                <span><strong>{formatQuantity(ingredient.quantity, ingredient.unit)} {ingredient.name}</strong>{ingredient.note ? <small>{ingredient.note}</small> : null}</span>
                <em>{ingredient.available ? 'Meron ka' : 'Kulang pa'}</em>
              </li>)}
            </ul>
          </section>

          <section className="detail-section" aria-labelledby="substitutions-heading">
            <div className="section-heading-row"><div><span className="section-kicker">Flexible cooking</span><h2 id="substitutions-heading">Substitutions</h2></div></div>
            <div className="substitution-list">
              {recipe.substitutions.map((substitution) => <button className={`substitution-row ${activeSubstitution === substitution.id ? 'substitution-row-active' : ''}`} type="button" key={substitution.id} onClick={() => setActiveSubstitution(activeSubstitution === substitution.id ? null : substitution.id)}>
                <span><strong>{substitution.original}</strong><span className="substitution-arrow">→</span><strong>{substitution.substitute}</strong></span>
                <small>{activeSubstitution === substitution.id ? substitution.tradeoff : 'View tradeoff'}</small>
              </button>)}
            </div>
          </section>

          <section className="detail-section" aria-labelledby="steps-heading">
            <div className="section-heading-row"><div><span className="section-kicker">Cook it</span><h2 id="steps-heading">Steps</h2></div></div>
            <ol className="step-preview-list">
              {recipe.steps.map((step) => <li key={step.id}><span>{step.order}</span><div><strong>{step.action}</strong><small>{step.durationMinutes ? `${step.durationMinutes} min` : 'As needed'}{step.heat && step.heat !== 'none' ? ` · ${step.heat} heat` : ''}</small></div></li>)}
            </ol>
          </section>
        </div>
        <aside className="detail-side-column">
          <CostBreakdown recipe={scaledRecipe} />
          <div className="safety-note"><strong>Check before cooking</strong><p>AI-generated suggestion. Verify ingredients, labels, and allergy context. Dietary labels are guidance, not medical advice.</p></div>
          <button className="button button-primary full-width" type="button" onClick={onStartCooking}>Simulan ang pagluluto</button>
        </aside>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { CostBreakdown } from '../components/CostBreakdown.tsx'
import { RecipeMeta } from '../components/RecipeMeta.tsx'
import { ResultsSkeleton } from '../components/Skeletons.tsx'
import { ServingStepper } from '../components/ServingStepper.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import { formatQuantity } from '../lib/format.ts'
import { scaleRecipe } from '../lib/recipeControls.ts'
import { useRecipe } from '../hooks/useRecipe.ts'
import type { Recipe } from '../types/domain.ts'

export interface RecipeDetailPageProps { recipeId: string; saved: boolean; onToggleSave: () => void; onStartCooking: () => void; onBack: () => void }

function formatHeatLabel(heat?: string | null): string {
  if (heat === 'low') return 'Low heat'
  if (heat === 'medium') return 'Medium heat'
  if (heat === 'high') return 'High heat'
  return ''
}

export function RecipeDetailPage({ recipeId, saved, onToggleSave, onStartCooking, onBack }: RecipeDetailPageProps) {
  const { recipe, status } = useRecipe(recipeId)
  const [selectedServings, setSelectedServings] = useState<number | null>(null)
  const [activeSubstitution, setActiveSubstitution] = useState<string | null>(null)
  if (status === 'loading') return <div className="page-shell"><ResultsSkeleton /></div>
  if (status === 'error' || !recipe) return <StatePanel tone="error" icon="!" title="Recipe not available" description="We could not load this recipe right now." actionLabel="Back to results" onAction={onBack} />
  const servings = selectedServings ?? recipe.servings
  const scaledRecipe: Recipe = scaleRecipe(recipe, servings)
  return (
    <div className="page-shell detail-page">
      <div className="detail-topbar">
        <button className="back-button" type="button" onClick={onBack}>← Back to results</button>
        <button className={`button ${saved ? 'button-saved' : 'button-secondary'}`} type="button" onClick={onToggleSave}>
          {saved ? '♥ Saved' : '♡ Save recipe'}
        </button>
      </div>
      <section className="recipe-hero">
        {recipe.imageUrl ? <img className="recipe-hero-image" src={recipe.imageUrl} alt="" /> : null}
        <div className="recipe-hero-content">
          <span className="recipe-badge">{recipe.tags[0]}</span>
          <h1>{recipe.title}</h1>
          {recipe.localTitle ? <p className="local-title">{recipe.localTitle}</p> : null}
          <p className="detail-description">{recipe.description}</p>
          <RecipeMeta recipe={scaledRecipe} />
          {recipe.matchReason ? <p className="match-callout"><strong>Why it works:</strong> {recipe.matchReason}</p> : null}
        </div>
      </section>
      <div className="detail-layout">
        <div className="detail-main-column">
          <section className="detail-section" aria-labelledby="ingredients-heading">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">Ingredients needed</span>
                <h2 id="ingredients-heading">Ingredients</h2>
              </div>
              <ServingStepper value={servings} onChange={setSelectedServings} />
            </div>
            <ul className="detail-ingredient-list">
              {scaledRecipe.ingredients.map((ingredient) => (
                <li className={ingredient.available ? 'ingredient-available' : 'ingredient-missing'} key={ingredient.id}>
                  <span className="ingredient-status" aria-hidden="true">{ingredient.available ? '✓' : '+'}</span>
                  <span>
                    <strong>{formatQuantity(ingredient.quantity, ingredient.unit)} {ingredient.name}</strong>
                    {ingredient.note ? <small>{ingredient.note}</small> : null}
                  </span>
                  <em>{ingredient.available ? 'You have' : 'Missing'}</em>
                </li>
              ))}
            </ul>
          </section>
          <section className="detail-section" aria-labelledby="substitutions-heading">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">Flexible cooking</span>
                <h2 id="substitutions-heading">Substitutions</h2>
              </div>
            </div>
            <div className="substitution-list">
              {recipe.substitutions.map((substitution) => (
                <button
                  className={`substitution-row ${activeSubstitution === substitution.id ? 'substitution-row-active' : ''}`}
                  type="button"
                  key={substitution.id}
                  onClick={() => setActiveSubstitution(activeSubstitution === substitution.id ? null : substitution.id)}
                >
                  <span>
                    <strong>{substitution.original}</strong>
                    <span className="substitution-arrow">→</span>
                    <strong>{substitution.substitute}</strong>
                  </span>
                  <small>{activeSubstitution === substitution.id ? substitution.tradeoff : 'View tradeoff'}</small>
                </button>
              ))}
            </div>
          </section>
          <section className="detail-section" aria-labelledby="steps-heading">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">Preparation</span>
                <h2 id="steps-heading">Cooking Steps</h2>
              </div>
            </div>
            <ol className="step-preview-list">
              {recipe.steps.map((step) => (
                <li key={step.id}>
                  <span>{step.order}</span>
                  <div>
                    <strong>{step.action}</strong>
                    <small>
                      {step.durationMinutes ? `${step.durationMinutes} min` : 'As needed'}
                      {step.heat && step.heat !== 'none' ? ` · ${formatHeatLabel(step.heat)}` : ''}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <aside className="detail-side-column">
          <CostBreakdown recipe={scaledRecipe} />
          <div className="safety-note">
            <strong>Check before cooking</strong>
            <p>AI-generated suggestion. Verify ingredients, labels, and allergy context. Dietary labels are a guide and not medical advice.</p>
          </div>
          <button className="button button-primary full-width" type="button" onClick={onStartCooking}>
            Start Cooking
          </button>
        </aside>
      </div>
    </div>
  )
}


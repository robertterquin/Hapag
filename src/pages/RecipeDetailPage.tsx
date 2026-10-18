import { useState } from 'react'
import { ShoppingListPanel } from '../components/ShoppingListPanel.tsx'
import { StickyActionBar } from '../components/StickyActionBar.tsx'
import { getIngredientStatus } from '../lib/pantryStaples.ts'
import { DishImage } from '../components/DishImage.tsx'
import { CostBreakdown } from '../components/CostBreakdown.tsx'
import { RecipeMeta } from '../components/RecipeMeta.tsx'
import { ResultsSkeleton } from '../components/Skeletons.tsx'
import { ServingStepper } from '../components/ServingStepper.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import { formatQuantity } from '../lib/format.ts'
import { scaleRecipe } from '../lib/recipeControls.ts'
import { useRecipe } from '../hooks/useRecipe.ts'
import type { Recipe } from '../types/domain.ts'

export interface RecipeDetailPageProps { recipeId: string; saved: boolean; onToggleSave: () => void; onStartCooking: () => void; onBack: () => void; onStartOver: () => void }

function formatHeatLabel(heat?: string | null): string {
  if (heat === 'low') return 'Low heat'
  if (heat === 'medium') return 'Medium heat'
  if (heat === 'high') return 'High heat'
  return ''
}

export function RecipeDetailPage({ recipeId, saved, onToggleSave, onStartCooking, onBack, onStartOver }: RecipeDetailPageProps) {
  const { recipe, status } = useRecipe(recipeId)
  const [selectedServings, setSelectedServings] = useState<number | null>(null)
  const [activeSubstitution, setActiveSubstitution] = useState<string | null>(null)
  if (status === 'loading') return <div className="page-shell"><ResultsSkeleton /></div>
  if (status === 'error' || !recipe) return <StatePanel tone="empty" title="We couldn't find that recipe" description="It may be from an earlier session that has ended. Your latest results or a new search will get you cooking again." actionLabel="Start over" onAction={onStartOver} secondaryLabel="Back to results" onSecondary={onBack} />
  const servings = selectedServings ?? recipe.servings
  const scaledRecipe: Recipe = scaleRecipe(recipe, servings)
  return (
    <div className="page-shell detail-page">
      <div className="detail-topbar">
        <button className="back-button" type="button" onClick={onBack}>← Back to results</button>
      </div>
      <section className="recipe-hero">
        <DishImage recipe={recipe} variant="hero" />
        <div className="recipe-hero-content">
          <span className="recipe-badge">{recipe.tags[0]}</span>
          <h1>{recipe.title}</h1>
          {recipe.localTitle ? <p className="local-title">{recipe.localTitle}</p> : null}
          <RecipeMeta recipe={scaledRecipe} />
          <p className="detail-description">{recipe.description}</p>
        </div>
      </section>
      <div className="detail-layout">
        <div className="detail-main-column">
          <div className="detail-prep">
          <section className="detail-section" aria-labelledby="ingredients-heading">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">Ingredients needed</span>
                <h2 id="ingredients-heading">Ingredients</h2>
              </div>
              <ServingStepper value={servings} onChange={setSelectedServings} />
            </div>
            <ul className="detail-ingredient-list">
              {scaledRecipe.ingredients.map((ingredient) => {
                const status = getIngredientStatus(ingredient)
                return (
                <li className={`ingredient-${status === 'have' ? 'available' : status}`} key={ingredient.id}>
                  <span className="ingredient-status" aria-hidden="true">{status === 'have' ? '✓' : status === 'staple' ? '•' : '+'}</span>
                  <span>
                    <strong>{formatQuantity(ingredient.quantity, ingredient.unit)} {ingredient.name}</strong>
                    {ingredient.note ? <small>{ingredient.note}</small> : null}
                  </span>
                  <em>{status === 'have' ? 'You have' : status === 'staple' ? 'Probably in your kusina' : 'To buy'}</em>
                </li>
                )
              })}
            </ul>
          </section>
          <ShoppingListPanel recipe={scaledRecipe} />
          </div>
          <div className="detail-method">
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
          {recipe.substitutions.length > 0 ? (
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
          ) : null}
          {recipe.matchReason ? (
            <section className="detail-section" aria-labelledby="why-heading">
              <span className="section-kicker">Why this dish</span>
              <h2 id="why-heading">Why it works</h2>
              <p className="match-callout">{recipe.matchReason}</p>
            </section>
          ) : null}
          </div>
        </div>
        <aside className="detail-side-column">
          <CostBreakdown recipe={scaledRecipe} />
          <div className="safety-note">
            <strong>Check before cooking</strong>
            <p>{recipe.source === 'ai' ? 'AI-generated suggestion. ' : ''}Verify ingredients, labels, and allergy context. Dietary labels are a guide and not medical advice.</p>
          </div>
        </aside>
      </div>
      <StickyActionBar>
        <button className={`button ${saved ? 'button-saved' : 'button-secondary'} detail-save-button`} type="button" onClick={onToggleSave} aria-pressed={saved} aria-label={saved ? 'Saved. Remove from saved' : 'Save recipe'}>
          {saved ? '♥' : '♡'}<span className="detail-save-label">{saved ? 'Saved' : 'Save'}</span>
        </button>
        <button className="button button-primary detail-cook-button" type="button" onClick={onStartCooking}>
          Start cooking <span aria-hidden="true">→</span>
        </button>
      </StickyActionBar>
    </div>
  )
}


import { IngredientAddForm } from '../components/IngredientAddForm.tsx'
import { IngredientChips } from '../components/IngredientChips.tsx'
import { KusinaShelf } from '../components/KusinaShelf.tsx'
import { ServingStepper } from '../components/ServingStepper.tsx'
import type { DiscoverySession, GenerationConstraints, IngredientDraft } from '../types/domain.ts'

export interface UlamPageProps {
  session: DiscoverySession
  onAddIngredients: (input: IngredientDraft) => void
  onReset: () => void
  onUpdateConstraints: (patch: Partial<GenerationConstraints>) => void
  onGenerate: () => void
  onRemove: (id: string) => void
}

export function UlamPage({ session, onAddIngredients, onReset, onUpdateConstraints, onGenerate, onRemove }: UlamPageProps) {
  const handleKusinaToggle = (name: string, isCurrentlyActive: boolean, existingId?: string) => {
    if (isCurrentlyActive && existingId) {
      onRemove(existingId)
    } else {
      onAddIngredients({ name })
    }
  }

  return (
    <div className="page-shell narrow-page">
      <span className="eyebrow">Ulam AI</span>
      <h1>Start with what you have.</h1>
      <p className="page-intro">Tell Hapag what ingredients you have in your kitchen, then discover authentic recipes.</p>

      <IngredientAddForm
        idPrefix="ulam-add"
        label="Add ingredients"
        helper="Add one or more ingredients separated by commas or Enter."
        submitLabel="Add"
        placeholder="e.g. 1/2 kg chicken, potatoes, garlic, soy sauce"
        onSubmit={async (input) => { onAddIngredients(input) }}
      />

      <KusinaShelf
        activeIngredients={session.ingredients}
        onToggle={handleKusinaToggle}
      />

      {session.ingredients.length > 0 ? (
        <button className="text-button ulam-reset-button" type="button" onClick={onReset}>
          Start a new list
        </button>
      ) : null}

      <section className="review-panel" aria-labelledby="review-heading">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Ingredient review</span>
            <h2 id="review-heading">Selected ingredients:</h2>
          </div>
          <span className="count-badge">{session.ingredients.length}</span>
        </div>
        <IngredientChips ingredients={session.ingredients} onRemove={onRemove} />
        {session.ingredients.some((ingredient) => ingredient.confidence === 'low') ? (
          <p className="inline-warning">Some ingredients need verification. Please check before generating ideas.</p>
        ) : null}
      </section>

      <section className="constraints-panel" aria-labelledby="constraints-heading">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Optional preferences</span>
            <h2 id="constraints-heading">Tailor to your household.</h2>
          </div>
        </div>
        <div className="constraint-grid">
          <ServingStepper value={session.constraints.servings} onChange={(value) => onUpdateConstraints({ servings: value })} />
          <label className="field-label">
            Budget limit
            <select value={session.constraints.budgetLimit ?? ''} onChange={(event) => onUpdateConstraints({ budgetLimit: event.target.value ? Number(event.target.value) : undefined })}>
              <option value="">Any budget</option>
              <option value="100">Under ₱100</option>
              <option value="200">Under ₱200</option>
            </select>
          </label>
          <label className="field-label">
            Dietary preference
            <select value={session.constraints.dietaryPreference ?? 'none'} onChange={(event) => onUpdateConstraints({ dietaryPreference: event.target.value as GenerationConstraints['dietaryPreference'] })}>
              <option value="none">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="low-sodium">Low-sodium</option>
              <option value="diabetic-friendly">Diabetic-friendly</option>
            </select>
          </label>
          <label className="field-label">
            Spice level
            <select value={session.constraints.spiceLevel} onChange={(event) => onUpdateConstraints({ spiceLevel: event.target.value as GenerationConstraints['spiceLevel'] })}>
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="hot">Spicy</option>
            </select>
          </label>
        </div>
        <div className="allergy-callout">
          <strong>Have food allergies?</strong>
          <span>Always check ingredient packaging and food labels. Hapag cannot guarantee allergen-free results.</span>
        </div>
      </section>

      <button className="button button-primary full-width" type="button" onClick={onGenerate} disabled={session.ingredients.length === 0}>
        Let's Cook!
      </button>
    </div>
  )
}


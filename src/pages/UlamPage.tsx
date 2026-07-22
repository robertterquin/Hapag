import { IngredientAddForm } from '../components/IngredientAddForm.tsx'
import { IngredientChips } from '../components/IngredientChips.tsx'
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
  return (
    <div className="page-shell narrow-page">
      <span className="eyebrow">Ulam AI</span>
      <h1>Start with what you have.</h1>
      <p className="page-intro">Tell Hapag what ingredients you have, then choose what to cook.</p>
      <IngredientAddForm idPrefix="ulam-add" label="Add ingredients" helper="Separate ingredients with commas, new lines, or ‘and’." submitLabel="Add ingredients" placeholder="e.g. garlic, shrimp, butter" onSubmit={async (input) => { onAddIngredients(input) }} />
      {session.ingredients.length > 0 ? <button className="text-button ulam-reset-button" type="button" onClick={onReset}>Magsimula ng bagong listahan</button> : null}
      <section className="review-panel" aria-labelledby="review-heading">
        <div className="section-heading-row"><div><span className="section-kicker">Ingredient review</span><h2 id="review-heading">Ito ang mga nakita ko:</h2></div><span className="count-badge">{session.ingredients.length}</span></div>
        <IngredientChips ingredients={session.ingredients} onRemove={onRemove} />
        {session.ingredients.some((ingredient) => ingredient.confidence === 'low') ? <p className="inline-warning">May sangkap na kailangang suriin. Pakisuri bago mag-generate.</p> : null}
      </section>
      <section className="constraints-panel" aria-labelledby="constraints-heading">
        <div className="section-heading-row"><div><span className="section-kicker">Optional preferences</span><h2 id="constraints-heading">Iangkop natin sa household mo.</h2></div></div>
        <div className="constraint-grid">
          <ServingStepper value={session.constraints.servings} onChange={(value) => onUpdateConstraints({ servings: value })} />
          <label className="field-label">Budget limit<select value={session.constraints.budgetLimit ?? ''} onChange={(event) => onUpdateConstraints({ budgetLimit: event.target.value ? Number(event.target.value) : undefined })}><option value="">Any budget</option><option value="100">Under ₱100</option><option value="200">Under ₱200</option></select></label>
          <label className="field-label">Dietary preference<select value={session.constraints.dietaryPreference ?? 'none'} onChange={(event) => onUpdateConstraints({ dietaryPreference: event.target.value as GenerationConstraints['dietaryPreference'] })}><option value="none">None</option><option value="vegetarian">Vegetarian</option><option value="low-sodium">Low-sodium guidance</option><option value="diabetic-friendly">Diabetic-friendly guidance</option></select></label>
          <label className="field-label">Spice level<select value={session.constraints.spiceLevel} onChange={(event) => onUpdateConstraints({ spiceLevel: event.target.value as GenerationConstraints['spiceLevel'] })}><option value="mild">Mild</option><option value="medium">Medium</option><option value="hot">Hot</option></select></label>
        </div>
        <div className="allergy-callout"><strong>May allergy ka ba?</strong><span>Palaging tingnan ang labels at mag-ingat sa cross-contact. Hindi magagarantiya ng Hapag ang kaligtasan para sa may allergy.</span></div>
      </section>
      <button className="button button-primary full-width" type="button" onClick={onGenerate} disabled={session.ingredients.length === 0}>Lutuin natin!</button>
    </div>
  )
}

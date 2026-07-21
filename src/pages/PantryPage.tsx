import { IngredientChips } from '../components/IngredientChips.tsx'
import { IngredientPrompt } from '../components/IngredientPrompt.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import type { NormalizedIngredient } from '../types/domain.ts'

export interface PantryPageProps {
  pantryItems: NormalizedIngredient[]
  onAdd: (value: string) => void
  onRemove: (id: string) => void
  onGenerate: () => void
}

export function PantryPage({ pantryItems, onAdd, onRemove, onGenerate }: PantryPageProps) {
  return (
    <div className="page-shell narrow-page">
      <span className="eyebrow">Pantry · static preview</span>
      <h1>Your ingredients, ready for the next idea.</h1>
      <p className="page-intro">Add a few ingredients and Hapag can turn your pantry into a new cooking starting point.</p>
      <IngredientPrompt compact onSubmit={onAdd} />
      <section className="pantry-panel" aria-labelledby="pantry-heading">
        <div className="section-heading-row"><div><span className="section-kicker">Available ingredients</span><h2 id="pantry-heading">{pantryItems.length} in your pantry</h2></div></div>
        {pantryItems.length > 0 ? <IngredientChips ingredients={pantryItems} onRemove={onRemove} /> : <StatePanel title="Wala pang laman ang Pantry" description="Magdagdag ng ingredients para makabuo ng pantry-based recipe ideas." />}
        <button className="button button-primary full-width" type="button" disabled={pantryItems.length === 0} onClick={onGenerate}>Generate from Pantry</button>
      </section>
    </div>
  )
}

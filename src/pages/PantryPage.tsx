import { IngredientAddForm } from '../components/IngredientAddForm.tsx'
import { PantryItemEditor } from '../components/PantryItemEditor.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import type { IngredientDraft, NormalizedIngredient, PantryUnit } from '../types/domain.ts'

export interface PantryPageProps {
  isAuthenticated: boolean
  status: string
  error: string | null
  pantryItems: NormalizedIngredient[]
  onAdd: (input: IngredientDraft) => Promise<void>
  onUpdate: (input: { id: string; name: string; quantity: number; unit: PantryUnit }) => Promise<void>
  onRemove: (id: string) => Promise<void>
  onUseInUlam: () => void
  onSignIn: () => void
  onRetry: () => void
}

export function PantryPage({ isAuthenticated, status, error, pantryItems, onAdd, onUpdate, onRemove, onUseInUlam, onSignIn, onRetry }: PantryPageProps) {
  const isLoading = status === 'idle' || status === 'loading'

  return (
    <div className="page-shell narrow-page">
      <span className="eyebrow">Pantry · {isAuthenticated ? 'synced' : 'local preview'}</span>
      <h1>Your ingredients, ready for the next idea.</h1>
      <p className="page-intro">Keep track of what is available at home, then use it as a starting point for Ulam AI.</p>
      {!isAuthenticated ? <div className="session-note">Sign in to sync your pantry across devices. You can still try it locally.</div> : null}
      {error ? <div className="error-banner" role="alert"><strong>Pantry could not update.</strong> {error} <button className="text-button" type="button" onClick={onRetry}>Try again</button></div> : null}

      <IngredientAddForm idPrefix="pantry-add" label="Add an ingredient to your pantry" helper="Add one item at a time. You can edit it below anytime." submitLabel="Add to pantry" placeholder="e.g. sardines" onSubmit={onAdd} />

      <section className="pantry-panel" aria-labelledby="pantry-heading">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Available ingredients</span>
            <h2 id="pantry-heading">{pantryItems.length} in your pantry</h2>
          </div>
        </div>

        {isLoading ? <p className="muted-copy">Loading your pantry…</p> : status === 'error' ? <StatePanel tone="error" title="Unable to load your pantry" description="Check your Supabase permissions, then try again." actionLabel="Try again" onAction={onRetry} /> : pantryItems.length > 0 ? <ul className="pantry-item-list" aria-label="Pantry ingredients">{pantryItems.map((item) => <PantryItemEditor key={`${item.id}-${item.name}-${item.quantity}-${item.unit}`} item={item} onUpdate={onUpdate} onRemove={onRemove} />)}</ul> : <StatePanel title="Wala pang laman ang Pantry" description="Add ingredients above to build your pantry and use it for recipe ideas." actionLabel={!isAuthenticated ? 'Sign in to sync' : undefined} onAction={!isAuthenticated ? onSignIn : undefined} />}

        {pantryItems.length > 0 ? <button className="button button-primary full-width" type="button" onClick={onUseInUlam}>Use pantry in Ulam AI</button> : null}
      </section>
    </div>
  )
}

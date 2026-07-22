import { IngredientAddForm } from '../components/IngredientAddForm.tsx'
import { PantryItemEditor } from '../components/PantryItemEditor.tsx'
import { StatePanel } from '../components/StatePanel.tsx'
import type { IngredientDraft, NormalizedIngredient } from '../types/domain.ts'

export interface PantryPageProps {
  isAuthenticated: boolean
  status: string
  error: string | null
  pantryItems: NormalizedIngredient[]
  onAdd: (input: IngredientDraft) => Promise<void>
  onUpdate: (input: { id: string; name: string }) => Promise<void>
  onRemove: (id: string) => Promise<void>
  onUseInUlam: () => void
  onSignIn: () => void
  onRetry: () => void
}

export function PantryPage({ isAuthenticated, status, error, pantryItems, onAdd, onUpdate, onRemove, onUseInUlam, onSignIn, onRetry }: PantryPageProps) {
  const isLoading = status === 'idle' || status === 'loading'

  return (
    <div className="page-shell narrow-page">
      <span className="eyebrow">My Ingredients · {isAuthenticated ? 'synced' : 'local preview'}</span>
      <h1>Start with what you already have.</h1>
      <p className="page-intro">Save the ingredients you usually have at home, then use them as a starting point for Ulam AI.</p>
      {!isAuthenticated ? <div className="session-note">Sign in to sync My Ingredients across devices. You can still try it locally.</div> : null}
      {error ? <div className="error-banner" role="alert"><strong>My Ingredients could not update.</strong> {error} <button className="text-button" type="button" onClick={onRetry}>Try again</button></div> : null}

      <IngredientAddForm idPrefix="pantry-add" label="Add an ingredient" helper="Add one ingredient at a time. You can edit it below anytime." submitLabel="Add ingredient" placeholder="e.g. sardines" onSubmit={onAdd} />

      <section className="pantry-panel" aria-labelledby="pantry-heading">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Saved ingredients</span>
            <h2 id="pantry-heading">{pantryItems.length} saved</h2>
          </div>
        </div>

        {isLoading ? <p className="muted-copy">Loading My Ingredients…</p> : status === 'error' ? <StatePanel tone="error" title="Unable to load My Ingredients" description="Check your Supabase permissions, then try again." actionLabel="Try again" onAction={onRetry} /> : pantryItems.length > 0 ? <ul className="pantry-item-list" aria-label="Saved ingredients">{pantryItems.map((item) => <PantryItemEditor key={`${item.id}-${item.name}`} item={item} onUpdate={onUpdate} onRemove={onRemove} />)}</ul> : <StatePanel title="Wala pang saved ingredients" description="Add ingredients above to build your list and use it for recipe ideas." actionLabel={!isAuthenticated ? 'Sign in to sync' : undefined} onAction={!isAuthenticated ? onSignIn : undefined} />}

        {pantryItems.length > 0 ? <button className="button button-primary full-width" type="button" onClick={onUseInUlam}>Use My Ingredients in Ulam AI</button> : null}
      </section>
    </div>
  )
}

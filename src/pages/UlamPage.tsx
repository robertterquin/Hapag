import { Icon } from '@iconify/react'
import { IngredientAddForm } from '../components/IngredientAddForm.tsx'
import { IngredientChips } from '../components/IngredientChips.tsx'
import { KusinaShelf } from '../components/KusinaShelf.tsx'
import { PantryStaplesCard } from '../components/PantryStaplesCard.tsx'
import { StickyActionBar } from '../components/StickyActionBar.tsx'
import { UlamPreferences } from '../components/UlamPreferences.tsx'
import type { DiscoverySession, GenerationConstraints, IngredientDraft } from '../types/domain.ts'

export interface UlamPageProps {
  session: DiscoverySession
  notice: string | null
  staples: readonly string[]
  staplesError: string | null
  onAddIngredients: (input: IngredientDraft) => void
  onReset: () => void
  onUpdateConstraints: (patch: Partial<GenerationConstraints>) => void
  onGenerate: () => void
  onRemove: (id: string) => void
  onToggleStaple: (canonicalName: string) => void
  onSurprise: () => void
}

export function UlamPage({ session, notice, staples, staplesError, onAddIngredients, onReset, onUpdateConstraints, onGenerate, onRemove, onToggleStaple, onSurprise }: UlamPageProps) {
  const ingredientCount = session.ingredients.length

  const handleKusinaToggle = (name: string, isCurrentlyActive: boolean, existingId?: string) => {
    if (isCurrentlyActive && existingId) {
      onRemove(existingId)
    } else {
      onAddIngredients({ name })
    }
  }

  return (
    <div className="page-shell narrow-page ulam-page">
      <span className="eyebrow">Ulam AI</span>
      <h1>Start with what you have.</h1>
      <p className="page-intro">Add what's in your kitchen, then we'll find Filipino dishes you can cook.</p>

      {notice ? (
        <p className="discovery-notice" role="status">
          <Icon icon="lucide:sparkles" width={16} height={16} aria-hidden="true" />
          <span>{notice}</span>
        </p>
      ) : null}

      <IngredientAddForm
        idPrefix="ulam-add"
        label="Add ingredients"
        helper="Separate several with commas."
        submitLabel="Add"
        placeholder="e.g. 1/2 kg manok, patatas, bawang"
        onSubmit={async (input) => { onAddIngredients(input) }}
      />

      <section className="review-panel selected-panel" aria-labelledby="review-heading">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Your list</span>
            <h2 id="review-heading">Selected ingredients</h2>
          </div>
          <span className="count-badge" aria-label={`${ingredientCount} ingredients`}>{ingredientCount}</span>
        </div>
        <IngredientChips ingredients={session.ingredients} onRemove={onRemove} />
        {session.ingredients.some((ingredient) => ingredient.confidence === 'low') ? (
          <p className="inline-warning">Some ingredients need checking. Hapag didn't recognize the ones marked with "?".</p>
        ) : null}
        <div className="selected-panel-actions">
          {ingredientCount > 0 ? (
            <button className="text-button" type="button" onClick={onReset}>Start a new list</button>
          ) : (
            <button className="text-button" type="button" onClick={onSurprise}>
              <Icon icon="lucide:dices" width={16} height={16} aria-hidden="true" /> Surprise me!
            </button>
          )}
        </div>
      </section>

      <PantryStaplesCard
        staples={staples}
        currentCanonicalNames={session.ingredients.map((ingredient) => ingredient.canonicalName)}
        error={staplesError}
        onAddStaples={(canonicalNames) => onAddIngredients({ name: canonicalNames.join(', ') })}
        onToggleStaple={onToggleStaple}
      />

      <KusinaShelf
        activeIngredients={session.ingredients}
        onToggle={handleKusinaToggle}
      />

      <UlamPreferences constraints={session.constraints} onUpdate={onUpdateConstraints} />

      <StickyActionBar summary={ingredientCount === 0 ? 'Add an ingredient to start' : `${ingredientCount} sangkap ready`}>
        <button className="button button-primary" type="button" onClick={onGenerate} disabled={ingredientCount === 0}>
          Let's Cook! <span aria-hidden="true">→</span>
        </button>
      </StickyActionBar>
    </div>
  )
}

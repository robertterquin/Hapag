import { Icon } from '@iconify/react'
import { IngredientAddForm } from '../components/IngredientAddForm.tsx'
import { IngredientChips } from '../components/IngredientChips.tsx'
import { KusinaShelf } from '../components/KusinaShelf.tsx'
import { PantryStaplesCard } from '../components/PantryStaplesCard.tsx'
import { StickyActionBar } from '../components/StickyActionBar.tsx'
import { UlamPreferences } from '../components/UlamPreferences.tsx'
import { formatTagalogSangkap } from '../lib/format.ts'
import type { DiscoverySession, GenerationConstraints, IngredientDraft } from '../types/domain.ts'

export interface UlamPageProps {
  session: DiscoverySession
  notice: string | null
  staples: readonly string[]
  staplesError: string | null
  onAddIngredients: (input: IngredientDraft) => void
  onReset: () => void
  onUpdateConstraints: (patch: Partial<GenerationConstraints>) => void
  onPreferencesClosed?: (constraints: GenerationConstraints) => void
  onGenerate: () => void
  onRemove: (id: string) => void
  onToggleStaple: (canonicalName: string) => void
  onSurprise: () => void
}

export function UlamPage({ session, notice, staples, staplesError, onAddIngredients, onReset, onUpdateConstraints, onGenerate, onRemove, onToggleStaple, onSurprise, onPreferencesClosed }: UlamPageProps) {
  const ingredientCount = session.ingredients.length

  const handleKusinaToggle = (name: string, isCurrentlyActive: boolean, existingId?: string) => {
    if (isCurrentlyActive && existingId) {
      onRemove(existingId)
    } else {
      onAddIngredients({ name })
    }
  }

  return (
    <div className="page-shell ulam-page">
      <h1>Start with what you have.</h1>

      {notice ? (
        <p className="discovery-notice" role="status">
          <Icon icon="lucide:sparkles" width={16} height={16} aria-hidden="true" />
          <span>{notice}</span>
        </p>
      ) : null}

      {/* Phones: both groups dissolve (display: contents) and `order` restores the 18.2 order: input, list,
          staples, pantry, preferences, Cook bar. Desktop: pantry work on the left; the list, preferences,
          and Cook button stay pinned on the right. */}
      <div className="ulam-layout">
        <div className="ulam-main">
          <div className="ulam-order-input">
            <IngredientAddForm
              idPrefix="ulam-add"
              label="Add ingredients"
              helper=""
              submitLabel="Add"
              placeholder="e.g. 1/2 kg manok, patatas, bawang"
              onSubmit={async (input) => { onAddIngredients(input) }}
            />
          </div>
          <div className="ulam-order-staples">
            <PantryStaplesCard
              staples={staples}
              currentCanonicalNames={session.ingredients.map((ingredient) => ingredient.canonicalName)}
              error={staplesError}
              onAddStaples={(canonicalNames) => onAddIngredients({ name: canonicalNames.join(', ') })}
              onToggleStaple={onToggleStaple}
            />
          </div>
          <div className="ulam-order-pantry">
            <KusinaShelf activeIngredients={session.ingredients} onToggle={handleKusinaToggle} />
          </div>
        </div>

        <aside className="ulam-side" aria-label="Your list and preferences">
          <section className="review-panel selected-panel ulam-order-selected" aria-labelledby="review-heading">
            <div className="section-heading-row">
              <h2 id="review-heading">
                Your ingredients
                {ingredientCount > 0 ? <span className="count-badge" aria-label={`${ingredientCount} ingredients`}>{ingredientCount}</span> : null}
              </h2>
              {ingredientCount > 0 ? (
                <button className="text-button" type="button" onClick={onReset}>Clear list</button>
              ) : (
                <button className="text-button" type="button" onClick={onSurprise}>
                  <Icon icon="lucide:dices" width={16} height={16} aria-hidden="true" /> Surprise me!
                </button>
              )}
            </div>
            <IngredientChips ingredients={session.ingredients} onRemove={onRemove} />
            {session.ingredients.some((ingredient) => ingredient.confidence === 'low') ? (
              <p className="inline-warning">Some ingredients need checking. Hapag didn't recognize the ones marked with "?".</p>
            ) : null}
          </section>
          <div className="ulam-order-prefs">
            <UlamPreferences constraints={session.constraints} onUpdate={onUpdateConstraints} onClosed={onPreferencesClosed} />
          </div>
          {/* display: contents, so the sticky bar's scroll container is the whole page on phones. */}
          <div className="ulam-order-cook">
            <StickyActionBar
              active={ingredientCount > 0}
              summary={
                ingredientCount === 0 ? (
                  <span className="sticky-summary-empty">
                    <span className="sticky-summary-dot" aria-hidden="true" />
                    <span>Add an ingredient to start</span>
                  </span>
                ) : (
                  <span className="sticky-summary-active">
                    <span className="sticky-count-pill" aria-hidden="true">{ingredientCount}</span>
                    <span>{ingredientCount === 1 ? 'Isang sangkap ang handa' : `${formatTagalogSangkap(ingredientCount, true)} ang handa`}</span>
                  </span>
                )
              }
            >
              <button className="button button-primary" type="button" onClick={onGenerate} disabled={ingredientCount === 0}>
                Let's cook <span aria-hidden="true">→</span>
              </button>
            </StickyActionBar>
          </div>
        </aside>
      </div>
    </div>
  )
}

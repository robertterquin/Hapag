import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useDisplayLanguage } from '../app/displayLanguage.ts'
import { labelForName } from '../lib/ingredientLabels.ts'
import { stapleCandidates, staplesToAdd } from '../lib/pantryStaples.ts'
import { BottomSheet } from './BottomSheet.tsx'

interface PantryStaplesCardProps {
  staples: readonly string[]
  currentCanonicalNames: readonly string[]
  error: string | null
  onAddStaples: (canonicalNames: string[]) => void
  onToggleStaple: (canonicalName: string) => void
}

export function PantryStaplesCard({ staples, currentCanonicalNames, error, onAddStaples, onToggleStaple }: PantryStaplesCardProps) {
  const language = useDisplayLanguage()
  const [editing, setEditing] = useState(false)
  const missing = staplesToAdd(staples, currentCanonicalNames)
  const allAdded = staples.length > 0 && missing.length === 0

  return (
    <section className="staples-card" aria-labelledby="staples-heading">
      <div className="staples-header">
        <div>
          <span className="section-kicker">Always in your kusina</span>
          <h2 id="staples-heading">My staples</h2>
        </div>
        <button className="text-button" type="button" aria-haspopup="dialog" onClick={(event) => { event.currentTarget.focus(); setEditing(true) }}>
          <Icon icon="lucide:pencil" width={14} height={14} aria-hidden="true" /> Edit
        </button>
      </div>

      {staples.length === 0 ? (
        <p className="muted-copy">No staples yet. Tap Edit to pick what you always have.</p>
      ) : (
        <p className="staples-list">{staples.map((item) => labelForName(item, language)).join(' · ')}</p>
      )}

      <button
        className={`button ${allAdded ? 'button-saved' : 'button-secondary'} full-width`}
        type="button"
        disabled={missing.length === 0}
        onClick={() => onAddStaples(missing)}
      >
        {allAdded ? <><Icon icon="lucide:check" width={16} height={16} aria-hidden="true" /> Staples added</> : `Add my staples (${missing.length})`}
      </button>
      {error ? <p className="inline-warning" role="alert">{error}</p> : null}

      <BottomSheet
        open={editing}
        title="My staples"
        onClose={() => setEditing(false)}
        footer={<button className="button button-primary full-width" type="button" onClick={() => setEditing(false)}>Done</button>}
      >
        <p className="muted-copy">Pick what you almost always have. We'll remember them for next time.</p>
        <div className="staples-picker">
          {stapleCandidates.map((item) => {
            const selected = staples.includes(item)
            return (
              <button
                key={item}
                className={`shelf-item-chip ${selected ? 'item-active' : 'item-inactive'}`}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggleStaple(item)}
              >
                <span className="chip-indicator" aria-hidden="true">
                  <Icon icon={selected ? 'lucide:check' : 'lucide:plus'} width={12} height={12} />
                </span>
                <span className="item-name">{labelForName(item, language)}</span>
              </button>
            )
          })}
        </div>
      </BottomSheet>
    </section>
  )
}

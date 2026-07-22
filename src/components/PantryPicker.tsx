import { useState } from 'react'
import type { NormalizedIngredient } from '../types/domain.ts'

interface PantryPickerProps {
  items: NormalizedIngredient[]
  initialSelectedIds: string[]
  expanded: boolean
  onToggleExpanded: () => void
  onApply: (items: NormalizedIngredient[]) => void
}

export function PantryPicker({ items, initialSelectedIds, expanded, onToggleExpanded, onApply }: PantryPickerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds)

  const toggleItem = (item: NormalizedIngredient) => {
    setSelectedIds((ids) => ids.includes(item.id) ? ids.filter((id) => id !== item.id) : [...ids, item.id])
  }

  const applySelection = () => {
    onApply(items.filter((item) => selectedIds.includes(item.id)).map((item) => ({
      ...item,
      quantity: 1,
      unit: 'piece',
      source: 'pantry',
    })))
  }

  return (
    <section className="pantry-picker" aria-labelledby="pantry-picker-heading">
      <div className="pantry-picker-header">
        <div>
          <span className="section-kicker">My ingredients</span>
          <h2 id="pantry-picker-heading">Choose what to use</h2>
          <p className="muted-copy">Select the ingredients you have available. You can add other ingredients just for this recipe.</p>
        </div>
        <button className="button button-secondary pantry-picker-toggle" type="button" aria-expanded={expanded} onClick={onToggleExpanded}>{expanded ? 'Hide ingredients' : 'Show ingredients'}</button>
      </div>
      {expanded ? <>
        {items.length === 0 ? <p className="muted-copy">You have no saved ingredients yet. Add some from My Ingredients first.</p> : <ul className="pantry-picker-list">{items.map((item) => {
          const selected = selectedIds.includes(item.id)
          return <li className={`pantry-picker-row ${selected ? 'pantry-picker-row-selected' : ''}`} key={item.id}>
            <label className="pantry-picker-choice">
              <input type="checkbox" checked={selected} onChange={() => toggleItem(item)} />
              <span><strong>{item.name}</strong><small>{selected ? 'Available to use' : 'Not selected'}</small></span>
            </label>
          </li>
        })}</ul>}
        <button className="button button-primary full-width" type="button" disabled={items.length === 0} onClick={applySelection}>Use selected ingredients</button>
      </> : null}
    </section>
  )
}

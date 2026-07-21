import { useState } from 'react'
import { formatPantryQuantity } from '../lib/ingredientParser.ts'
import type { NormalizedIngredient } from '../types/domain.ts'

interface PantryPickerProps {
  items: NormalizedIngredient[]
  initialSelectedIds: string[]
  initialQuantities: Record<string, number>
  expanded: boolean
  onToggleExpanded: () => void
  onApply: (items: NormalizedIngredient[]) => void
}

export function PantryPicker({ items, initialSelectedIds, initialQuantities, expanded, onToggleExpanded, onApply }: PantryPickerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds)
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities)
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>(() => Object.fromEntries(Object.entries(initialQuantities).map(([id, quantity]) => [id, String(quantity)])))
  const [quantityErrors, setQuantityErrors] = useState<Record<string, string>>({})
  const [quantityNotices, setQuantityNotices] = useState<Record<string, string>>({})

  const toggleItem = (item: NormalizedIngredient) => {
    if (selectedIds.includes(item.id)) {
      setSelectedIds((ids) => ids.filter((id) => id !== item.id))
      return
    }
    setSelectedIds((ids) => [...ids, item.id])
    setQuantities((current) => ({ ...current, [item.id]: current[item.id] ?? item.quantity }))
    setQuantityDrafts((current) => ({ ...current, [item.id]: current[item.id] ?? String(item.quantity) }))
  }

  const updateQuantity = (item: NormalizedIngredient, value: string) => {
    setQuantityDrafts((current) => ({ ...current, [item.id]: value }))
    setQuantityErrors((current) => { const next = { ...current }; delete next[item.id]; return next })
    setQuantityNotices((current) => { const next = { ...current }; delete next[item.id]; return next })
  }

  const commitQuantity = (item: NormalizedIngredient) => {
    const parsed = Number(quantityDrafts[item.id])
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setQuantityErrors((current) => ({ ...current, [item.id]: 'Enter an amount greater than zero.' }))
      return
    }
    if (parsed > item.quantity) {
      setQuantities((current) => ({ ...current, [item.id]: item.quantity }))
      setQuantityDrafts((current) => ({ ...current, [item.id]: String(item.quantity) }))
      setQuantityErrors((current) => { const next = { ...current }; delete next[item.id]; return next })
      setQuantityNotices((current) => ({ ...current, [item.id]: `Capped at ${formatPantryQuantity(item)} available.` }))
      return
    }
    setQuantities((current) => ({ ...current, [item.id]: parsed }))
    setQuantityErrors((current) => { const next = { ...current }; delete next[item.id]; return next })
    setQuantityNotices((current) => { const next = { ...current }; delete next[item.id]; return next })
  }

  const applySelection = () => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id))
    const nextQuantities = { ...quantities }
    const nextDrafts = { ...quantityDrafts }
    const nextErrors = { ...quantityErrors }
    const nextNotices = { ...quantityNotices }
    let hasInvalidQuantity = false

    for (const item of selectedItems) {
      const parsed = Number(quantityDrafts[item.id])
      if (!Number.isFinite(parsed) || parsed <= 0) {
        nextErrors[item.id] = 'Enter an amount greater than zero.'
        hasInvalidQuantity = true
        continue
      }
      delete nextErrors[item.id]
      if (parsed > item.quantity) {
        nextQuantities[item.id] = item.quantity
        nextDrafts[item.id] = String(item.quantity)
        nextNotices[item.id] = `Capped at ${formatPantryQuantity(item)} available.`
      } else {
        nextQuantities[item.id] = parsed
        delete nextNotices[item.id]
      }
    }

    setQuantities(nextQuantities)
    setQuantityDrafts(nextDrafts)
    setQuantityErrors(nextErrors)
    setQuantityNotices(nextNotices)
    if (hasInvalidQuantity) return

    onApply(selectedItems.map((item) => ({
      ...item,
      quantity: nextQuantities[item.id] ?? item.quantity,
      source: 'pantry',
    })))
  }

  return (
    <section className="pantry-picker" aria-labelledby="pantry-picker-heading">
      <div className="pantry-picker-header">
        <div>
          <span className="section-kicker">From your pantry</span>
          <h2 id="pantry-picker-heading">Choose what to use</h2>
          <p className="muted-copy">Select ingredients and set the amount for this recipe. Your Pantry stock will not change.</p>
        </div>
        <button className="button button-secondary pantry-picker-toggle" type="button" aria-expanded={expanded} onClick={onToggleExpanded}>{expanded ? 'Hide pantry' : 'Show pantry'}</button>
      </div>
      {expanded ? <>
        {items.length === 0 ? <p className="muted-copy">Your Pantry is empty. Add items from the Pantry page first.</p> : <ul className="pantry-picker-list">{items.map((item) => {
          const selected = selectedIds.includes(item.id)
          return <li className={`pantry-picker-row ${selected ? 'pantry-picker-row-selected' : ''}`} key={item.id}>
            <label className="pantry-picker-choice">
              <input type="checkbox" checked={selected} onChange={() => toggleItem(item)} />
              <span><strong>{item.name}</strong><small>Available: {formatPantryQuantity(item)}</small></span>
            </label>
            {selected ? <label className="pantry-picker-quantity">Use
              <input type="number" min="0.01" max={item.quantity} step="any" inputMode="decimal" value={quantityDrafts[item.id] ?? String(quantities[item.id] ?? item.quantity)} onChange={(event) => updateQuantity(item, event.target.value)} onBlur={() => commitQuantity(item)} aria-invalid={Boolean(quantityErrors[item.id])} aria-describedby={quantityErrors[item.id] || quantityNotices[item.id] ? `pantry-picker-message-${item.id}` : undefined} />
              {quantityErrors[item.id] || quantityNotices[item.id] ? <small id={`pantry-picker-message-${item.id}`} className={quantityErrors[item.id] ? 'pantry-picker-field-error' : 'pantry-picker-field-notice'}>{quantityErrors[item.id] ?? quantityNotices[item.id]}</small> : null}
            </label> : null}
          </li>
        })}</ul>}
        <button className="button button-primary full-width" type="button" disabled={items.length === 0 && selectedIds.length === 0} onClick={applySelection}>Add selected pantry ingredients</button>
      </> : null}
    </section>
  )
}

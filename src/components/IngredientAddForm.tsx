import { useState, type FormEvent } from 'react'
import { pantryUnitLabels, pantryUnits } from '../lib/ingredientParser.ts'
import type { IngredientDraft, PantryUnit } from '../types/domain.ts'

interface IngredientAddFormProps {
  idPrefix: string
  label: string
  helper?: string
  submitLabel: string
  placeholder?: string
  onSubmit: (input: IngredientDraft) => Promise<void>
}

export function IngredientAddForm({ idPrefix, label, helper = 'Add one ingredient at a time.', submitLabel, placeholder = 'e.g. sardines', onSubmit }: IngredientAddFormProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState<PantryUnit>('piece')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const numericQuantity = Number(quantity)
    if (!name.trim() || !Number.isFinite(numericQuantity) || numericQuantity <= 0) return
    setBusy(true)
    try {
      await onSubmit({ name: name.trim(), quantity: numericQuantity, unit })
      setName('')
      setQuantity('1')
      setUnit('piece')
    } catch {
      // The parent hook exposes the actionable error; keep the form values for correction.
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="ingredient-add-form" onSubmit={(event) => void submit(event)}>
      <label className="field-label" htmlFor={`${idPrefix}-name`}>{label}
        <input id={`${idPrefix}-name`} value={name} onChange={(event) => setName(event.target.value)} placeholder={placeholder} required />
      </label>
      <div className="ingredient-add-fields">
        <label className="field-label" htmlFor={`${idPrefix}-quantity`}>Quantity
          <input id={`${idPrefix}-quantity`} type="number" min="0.01" step="0.01" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
        </label>
        <label className="field-label" htmlFor={`${idPrefix}-unit`}>Unit
          <select id={`${idPrefix}-unit`} value={unit} onChange={(event) => setUnit(event.target.value as PantryUnit)}>
            {pantryUnits.map((option) => <option value={option} key={option}>{pantryUnitLabels[option]}</option>)}
          </select>
        </label>
      </div>
      <div className="ingredient-add-footer">
        <span className="prompt-helper">{helper}</span>
        <button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Adding…' : submitLabel}</button>
      </div>
    </form>
  )
}

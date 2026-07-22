import { useState, type FormEvent } from 'react'
import type { IngredientDraft } from '../types/domain.ts'
import { IngredientSuggestions } from './IngredientSuggestions.tsx'

interface IngredientAddFormProps {
  idPrefix: string
  label: string
  helper?: string
  submitLabel: string
  placeholder?: string
  onSubmit: (input: IngredientDraft) => Promise<void>
  suggestions?: readonly string[]
  onSuggestionSelect?: (ingredient: string) => void
}

export function IngredientAddForm({ idPrefix, label, helper = 'Add ingredients one at a time.', submitLabel, placeholder = 'e.g. sardines', onSubmit, suggestions, onSuggestionSelect }: IngredientAddFormProps) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    try {
      await onSubmit({ name: name.trim() })
      setName('')
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
      <div className="ingredient-add-footer">
        <span className="prompt-helper">{helper}</span>
        <button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Idinadagdag…' : submitLabel}</button>
      </div>
      {suggestions ? <IngredientSuggestions items={suggestions} onSelect={(ingredient) => onSuggestionSelect ? onSuggestionSelect(ingredient) : setName(ingredient.toLowerCase())} /> : null}
    </form>
  )
}

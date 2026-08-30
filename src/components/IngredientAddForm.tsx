import { useState, useRef, type FormEvent } from 'react'
import type { IngredientDraft } from '../types/domain.ts'
import { IngredientSuggestions } from './IngredientSuggestions.tsx'
import { IngredientAutocomplete } from './IngredientAutocomplete.tsx'

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
  const [autocompleteVisible, setAutocompleteVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentToken = name.includes(',') ? name.split(',').pop()?.trim() || '' : name.trim()

  const handleSelectSuggestion = (alias: string) => {
    if (name.includes(',')) {
      const parts = name.split(',')
      parts[parts.length - 1] = ` ${alias}`
      setName(parts.join(','))
    } else {
      setName(alias)
    }
    setAutocompleteVisible(false)
    inputRef.current?.focus()
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    setAutocompleteVisible(false)
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
        <div className="input-with-autocomplete">
          <input
            ref={inputRef}
            id={`${idPrefix}-name`}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setAutocompleteVisible(true)
            }}
            onFocus={() => {
              if (name.trim()) setAutocompleteVisible(true)
            }}
            placeholder={placeholder}
            autoComplete="off"
            required
          />
          <IngredientAutocomplete
            query={currentToken}
            visible={autocompleteVisible}
            onSelect={handleSelectSuggestion}
            onClose={() => setAutocompleteVisible(false)}
          />
        </div>
      </label>
      <div className="ingredient-add-footer">
        <span className="prompt-helper">{helper}</span>
        <button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Idinadagdag…' : submitLabel}</button>
      </div>
      {suggestions ? <IngredientSuggestions items={suggestions} onSelect={(ingredient) => onSuggestionSelect ? onSuggestionSelect(ingredient) : setName(ingredient.toLowerCase())} /> : null}
    </form>
  )
}


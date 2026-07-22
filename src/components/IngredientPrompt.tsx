import { useState } from 'react'
import { IngredientSuggestions } from './IngredientSuggestions.tsx'

interface IngredientPromptProps {
  initialValue?: string
  label?: string
  placeholder?: string
  submitLabel?: string
  onSubmit: (value: string) => void | Promise<void>
  suggestions?: readonly string[]
  compact?: boolean
}

export function IngredientPrompt({ initialValue = '', label = 'Anong sangkap ang meron ka?', placeholder = 'Halimbawa: itlog, kamatis, sardinas…', submitLabel = 'Lutuin natin!', onSubmit, suggestions, compact = false }: IngredientPromptProps) {
  const [value, setValue] = useState(initialValue)
  const isValid = value.trim().length > 0

  return (
    <form
      className={`ingredient-prompt ${compact ? 'ingredient-prompt-compact' : ''}`}
      onSubmit={(event) => {
        event.preventDefault()
        if (isValid) onSubmit(value.trim())
      }}
    >
      <label htmlFor="ingredient-input">{label}</label>
      <textarea
        id="ingredient-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
      />
      {suggestions ? <IngredientSuggestions items={suggestions} onSelect={(ingredient) => setValue((current) => current.trim() ? `${current.trim()}, ${ingredient.toLowerCase()}` : ingredient.toLowerCase())} /> : null}
      <div className="prompt-footer">
        <span className="prompt-helper">Okay lang ang English, Tagalog, o Taglish.</span>
        <button className="button button-primary" type="submit" disabled={!isValid}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

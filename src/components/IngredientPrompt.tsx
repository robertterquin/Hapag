import { useState } from 'react'

interface IngredientPromptProps {
  initialValue?: string
  label?: string
  placeholder?: string
  submitLabel?: string
  onSubmit: (value: string) => void | Promise<void>
  compact?: boolean
}

export function IngredientPrompt({ initialValue = '', label = 'Anong ingredients meron ka?', placeholder = 'Hal. itlog, kamatis, sardinas...', submitLabel = 'Lutuin natin!', onSubmit, compact = false }: IngredientPromptProps) {
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
      <div className="prompt-footer">
        <span className="prompt-helper">English, Tagalog, or Taglish okay.</span>
        <button className="button button-primary" type="submit" disabled={!isValid}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

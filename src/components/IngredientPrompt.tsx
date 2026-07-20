import { useState } from 'react'

interface IngredientPromptProps {
  initialValue?: string
  onSubmit: (value: string) => void
  compact?: boolean
}

export function IngredientPrompt({ initialValue = '', onSubmit, compact = false }: IngredientPromptProps) {
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
      <label htmlFor="ingredient-input">Anong ingredients meron ka?</label>
      <textarea
        id="ingredient-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Hal. itlog, kamatis, sardinas..."
        rows={compact ? 2 : 3}
      />
      <div className="prompt-footer">
        <span className="prompt-helper">English, Tagalog, or Taglish okay.</span>
        <button className="button button-primary" type="submit" disabled={!isValid}>
          Lutuin natin!
        </button>
      </div>
    </form>
  )
}

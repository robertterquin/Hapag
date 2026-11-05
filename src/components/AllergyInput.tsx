import { useState } from 'react'

interface AllergyInputProps {
  value: string[]
  onChange: (allergies: string[]) => void
}

// Keeps the typed text as-is so "shrimp, " can be followed by the next item; the parsed list goes up.
export function AllergyInput({ value, onChange }: AllergyInputProps) {
  const [text, setText] = useState(value.join(', '))
  return (
    <label className="field-label">
      Allergies
      <input
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          onChange(event.target.value.split(',').map((item) => item.trim()).filter(Boolean))
        }}
        placeholder="e.g. hipon, mani, gatas"
        autoComplete="off"
      />
    </label>
  )
}

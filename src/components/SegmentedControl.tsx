import { useId, useRef } from 'react'
import type { KeyboardEvent } from 'react'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: readonly SegmentedOption<T>[]
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) {
  const labelId = useId()
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))

  const selectAt = (index: number) => {
    const next = (index + options.length) % options.length
    onChange(options[next].value)
    buttonRefs.current[next]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); selectAt(index + 1) }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); selectAt(index - 1) }
    else if (event.key === 'Home') { event.preventDefault(); selectAt(0) }
    else if (event.key === 'End') { event.preventDefault(); selectAt(options.length - 1) }
  }

  return (
    <div className="segmented-field">
      <span className="segmented-label" id={labelId}>{label}</span>
      <div className="segmented-control" role="radiogroup" aria-labelledby={labelId}>
        {options.map((option, index) => {
          const checked = index === selectedIndex
          return (
            <button
              key={option.value}
              ref={(element) => { buttonRefs.current[index] = element }}
              className={`segmented-option ${checked ? 'segmented-option-active' : ''}`}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { RecipeFeedbackKind } from '../hooks/useRecipeFeedback.ts'

interface RecipeFeedbackProps { value?: RecipeFeedbackKind; onChange: (kind: RecipeFeedbackKind) => void }

const reasons: Array<{ kind: Exclude<RecipeFeedbackKind, 'helpful'>; label: string }> = [
  { kind: 'not-relevant', label: 'Not relevant' },
  { kind: 'missing-ingredient', label: 'Missing an ingredient' },
  { kind: 'not-filipino', label: 'Not a Filipino dish' },
]

export function RecipeFeedback({ value, onChange }: RecipeFeedbackProps) {
  const [showReasons, setShowReasons] = useState(false)
  const isNegative = Boolean(value && value !== 'helpful')

  return (
    <div className="recipe-feedback" aria-label="Recipe feedback">
      <div className="recipe-feedback-row">
        <span className="recipe-feedback-label">Good suggestion?</span>
        <button className={`feedback-thumb ${value === 'helpful' ? 'feedback-thumb-active' : ''}`} type="button" aria-pressed={value === 'helpful'} aria-label="Helpful" onClick={() => { setShowReasons(false); onChange('helpful') }}>👍</button>
        <button className={`feedback-thumb ${isNegative ? 'feedback-thumb-active' : ''}`} type="button" aria-pressed={isNegative} aria-expanded={showReasons} aria-label="Not helpful" onClick={() => setShowReasons((open) => !open)}>👎</button>
      </div>
      {showReasons ? (
        <div className="recipe-feedback-options" role="group" aria-label="What was wrong?">
          {reasons.map((reason) => {
            const selected = value === reason.kind
            return (
              <button key={reason.kind} className={selected ? 'feedback-option feedback-option-active' : 'feedback-option'} type="button" aria-pressed={selected} onClick={() => { onChange(reason.kind); setShowReasons(false) }}>
                {selected ? '✓ ' : ''}{reason.label}
              </button>
            )
          })}
        </div>
      ) : null}
      {value ? <small className="recipe-feedback-confirmation" role="status" aria-live="polite">Feedback saved. Salamat!</small> : null}
    </div>
  )
}

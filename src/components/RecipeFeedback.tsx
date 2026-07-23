import type { RecipeFeedbackKind } from '../hooks/useRecipeFeedback.ts'

interface RecipeFeedbackProps { value?: RecipeFeedbackKind; onChange: (kind: RecipeFeedbackKind) => void }
const options: Array<{ kind: RecipeFeedbackKind; label: string }> = [
  { kind: 'helpful', label: 'Helpful' },
  { kind: 'not-relevant', label: 'Not relevant' },
  { kind: 'missing-ingredient', label: 'Missing an ingredient' },
  { kind: 'not-filipino', label: 'Not a Filipino dish' },
]

export function RecipeFeedback({ value, onChange }: RecipeFeedbackProps) {
  return <div className="recipe-feedback" aria-label="Recipe feedback"><span className="recipe-feedback-label">How was this suggestion?</span><div className="recipe-feedback-options">{options.map((option) => { const selected = value === option.kind; return <button key={option.kind} className={selected ? 'feedback-option feedback-option-active' : 'feedback-option'} type="button" aria-pressed={selected} onClick={() => onChange(option.kind)}>{selected ? '✓ ' : ''}{option.label}</button> })}</div>{value ? <small className="recipe-feedback-confirmation" role="status" aria-live="polite">Feedback saved. Salamat!</small> : null}</div>
}

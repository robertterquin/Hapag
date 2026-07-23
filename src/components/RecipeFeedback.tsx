import type { RecipeFeedbackKind } from '../hooks/useRecipeFeedback.ts'

interface RecipeFeedbackProps { value?: RecipeFeedbackKind; onChange: (kind: RecipeFeedbackKind) => void }
const options: Array<{ kind: RecipeFeedbackKind; label: string }> = [
  { kind: 'helpful', label: 'Helpful' },
  { kind: 'not-relevant', label: 'Not relevant' },
  { kind: 'missing-ingredient', label: 'Missing an ingredient' },
  { kind: 'not-filipino', label: 'Not a Filipino dish' },
]

export function RecipeFeedback({ value, onChange }: RecipeFeedbackProps) {
  return <div className="recipe-feedback" aria-label="Recipe feedback"><span className="recipe-feedback-label">How was this suggestion?</span><div className="recipe-feedback-options">{options.map((option) => <button key={option.kind} className={value === option.kind ? 'feedback-option feedback-option-active' : 'feedback-option'} type="button" aria-pressed={value === option.kind} onClick={() => onChange(option.kind)}>{option.label}</button>)}</div></div>
}

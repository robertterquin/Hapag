import { clampServings, MAX_SERVINGS, MIN_SERVINGS } from '../lib/recipeControls.ts'

interface ServingStepperProps { value: number; onChange: (value: number) => void }

export function ServingStepper({ value, onChange }: ServingStepperProps) {
  const servings = clampServings(value)
  return <div className="serving-stepper" aria-label="Serving size"><span className="stepper-label">Servings</span><button type="button" disabled={servings === MIN_SERVINGS} onClick={() => onChange(servings - 1)} aria-label="Decrease servings">−</button><strong aria-live="polite">{servings}</strong><button type="button" disabled={servings === MAX_SERVINGS} onClick={() => onChange(servings + 1)} aria-label="Increase servings">+</button></div>
}

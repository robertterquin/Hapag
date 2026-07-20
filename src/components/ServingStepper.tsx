interface ServingStepperProps {
  value: number
  onChange: (value: number) => void
}

export function ServingStepper({ value, onChange }: ServingStepperProps) {
  return (
    <div className="serving-stepper" aria-label="Serving size">
      <span className="stepper-label">Servings</span>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease servings">−</button>
      <strong aria-live="polite">{value}</strong>
      <button type="button" onClick={() => onChange(Math.min(20, value + 1))} aria-label="Increase servings">+</button>
    </div>
  )
}

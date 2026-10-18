export type IngredientChipVariant = 'have' | 'missing' | 'staple' | 'substitute'

const variantTitles: Record<IngredientChipVariant, string> = {
  have: 'You have this',
  missing: 'Needed for this dish',
  staple: 'Probably in your kusina',
  substitute: 'Substitute',
}

interface IngredientChipProps {
  name: string
  variant: IngredientChipVariant
  onRemove?: () => void
}

export function IngredientChip({ name, variant, onRemove }: IngredientChipProps) {
  return (
    <span className={`hapag-chip hapag-chip-${variant}`} title={variantTitles[variant]}>
      <span>{name}</span>
      {onRemove ? (
        <button className="hapag-chip-remove" type="button" onClick={onRemove} aria-label={`Remove ${name}`}>×</button>
      ) : null}
    </span>
  )
}

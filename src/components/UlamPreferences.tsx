import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { GenerationConstraints } from '../types/domain.ts'
import { budgetOptions, dietOptions, spiceOptions, summarizeConstraints } from '../lib/preferenceOptions.ts'
import type { BudgetChoice } from '../lib/preferenceOptions.ts'
import { BottomSheet } from './BottomSheet.tsx'
import { SegmentedControl } from './SegmentedControl.tsx'
import { ServingStepper } from './ServingStepper.tsx'

interface UlamPreferencesProps {
  constraints: GenerationConstraints
  onUpdate: (patch: Partial<GenerationConstraints>) => void
}

export function UlamPreferences({ constraints, onUpdate }: UlamPreferencesProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="preferences-summary" type="button" onClick={(event) => { event.currentTarget.focus(); setOpen(true) }} aria-haspopup="dialog">
        <Icon className="preferences-summary-icon" icon="lucide:sliders-horizontal" width={18} height={18} aria-hidden="true" />
        <span>
          <small>Preferences</small>
          <strong>{summarizeConstraints(constraints)}</strong>
        </span>
        <Icon icon="lucide:chevron-right" width={18} height={18} aria-hidden="true" />
      </button>
      <p className="allergy-note">
        <Icon icon="lucide:triangle-alert" width={16} height={16} aria-hidden="true" />
        <span>Allergies? Always check food labels. Hapag can't guarantee allergen-free results.</span>
      </p>

      <BottomSheet
        open={open}
        title="Tailor to your household"
        onClose={() => setOpen(false)}
        footer={<button className="button button-primary full-width" type="button" onClick={() => setOpen(false)}>Done</button>}
      >
        <ServingStepper value={constraints.servings} onChange={(servings) => onUpdate({ servings })} />
        <SegmentedControl
          label="Budget limit"
          value={constraints.budgetLimit ? String(constraints.budgetLimit) as BudgetChoice : 'any'}
          options={budgetOptions}
          onChange={(choice) => onUpdate({ budgetLimit: choice === 'any' ? undefined : Number(choice) })}
        />
        <SegmentedControl
          label="Spice level"
          value={constraints.spiceLevel}
          options={spiceOptions}
          onChange={(spiceLevel) => onUpdate({ spiceLevel })}
        />
        <SegmentedControl
          label="Dietary preference"
          value={constraints.dietaryPreference ?? 'none'}
          options={dietOptions}
          onChange={(dietaryPreference) => onUpdate({ dietaryPreference })}
        />
      </BottomSheet>
    </>
  )
}

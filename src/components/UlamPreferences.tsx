import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { GenerationConstraints } from '../types/domain.ts'
import { budgetOptions, dietOptions, spiceOptions, summarizeConstraints } from '../lib/preferenceOptions.ts'
import type { BudgetChoice } from '../lib/preferenceOptions.ts'
import { BottomSheet } from './BottomSheet.tsx'
import { SegmentedControl } from './SegmentedControl.tsx'
import { ServingStepper } from './ServingStepper.tsx'
import { AllergyInput } from './AllergyInput.tsx'

interface UlamPreferencesProps {
  constraints: GenerationConstraints
  onUpdate: (patch: Partial<GenerationConstraints>) => void
  // Called when the sheet closes, so signed-in allergies can be saved once rather than on every keystroke.
  onClosed?: (constraints: GenerationConstraints) => void
}

export function UlamPreferences({ constraints, onUpdate, onClosed }: UlamPreferencesProps) {
  const [open, setOpen] = useState(false)
  const close = () => { setOpen(false); onClosed?.(constraints) }

  return (
    <>
      <button className="preferences-summary" type="button" onClick={(event) => { event.currentTarget.focus(); setOpen(true) }} aria-haspopup="dialog">
        <span className="preferences-summary-icon-badge" aria-hidden="true">
          <Icon className="preferences-summary-icon" icon="lucide:sliders-horizontal" width={18} height={18} />
        </span>
        <span>
          <small>Preferences</small>
          <strong>{summarizeConstraints(constraints)}</strong>
        </span>
        <Icon icon="lucide:chevron-right" width={18} height={18} aria-hidden="true" />
      </button>
      <p className="allergy-note">
        <Icon icon="lucide:triangle-alert" width={16} height={16} aria-hidden="true" />
        <span>{constraints.allergies.length > 0 ? 'Allergies set. Still check food labels; Hapag can\'t guarantee allergen-free results.' : 'Allergies? Add them in Preferences. Always check food labels.'}</span>
      </p>

      <BottomSheet
        open={open}
        title="Tailor to your household"
        onClose={close}
        footer={<button className="button button-primary full-width" type="button" onClick={close}>Done</button>}
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
        <AllergyInput value={constraints.allergies} onChange={(allergies) => onUpdate({ allergies })} />
        <p className="allergy-note">Dishes with these ingredients are left out. Still check food labels.</p>
      </BottomSheet>
    </>
  )
}

import type { GenerationConstraints } from '../types/domain.ts'
import type { SegmentedOption } from '../components/SegmentedControl.tsx'

export type BudgetChoice = 'any' | '100' | '200'
export type DietChoice = NonNullable<GenerationConstraints['dietaryPreference']>

export const budgetOptions: readonly SegmentedOption<BudgetChoice>[] = [
  { value: 'any', label: 'Any' },
  { value: '100', label: 'Under ₱100' },
  { value: '200', label: 'Under ₱200' },
]

export const spiceOptions: readonly SegmentedOption<GenerationConstraints['spiceLevel']>[] = [
  { value: 'mild', label: 'Mild' },
  { value: 'medium', label: 'Medium' },
  { value: 'hot', label: 'Spicy' },
]

export const dietOptions: readonly SegmentedOption<DietChoice>[] = [
  { value: 'none', label: 'None' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'low-sodium', label: 'Low-sodium' },
  { value: 'diabetic-friendly', label: 'Diabetic-friendly' },
]

export function summarizeConstraints(constraints: GenerationConstraints) {
  const parts = [
    `${constraints.servings} ${constraints.servings === 1 ? 'serving' : 'servings'}`,
    spiceOptions.find((option) => option.value === constraints.spiceLevel)?.label ?? 'Mild',
    constraints.budgetLimit ? `Under ₱${constraints.budgetLimit}` : 'Any budget',
  ]
  const diet = constraints.dietaryPreference ?? 'none'
  if (diet !== 'none') parts.push(dietOptions.find((option) => option.value === diet)?.label ?? diet)
  return parts.join(' · ')
}

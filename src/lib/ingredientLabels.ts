import { normalizeIngredientInput } from './ingredientParser.ts'

export type DisplayLanguage = 'Taglish' | 'Tagalog' | 'English'

export interface IngredientLabel {
  primary: string
  secondary?: string
}

function titleCase(value: string) {
  return value.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase())
}

// english is the parser's canonical name ("chicken"); local is its Tagalog display name ("manok").
export function getIngredientLabel(english: string, local: string | undefined, language: DisplayLanguage): IngredientLabel {
  const englishName = english.trim()
  const localName = local?.trim() || englishName
  const sameName = localName.toLowerCase() === englishName.toLowerCase()

  if (language === 'English') return { primary: titleCase(englishName) }
  if (language === 'Tagalog' || sameName) return { primary: titleCase(localName) }
  return { primary: titleCase(localName), secondary: englishName.toLowerCase() }
}

export function formatIngredientLabel(label: IngredientLabel) {
  return label.secondary ? `${label.primary} (${label.secondary})` : label.primary
}

export function labelForIngredient(ingredient: { name: string; canonicalName: string }, language: DisplayLanguage) {
  return formatIngredientLabel(getIngredientLabel(ingredient.canonicalName, ingredient.name, language))
}

// For catalog/staple names that have not been parsed yet.
export function labelForName(name: string, language: DisplayLanguage) {
  const parsed = normalizeIngredientInput(name)[0]
  return parsed ? labelForIngredient(parsed, language) : name
}

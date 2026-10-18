import type { Recipe, RecipeStep } from '../types/domain.ts'
import { normalizeIngredientInput, normalizeIngredientName } from './ingredientParser.ts'

type IngredientLine = Recipe['ingredients'][number]

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Every name a step might use for this ingredient: the label as written, its canonical name,
// and the parser's English and Tagalog forms ("Itlog" -> itlog, egg; "Mantika" -> mantika, oil).
function namesFor(ingredient: IngredientLine) {
  const names = new Set<string>()
  for (const raw of [ingredient.name, ingredient.canonicalName]) {
    const value = raw.trim().toLowerCase()
    if (!value) continue
    names.add(value)
    names.add(normalizeIngredientName(value))
    const parsed = normalizeIngredientInput(value)[0]
    if (parsed) {
      names.add(parsed.canonicalName.toLowerCase())
      names.add(parsed.name.toLowerCase())
    }
  }
  // "canned sardines" should also match a step that just says "sardines".
  for (const name of [...names]) {
    const words = name.split(' ')
    if (words.length > 1 && ['canned', 'cooking', 'fresh', 'dried', 'ground'].includes(words[0])) names.add(words.slice(1).join(' '))
  }
  return [...names].filter((name) => name.length >= 3)
}

function mentions(text: string, name: string) {
  const plural = name.endsWith('o') ? '(?:es)?' : name.endsWith('s') ? '' : '(?:s|es)?'
  return new RegExp(`\\b${escapeRegExp(name)}${plural}\\b`, 'i').test(text)
}

// Ingredients a step mentions, in recipe order, so cooks see what to grab for this step.
export function getStepIngredients(step: Pick<RecipeStep, 'action'>, ingredients: readonly IngredientLine[]) {
  return ingredients.filter((ingredient) => namesFor(ingredient).some((name) => mentions(step.action, name)))
}

// Ingredients the user brought to this search that the recipe did not use.
export function getLeftovers(sessionIngredients: readonly { name: string; canonicalName: string }[], recipe: Pick<Recipe, 'ingredients'>) {
  const used = new Set(recipe.ingredients.flatMap((ingredient) => namesFor(ingredient)))
  return sessionIngredients.filter((ingredient) => !used.has(ingredient.canonicalName.toLowerCase()) && !used.has(ingredient.name.toLowerCase()))
}

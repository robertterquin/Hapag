import { filipinoRecipeCatalog } from '../data/filipinoRecipeCatalog.ts'
import { kusinaPantryItems } from '../data/kusinaShelf.ts'
import { normalizeIngredientInput } from './ingredientParser.ts'
import { isPantryStaple } from './pantryStaples.ts'
import { countRecipeMatches, matchRecipeCatalog } from '../services/recipeMatcher.ts'
import type { NormalizedIngredient } from '../types/domain.ts'

// A catalog dish that fits the user's ingredients. Unlike a Recipe it has no steps or prices,
// so it is shown as an idea rather than a full recipe.
export interface DishIdea {
  id: string
  name: string
  localName?: string
  description: string
  cookingMethod: string
  score: number
  have: string[]
  missing: string[]
  staples: string[]
  substitutions: Array<{ requiredIngredient: string; providedIngredient: string; note: string }>
}

export function buildDishIdeas(ingredients: NormalizedIngredient[], limit = 6): DishIdea[] {
  return matchRecipeCatalog(ingredients, filipinoRecipeCatalog, limit).map((match) => ({
    id: match.dish.id,
    name: match.dish.name,
    localName: match.dish.localName,
    description: match.dish.description,
    cookingMethod: match.dish.cookingMethod,
    score: match.score,
    have: match.availableIngredients,
    missing: match.missingIngredients.filter((item) => !isPantryStaple(item)),
    staples: match.missingIngredients.filter((item) => isPantryStaple(item)),
    substitutions: match.substitutedIngredients,
  }))
}

// The single pantry item that would unlock the most extra catalog dishes, if any.
export function suggestUnlockIngredient(ingredients: NormalizedIngredient[]) {
  const current = new Set(ingredients.map((ingredient) => ingredient.canonicalName))
  const baseline = countRecipeMatches(ingredients)
  let best: { name: string; gain: number } | undefined
  for (const item of kusinaPantryItems) {
    const [parsed] = normalizeIngredientInput(item.name)
    if (!parsed || current.has(parsed.canonicalName)) continue
    const gain = countRecipeMatches([...ingredients, parsed]) - baseline
    if (gain > 0 && (!best || gain > best.gain)) best = { name: item.name, gain }
  }
  return best
}

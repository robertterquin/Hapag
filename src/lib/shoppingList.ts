import type { Recipe } from '../types/domain.ts'
import { formatQuantity } from './format.ts'
import { normalizeIngredientName } from './ingredientParser.ts'
import { getIngredientStatus } from './pantryStaples.ts'

export interface ShoppingItem {
  name: string
  quantity: string
  estimatedCost?: number
  staple: boolean
}

export interface ShoppingList {
  items: ShoppingItem[]
  // Sum of the items that have a price; undefined when none do.
  knownTotal?: number
  unpricedCount: number
}

// Prices come from the recipe's own cost lines, matched by canonical name ("Eggs" ~ "Itlog").
function findCost(recipe: Recipe, ingredient: Recipe['ingredients'][number]) {
  const keys = new Set([normalizeIngredientName(ingredient.name), normalizeIngredientName(ingredient.canonicalName)])
  return recipe.costBreakdown.find((line) => keys.has(normalizeIngredientName(line.ingredient)))?.estimatedCost
}

export function buildShoppingList(recipe: Recipe, options: { includeStaples: boolean }): ShoppingList {
  const items = recipe.ingredients.flatMap((ingredient) => {
    const status = getIngredientStatus(ingredient)
    if (status === 'have' || (status === 'staple' && !options.includeStaples)) return []
    return [{
      name: ingredient.name,
      quantity: formatQuantity(ingredient.quantity, ingredient.unit),
      estimatedCost: findCost(recipe, ingredient),
      staple: status === 'staple',
    }]
  })
  const priced = items.filter((item) => item.estimatedCost !== undefined)
  return {
    items,
    knownTotal: priced.length > 0 ? priced.reduce((sum, item) => sum + (item.estimatedCost ?? 0), 0) : undefined,
    unpricedCount: items.length - priced.length,
  }
}

export function formatShoppingList(recipe: Pick<Recipe, 'title' | 'servings'>, list: ShoppingList) {
  const lines = [`Hapag shopping list: ${recipe.title} (${recipe.servings} servings)`]
  for (const item of list.items) {
    lines.push(`- ${item.quantity} ${item.name}${item.estimatedCost !== undefined ? ` (about ₱${item.estimatedCost})` : ''}`)
  }
  if (list.knownTotal !== undefined) lines.push(`Estimated total: about ₱${list.knownTotal}${list.unpricedCount > 0 ? ` plus ${list.unpricedCount} unpriced` : ''}`)
  return lines.join('\n')
}

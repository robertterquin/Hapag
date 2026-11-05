import type { FilipinoRecipeCatalogEntry } from '../data/filipinoRecipeCatalog.ts'
import type { GenerationConstraints } from '../types/domain.ts'
import { normalizeIngredientName } from './ingredientParser.ts'

const fish = ['fish', 'milkfish', 'tilapia', 'sardines', 'salted fish', 'smoked fish', 'fish sauce']
const shellfish = ['shrimp', 'shrimp paste', 'mussels', 'squid', 'crab']
const meat = ['beef', 'beef marrow bone', 'beef shank', 'beef tapa', 'beef tripe', 'chicken', 'chorizo', 'corned beef', 'goat', 'gravy', 'ground beef', 'ground pork', 'hotdog', 'intestine', 'lechon', 'liver spread', 'longganisa', 'luncheon meat', 'oxtail', 'pork', 'pork belly', 'pork blood', 'pork cracklings', 'pork face', 'pork leg', 'pork liver', 'pork rind', 'pork tocino']

// Required ingredients that make a dish clearly salty or sweet; a guide, not nutrition data.
const salty = ['soy sauce', 'fish sauce', 'shrimp paste', 'salted fish', 'salted egg', 'smoked fish', 'corned beef', 'luncheon meat', 'hotdog', 'longganisa', 'pork tocino', 'beef tapa', 'chorizo', 'oyster sauce', 'miso', 'liver spread', 'gravy', 'pork cracklings']
const sweet = ['sugar', 'brown sugar', 'condensed milk', 'banana ketchup', 'cocoa', 'glutinous rice', 'pie crust', 'raisins', 'pork tocino', 'longganisa', 'pineapple']

// Allergy words that cover more than one catalog ingredient, keyed by their normalized name.
const allergyGroups: Record<string, readonly string[]> = {
  peanut: ['peanut butter'],
  nut: ['peanut butter'],
  fish,
  seafood: [...fish, ...shellfish],
  shellfish,
  shrimp: ['shrimp', 'shrimp paste'],
  milk: ['milk', 'evaporated milk', 'condensed milk', 'cheese', 'butter'],
  dairy: ['milk', 'evaporated milk', 'condensed milk', 'cheese', 'butter'],
  'soy sauce': ['soy sauce', 'tofu', 'miso', 'oyster sauce'],
  gluten: ['flour', 'flour noodles', 'egg noodles', 'bread crumbs', 'lumpia wrapper', 'spaghetti', 'pie crust', 'misua noodles', 'pancit bato noodles', 'soy sauce', 'oyster sauce'],
  wheat: ['flour', 'flour noodles', 'egg noodles', 'bread crumbs', 'lumpia wrapper', 'spaghetti', 'pie crust', 'misua noodles', 'pancit bato noodles'],
}

const containsWord = (ingredient: string, word: string) => new RegExp(`(^|\\s)${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(ingredient)

const usesAny = (ingredients: readonly string[], words: readonly string[]) => ingredients.some((ingredient) => words.some((word) => ingredient === word || containsWord(ingredient, word)))

// Catalog dishes the cook's allergies or diet rule out. Allergies check optional ingredients too, to be
// safe; diets check only required ones, since optional pork, shrimp or patis can be left out.
export function fitsDietAndAllergies(dish: FilipinoRecipeCatalogEntry, constraints: Pick<GenerationConstraints, 'allergies' | 'dietaryPreference'>) {
  const allergens = constraints.allergies.flatMap((allergy) => {
    const key = normalizeIngredientName(allergy).replace(/s$/, '')
    return key ? [key, ...(allergyGroups[key] ?? [])] : []
  })
  if (usesAny([...dish.requiredIngredients, ...dish.optionalIngredients], allergens)) return false
  const avoid = { vegetarian: [...meat, ...fish, ...shellfish], 'low-sodium': salty, 'diabetic-friendly': sweet, none: [] }[constraints.dietaryPreference ?? 'none']
  return !usesAny(dish.requiredIngredients, avoid)
}

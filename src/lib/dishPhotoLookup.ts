import { dishPhotos } from '../data/dishPhotos.ts'
import type { DishPhoto } from '../data/dishPhotos.ts'
import { filipinoRecipeCatalog } from '../data/filipinoRecipeCatalog.ts'

function nameKey(value: string) {
  // Deliberately not cleanDishTitle: it drops phrases like "sa Gata", which would turn
  // Adobong Manok sa Gata into plain Adobong Manok and borrow the wrong photo.
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
}

const dishIdByName = new Map<string, string>()
for (const dish of filipinoRecipeCatalog) {
  if (!dishPhotos[dish.id]) continue
  dishIdByName.set(nameKey(dish.name), dish.id)
  if (dish.localName) dishIdByName.set(nameKey(dish.localName), dish.id)
}

const KNOWN_DISH_ALIASES: Record<string, string> = {
  'sardines-egg-pechay': 'sardines-with-egg',
  'ginisang-pechay-egg': 'ginisang-pechay-with-egg',
  'sardine-omelet-tomato': 'tortang-sardinas',
}

const KNOWN_TITLE_ALIASES: Record<string, string> = {
  'sardines with egg and pechay': 'sardines-with-egg',
  'sardinas na may itlog at pechay': 'sardines-with-egg',
  'sardine omelet with tomato': 'tortang-sardinas',
  'tortang sardinas na may kamatis': 'tortang-sardinas',
  'ginisang pechay na may itlog': 'ginisang-pechay-with-egg',
}

const DESCRIPTOR_PREFIX = /^(?:classic|home-style|authentic|quick|filipino-style|lutong-bahay)\s+/i

function resolveDishId(rawTitle: string): string | undefined {
  const key = nameKey(rawTitle)
  if (!key) return undefined

  // 1. Direct catalog name or localName
  const direct = dishIdByName.get(key)
  if (direct) return direct

  // 2. Known composite title alias
  const alias = KNOWN_TITLE_ALIASES[key]
  if (alias) return alias

  // 3. Strip common AI generated descriptor prefixes (e.g. "Classic Chicken Adobo" -> "Chicken Adobo")
  const stripped = rawTitle.replace(DESCRIPTOR_PREFIX, '').trim()
  if (stripped && stripped !== rawTitle) {
    const strippedKey = nameKey(stripped)
    const fromStripped = dishIdByName.get(strippedKey) ?? KNOWN_TITLE_ALIASES[strippedKey]
    if (fromStripped) return fromStripped
  }

  // 4. Check parenthetical aliases (e.g. "Chicken Adobo (Adobong Manok)")
  if (rawTitle.includes('(')) {
    const parts = rawTitle.split(/[()]/).map((p) => p.trim()).filter((p) => p.length > 0)
    for (const part of parts) {
      const partKey = nameKey(part)
      const fromPart = dishIdByName.get(partKey) ?? KNOWN_TITLE_ALIASES[partKey]
      if (fromPart) return fromPart
      const partStripped = nameKey(part.replace(DESCRIPTOR_PREFIX, '').trim())
      const fromPartStripped = dishIdByName.get(partStripped) ?? KNOWN_TITLE_ALIASES[partStripped]
      if (fromPartStripped) return fromPartStripped
    }
  }

  return undefined
}

// Only exact dish matches get a photo: "Sarciadong Tilapia" does not borrow the generic
// "Sarciadong Isda" photo, because the photo may show a different fish.
export function getDishPhoto(recipe: { id?: string; title: string; localTitle?: string }): DishPhoto | undefined {
  if (recipe.id) {
    if (dishPhotos[recipe.id]) return dishPhotos[recipe.id]
    const aliasId = KNOWN_DISH_ALIASES[recipe.id]
    if (aliasId && dishPhotos[aliasId]) return dishPhotos[aliasId]
  }

  for (const title of [recipe.title, recipe.localTitle]) {
    if (!title) continue
    const dishId = resolveDishId(title)
    if (dishId && dishPhotos[dishId]) return dishPhotos[dishId]
  }

  return undefined
}

const categoryById = new Map(filipinoRecipeCatalog.map((dish) => [dish.id, dish.category]))
const categoryByName = new Map(filipinoRecipeCatalog.flatMap((dish) => [dish.name, dish.localName].filter(Boolean).map((name) => [nameKey(name as string), dish.category])))

const categoryIcons: Array<[RegExp, string]> = [
  [/soup/, '🍲'],
  [/stew|braised|simmered|steamed|stuffed|pie/, '🥘'],
  [/grilled|roasted/, '🍢'],
  [/noodle|pasta/, '🍜'],
  [/vegetable|salad/, '🥬'],
  [/seafood/, '🐟'],
  [/breakfast|egg|rice|quick|fried|sautéed|appetizer/, '🍳'],
]

// Icon for the photo-less tile, from the catalog dish type; AI dishes outside the catalog get a plate.
export function getDishIcon(recipe: { id?: string; title: string; localTitle?: string }) {
  const category = (recipe.id && categoryById.get(recipe.id))
    ?? [recipe.title, recipe.localTitle].map((title) => title && categoryByName.get(nameKey(title))).find(Boolean)
  return categoryIcons.find(([pattern]) => category && pattern.test(category))?.[1] ?? '🍽️'
}

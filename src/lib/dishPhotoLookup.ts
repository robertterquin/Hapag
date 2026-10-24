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

// Only exact dish matches get a photo: "Sarciadong Tilapia" does not borrow the generic
// "Sarciadong Isda" photo, because the photo may show a different fish.
export function getDishPhoto(recipe: { id?: string; title: string; localTitle?: string }): DishPhoto | undefined {
  if (recipe.id && dishPhotos[recipe.id]) return dishPhotos[recipe.id]
  for (const title of [recipe.title, recipe.localTitle]) {
    if (!title) continue
    const dishId = dishIdByName.get(nameKey(title))
    if (dishId) return dishPhotos[dishId]
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

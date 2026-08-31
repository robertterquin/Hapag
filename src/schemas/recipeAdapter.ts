import { validateRecipe, validateRecipeList } from './recipeSchema.ts'
import type { Recipe } from '../types/domain.ts'
import { generateDishCulinaryInsight } from '../lib/culinaryInsights.ts'

export function cleanDishTitle(title: string): string {
  if (!title || typeof title !== 'string') return ''
  const cleaned = title
    // Strip leading prefixes like "Hapag ", "Home-Style ", "Quick ", "Authentic "
    .replace(/^(?:hapag|home-style|quick|authentic)(?:\s+|-|:)\s*/i, '')
    // Strip artificial descriptive suffixes like "na may inihaw-style na bawang", "style na..."
    .replace(/\s+(?:na\s+may|may)\s+[a-z0-9\s-]+style(?:\s+na)?\s+[\w\s]+$/i, '')
    // Strip artificial aromatic compound suffixes like "sa sibuyas at paminta", "sa bawang at sibuyas"
    .replace(/\s+sa\s+(?:sibuyas|bawang|paminta|kamatis|luya|toyo|suka|mantika|asin|gata)(?:\s+(?:at|&)\s+(?:sibuyas|bawang|paminta|kamatis|luya|toyo|suka|mantika|asin|gata))?$/i, '')
    // Strip "with [ingredient] and [ingredient]"
    .replace(/\s+with\s+(?:garlic|onion|pepper|black pepper|ginger|salt|oil|soy sauce|vinegar)(?:\s+(?:and|&)\s+(?:garlic|onion|pepper|black pepper|ginger|salt|oil|soy sauce|vinegar))?$/i, '')
    .trim()

  return cleaned || title
}

interface IngredientLike {
  name: string
  canonicalName?: string
}

const SPECIFIC_FISH_MAP: Record<string, string> = {
  tilapia: 'Tilapia',
  milkfish: 'Bangus',
  bangus: 'Bangus',
  galunggong: 'Galunggong',
  'round scad': 'Galunggong',
  tulingan: 'Tulingan',
  'mackerel tuna': 'Tulingan',
  tanigue: 'Tanigue',
  'spanish mackerel': 'Tanigue',
  salmon: 'Salmon',
  'salmon head': 'Salmon Head',
  pampano: 'Pampano',
  pompano: 'Pampano',
  'maya-maya': 'Maya-maya',
  'red snapper': 'Maya-maya',
  hito: 'Hito',
  catfish: 'Hito',
  'dalagang bukid': 'Dalagang Bukid',
  'yellowtail fusilier': 'Dalagang Bukid',
  'lapu-lapu': 'Lapu-Lapu',
  grouper: 'Lapu-Lapu',
  tambakol: 'Tambakol',
  'yellowfin tuna': 'Tambakol',
  tuna: 'Tuna',
}

const SPECIFIC_VEG_MAP: Record<string, string> = {
  pechay: 'Pechay',
  'bok choy': 'Pechay',
  kangkong: 'Kangkong',
  'water spinach': 'Kangkong',
  sayote: 'Sayote',
  chayote: 'Sayote',
  upo: 'Upo',
  'bottle gourd': 'Upo',
  patola: 'Patola',
  'sponge gourd': 'Patola',
  ampalaya: 'Ampalaya',
  'bitter melon': 'Ampalaya',
  repolyo: 'Repolyo',
  cabbage: 'Repolyo',
  togue: 'Togue',
  'bean sprouts': 'Togue',
  sitaw: 'Sitaw',
  'string beans': 'Sitaw',
  'long beans': 'Sitaw',
  talong: 'Talong',
  eggplant: 'Talong',
  langka: 'Langka',
  jackfruit: 'Langka',
  'green jackfruit': 'Langka',
  'banana blossom': 'Puso ng Saging',
  'puso ng saging': 'Puso ng Saging',
  kalabasa: 'Kalabasa',
  squash: 'Kalabasa',
}

export function specializeDishTitle(title: string, ingredients: IngredientLike[] = []): string {
  if (!title || typeof title !== 'string') return ''

  const availableCanonical = new Set<string>()
  for (const ing of ingredients) {
    if (ing.canonicalName) availableCanonical.add(ing.canonicalName.toLowerCase().trim())
    if (ing.name) availableCanonical.add(ing.name.toLowerCase().trim())
  }

  // 1. Check for specific fish species
  let matchedFish: string | undefined
  for (const [key, displayName] of Object.entries(SPECIFIC_FISH_MAP)) {
    if (availableCanonical.has(key)) {
      matchedFish = displayName
      break
    }
  }

  let specialized = title

  if (matchedFish) {
    // Replace "... na Isda" / "... na Fish" -> "... na [Fish]"
    specialized = specialized.replace(/\b(sinigang|paksiw|inihaw|tinola|pesa|daing|kilawin|pritong|bistek|sweet and sour)\s+na\s+isda\b/gi, `$1 na ${matchedFish}`)
    specialized = specialized.replace(/\b(sinigang|paksiw|inihaw|tinola|pesa|daing|kilawin|pritong|bistek|sweet and sour)\s+na\s+fish\b/gi, `$1 na ${matchedFish}`)

    // Replace specific generic names
    specialized = specialized.replace(/\bsarciadong\s+isda\b/gi, `Sarciadong ${matchedFish}`)
    specialized = specialized.replace(/\bescabecheng\s+isda\b/gi, `Escabecheng ${matchedFish}`)
    specialized = specialized.replace(/^escabeche$/i, `Escabecheng ${matchedFish}`)
    specialized = specialized.replace(/\bginataang\s+isda\b/gi, `Ginataang ${matchedFish}`)
    specialized = specialized.replace(/\bkilawing\s+isda\b/gi, `Kilawing ${matchedFish}`)
    specialized = specialized.replace(/\btinolang\s+isda\b/gi, `Tinolang ${matchedFish}`)
    specialized = specialized.replace(/\bpesang\s+isda\b/gi, `Pesang ${matchedFish}`)
    specialized = specialized.replace(/\bdaing\s+na\s+isda\b/gi, `Daing na ${matchedFish}`)

    // Replace English patterns
    specialized = specialized.replace(/\bfish\s+(sarciado|paksiw|sinigang|tinola|escabeche|kilawin|pesa)\b/gi, `${matchedFish} $1`)
    specialized = specialized.replace(/\b(grilled|fried|steamed|sweet and sour|crispy)\s+fish\b/gi, `$1 ${matchedFish}`)
    specialized = specialized.replace(/\bfish\s+in\s+coconut\s+milk\b/gi, `${matchedFish} in Coconut Milk`)
  }

  // 2. Check for specific vegetable
  let matchedVeg: string | undefined
  for (const [key, displayName] of Object.entries(SPECIFIC_VEG_MAP)) {
    if (availableCanonical.has(key)) {
      matchedVeg = displayName
      break
    }
  }

  if (matchedVeg) {
    specialized = specialized.replace(/\bginisang\s+gulay\b/gi, `Ginisang ${matchedVeg}`)
    specialized = specialized.replace(/\bsaut[eé]ed\s+vegetables?\b/gi, `Sautéed ${matchedVeg}`)
    specialized = specialized.replace(/\badobong\s+gulay\b/gi, `Adobong ${matchedVeg}`)

    if (/\bginataang\s+gulay\b/i.test(specialized) || /\bvegetables?\s+in\s+coconut\s+milk\b/i.test(specialized)) {
      if (availableCanonical.has('langka') || availableCanonical.has('jackfruit') || availableCanonical.has('green jackfruit')) {
        specialized = 'Ginataang Langka'
      } else if (availableCanonical.has('banana blossom') || availableCanonical.has('puso ng saging')) {
        specialized = 'Ginataang Puso ng Saging'
      } else if ((availableCanonical.has('kalabasa') || availableCanonical.has('squash')) && (availableCanonical.has('sitaw') || availableCanonical.has('string beans') || availableCanonical.has('long beans'))) {
        specialized = 'Ginataang Kalabasa at Sitaw'
      } else {
        specialized = `Ginataang ${matchedVeg}`
      }
    }
  }

  // 3. Check for pork belly / liempo
  if (availableCanonical.has('pork belly') || availableCanonical.has('liempo')) {
    specialized = specialized.replace(/\binihaw\s+na\s+baboy\b/gi, 'Inihaw na Liempo')
    specialized = specialized.replace(/\bgrilled\s+pork\b/gi, 'Grilled Pork Belly (Inihaw na Liempo)')
    specialized = specialized.replace(/\bsinugba\s+na\s+baboy\b/gi, 'Sinugba na Liempo')
  }

  return specialized
}

function sanitizeRecipe(recipe: Recipe): Recipe {
  const cleanedTitle = cleanDishTitle(recipe.title)
  const specializedTitle = specializeDishTitle(cleanedTitle, recipe.ingredients)
  const localTitle = recipe.localTitle
    ? specializeDishTitle(cleanDishTitle(recipe.localTitle), recipe.ingredients)
    : recipe.localTitle

  let cleaned: Recipe = {
    ...recipe,
    title: specializedTitle,
    localTitle,
  }
  if (
    !cleaned.matchReason ||
    /(?:candidate|score|\bgrounded\b|from the session|supplied|marked.*available|marks.*as unavailable|availableingredients|missingingredients|preserves.*identity|still needed|natural fit for this dish|already have on hand|minarkahang available)/i.test(
      cleaned.matchReason
    )
  ) {
    const availableNames = cleaned.ingredients.filter((i) => i.available).map((i) => i.name)
    cleaned = {
      ...cleaned,
      matchReason: generateDishCulinaryInsight(cleaned.title, availableNames),
    }
  }
  return cleaned
}

export function adaptRecipePayload(payload: unknown): Recipe {
  return sanitizeRecipe(validateRecipe(payload))
}

export function adaptRecipeListPayload(payload: unknown): Recipe[] {
  return validateRecipeList(payload).map(sanitizeRecipe)
}


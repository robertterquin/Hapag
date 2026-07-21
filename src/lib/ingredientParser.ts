import type { IngredientSource, NormalizedIngredient, PantryUnit } from '../types/domain.ts'

export const pantryUnits: readonly PantryUnit[] = [
  'piece', 'can', 'pack', 'bottle', 'bundle', 'clove', 'cup', 'gram', 'kilogram', 'block',
]

export const pantryUnitLabels: Record<PantryUnit, string> = {
  piece: 'piece',
  can: 'can',
  pack: 'pack',
  bottle: 'bottle',
  bundle: 'bundle',
  clove: 'clove',
  cup: 'cup',
  gram: 'gram',
  kilogram: 'kilogram',
  block: 'block',
}

const aliases: Record<string, string> = {
  itlog: 'egg',
  itlogg: 'egg',
  eggs: 'egg',
  egg: 'egg',
  kamatis: 'tomato',
  kamatises: 'tomato',
  tomatoes: 'tomato',
  tomato: 'tomato',
  sardinas: 'canned sardines',
  sardine: 'canned sardines',
  sardines: 'canned sardines',
  'canned sardine': 'canned sardines',
  'canned sardines': 'canned sardines',
  pechay: 'pechay',
  'bok choy': 'pechay',
  bawang: 'garlic',
  garlic: 'garlic',
  sibuyas: 'onion',
  onions: 'onion',
  onion: 'onion',
  talong: 'eggplant',
  eggplant: 'eggplant',
  eggplants: 'eggplant',
  tofu: 'tofu',
  tokwa: 'tofu',
  manok: 'chicken',
  chicken: 'chicken',
  baboy: 'pork',
  pork: 'pork',
  kanin: 'cooked rice',
  'leftover rice': 'cooked rice',
  bigas: 'uncooked rice',
  rice: 'uncooked rice',
  'bell pepper': 'bell pepper',
  'bell peppers': 'bell pepper',
  'red pepper': 'bell pepper',
  'green pepper': 'bell pepper',
}

const displayNames: Record<string, string> = {
  egg: 'itlog',
  tomato: 'kamatis',
  'canned sardines': 'sardinas',
  pechay: 'pechay',
  garlic: 'bawang',
  onion: 'sibuyas',
  eggplant: 'talong',
  tofu: 'tofu',
  chicken: 'manok',
  pork: 'baboy',
  'cooked rice': 'kanin',
  'uncooked rice': 'bigas',
  'bell pepper': 'bell pepper',
}

const unitAliases: Array<[PantryUnit, string[]]> = [
  ['kilogram', ['kilograms', 'kilogram', 'kilos', 'kilo', 'kg']],
  ['bundle', ['bundles', 'bundle', 'tali']],
  ['bottle', ['bottles', 'bottle', 'bote']],
  ['clove', ['cloves', 'clove', 'butil']],
  ['piece', ['pieces', 'piece', 'pcs', 'pc', 'piraso']],
  ['can', ['cans', 'can', 'lata', 'latas']],
  ['pack', ['packs', 'pack', 'pak']],
  ['gram', ['grams', 'gram', 'gramo', 'gramos', 'g']],
  ['cup', ['cups', 'cup', 'tasa']],
  ['block', ['blocks', 'block']],
]

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function slugify(value: string) {
  return normalizeKey(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ingredient'
}

function splitInput(input: string) {
  return input
    .replace(/\b(?:may|ako|meron)\b/gi, '')
    .split(/\r?\n|,|\band\b|\bat\b/gi)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseUnit(value: string): { unit: PantryUnit; name: string } {
  for (const [unit, aliasesForUnit] of unitAliases) {
    const alias = aliasesForUnit.find((candidate) => new RegExp(`^${candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`, 'i').test(value))
    if (alias) {
      return { unit, name: value.slice(alias.length).trim().replace(/^(?:of|ng|na)\s+/i, '') }
    }
  }
  return { unit: 'piece', name: value.replace(/^(?:of|ng|na)\s+/i, '') }
}

function normalizeItem(originalText: string, index: number, source: IngredientSource): NormalizedIngredient {
  const cleanedText = originalText.trim().replace(/\s+/g, ' ')
  const quantityMatch = cleanedText.match(/^(\d+(?:[.,]\d+)?)\s*/)
  const quantity = quantityMatch ? Number(quantityMatch[1].replace(',', '.')) : 1
  const hasExplicitQuantity = Boolean(quantityMatch)
  const withoutQuantity = (quantityMatch ? cleanedText.slice(quantityMatch[0].length) : cleanedText).replace(/^(?:of|ng|na)\s+/i, '')
  const { unit, name: parsedName } = parseUnit(withoutQuantity)
  const normalizedName = normalizeKey(parsedName)
  const canonicalName = aliases[normalizedName] ?? normalizedName
  const isKnown = Boolean(aliases[normalizedName])
  const displayName = displayNames[canonicalName] ?? parsedName.trim()

  return {
    id: `${source}-${slugify(canonicalName)}-${index}`,
    name: displayName,
    canonicalName,
    originalText: cleanedText,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    unit,
    source,
    confidence: isKnown && hasExplicitQuantity ? 'high' : 'low',
    available: true,
  }
}

export function normalizeIngredientInput(input: string, source: IngredientSource = 'manual') {
  return splitInput(input).map((item, index) => normalizeItem(item, index, source))
}

export function formatPantryQuantity(item: Pick<NormalizedIngredient, 'quantity' | 'unit'>) {
  return `${item.quantity} ${pantryUnitLabels[item.unit]}`
}

export function formatPantryInput(items: NormalizedIngredient[]) {
  return items.map((item) => `${formatPantryQuantity(item)} ${item.name}`).join(', ')
}

export function isPantryUnit(value: string | null | undefined): value is PantryUnit {
  return Boolean(value && pantryUnits.includes(value as PantryUnit))
}

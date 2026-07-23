import type { IngredientDraft, IngredientInputUnit, IngredientSource, NormalizedIngredient } from '../types/domain.ts'

export const ingredientInputUnits: readonly IngredientInputUnit[] = [
  'piece', 'can', 'pack', 'bottle', 'bundle', 'clove', 'cup', 'gram', 'kilogram', 'block',
]

export const ingredientInputUnitLabels: Record<IngredientInputUnit, string> = {
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
  sardinas: 'sardines',
  sardine: 'sardines',
  sardines: 'sardines',
  'canned sardine': 'sardines',
  'canned sardines': 'sardines',
  pechay: 'bok choy',
  'bok choy': 'bok choy',
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
  hipon: 'shrimp',
  shrimp: 'shrimp',
  isda: 'fish',
  fish: 'fish',
  bangus: 'milkfish',
  milkfish: 'milkfish',
  sitaw: 'long beans',
  'long bean': 'long beans',
  'long beans': 'long beans',
  kalabasa: 'squash',
  squash: 'squash',
  ampalaya: 'bitter melon',
  'bitter melon': 'bitter melon',
  gata: 'coconut milk',
  'coconut milk': 'coconut milk',
  luya: 'ginger',
  ginger: 'ginger',
  suka: 'vinegar',
  vinegar: 'vinegar',
  toyo: 'soy sauce',
  'soy sauce': 'soy sauce',
  'peanut butter': 'peanut butter',
  peanut: 'peanut',
  mani: 'peanut',
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
  sardines: 'sardinas',
  'bok choy': 'pechay',
  garlic: 'bawang',
  onion: 'sibuyas',
  eggplant: 'talong',
  tofu: 'tofu',
  chicken: 'manok',
  pork: 'baboy',
  'cooked rice': 'kanin',
  'uncooked rice': 'bigas',
  'bell pepper': 'bell pepper',
  shrimp: 'hipon',
  fish: 'isda',
  milkfish: 'bangus',
  'long beans': 'sitaw',
  squash: 'kalabasa',
  'bitter melon': 'ampalaya',
  'coconut milk': 'gata',
  ginger: 'luya',
  vinegar: 'suka',
  'soy sauce': 'toyo',
  'peanut butter': 'peanut butter',
  peanut: 'mani',
}

const unitAliases: Array<[IngredientInputUnit, string[]]> = [
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

export function normalizeIngredientName(value: string) {
  const normalized = normalizeKey(value).replace(/^[,.;:]+|[,.;:]+$/g, '')
  return aliases[normalized] ?? normalized
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

function parseUnit(value: string): { unit: IngredientInputUnit; name: string } {
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
  const withoutQuantity = (quantityMatch ? cleanedText.slice(quantityMatch[0].length) : cleanedText).replace(/^(?:of|ng|na)\s+/i, '')
  const { unit, name: parsedName } = parseUnit(withoutQuantity)
  const normalizedName = normalizeKey(parsedName)
  const canonicalName = normalizeIngredientName(normalizedName)
  const isKnown = canonicalName !== normalizedName || Boolean(aliases[normalizedName])
  const displayName = displayNames[canonicalName] ?? parsedName.trim()

  return {
    id: `${source}-${slugify(canonicalName)}-${index}`,
    name: displayName,
    canonicalName,
    originalText: cleanedText,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    unit,
    source,
    confidence: isKnown ? 'high' : 'low',
    available: true,
  }
}

export function normalizeIngredientInput(input: string, source: IngredientSource = 'manual') {
  return splitInput(input).map((item, index) => normalizeItem(item, index, source))
}

export function normalizeIngredientDraft(input: IngredientDraft, source: IngredientSource = 'manual'): NormalizedIngredient | undefined {
  const parsed = normalizeIngredientInput(`1 piece ${input.name}`, source)[0]
  if (!parsed || !input.name.trim()) return undefined
  return {
    ...parsed,
    originalText: input.name.trim(),
    quantity: 1,
    unit: 'piece',
  }
}

export function formatIngredientQuantity(item: Pick<NormalizedIngredient, 'quantity' | 'unit'>) {
  return `${item.quantity} ${ingredientInputUnitLabels[item.unit]}`
}

export function formatIngredientInput(items: NormalizedIngredient[]) {
  return items.map((item) => item.quantity === 1 && item.unit === 'piece' ? item.name : `${item.quantity} ${item.unit} ${item.name}`).join(', ')
}

export function isIngredientInputUnit(value: string | null | undefined): value is IngredientInputUnit {
  return Boolean(value && ingredientInputUnits.includes(value as IngredientInputUnit))
}

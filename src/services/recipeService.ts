import { recipeFixtures } from '../data/fixtures.ts'
import type { GenerationRequest, NormalizedIngredient, RecipeService } from '../types/domain.ts'

const aliases: Record<string, string> = {
  itlog: 'egg',
  egg: 'egg',
  kamatis: 'tomato',
  tomato: 'tomato',
  sardinas: 'canned sardines',
  sardine: 'canned sardines',
  pechay: 'pechay',
  'bok choy': 'pechay',
  bawang: 'garlic',
  garlic: 'garlic',
  sibuyas: 'onion',
  onion: 'onion',
  talong: 'eggplant',
  eggplant: 'eggplant',
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
}

function splitInput(input: string) {
  return input
    .replace(/\bmay\b/gi, '')
    .replace(/\bako\b/gi, '')
    .split(/,|\band\b|\bat\b/gi)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeItem(originalText: string, index: number): NormalizedIngredient {
  const lower = originalText.toLowerCase()
  const canonicalName = aliases[lower]
  const confidence = canonicalName ? 'high' : 'low'
  return {
    id: `${canonicalName ?? 'unknown'}-${index}`,
    name: canonicalName ? displayNames[canonicalName] : originalText,
    originalText,
    confidence,
    available: true,
  }
}

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export const mockRecipeService: RecipeService = {
  normalizeIngredients(input) {
    return splitInput(input).map(normalizeItem)
  },

  async generateSuggestions() {
    await wait(350)
    return recipeFixtures
  },

  async getRecipe(recipeId: string) {
    await wait(150)
    return recipeFixtures.find((recipe) => recipe.id === recipeId)
  },
}

export function createDefaultRequest(rawInput: string): GenerationRequest {
  return {
    rawInput,
    ingredients: mockRecipeService.normalizeIngredients(rawInput),
    constraints: {
      servings: 3,
      allergies: [],
      spiceLevel: 'mild',
    },
  }
}

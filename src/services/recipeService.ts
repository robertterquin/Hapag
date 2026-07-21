import { recipeFixtures } from '../data/fixtures.ts'
import { appConfig, hasRecipeGenerationConfig } from '../config/env.ts'
import { adaptRecipeListPayload, adaptRecipePayload } from '../schemas/recipeAdapter.ts'
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

const recipeCache = new Map(recipeFixtures.map((recipe) => [recipe.id, recipe]))

export function cacheRecipe(recipe: ReturnType<typeof adaptRecipePayload>) {
  recipeCache.set(recipe.id, recipe)
}

function normalizeIngredients(input: string) {
  return splitInput(input).map(normalizeItem)
}

async function generateWithFixtures() {
  await wait(350)
  return adaptRecipeListPayload(recipeFixtures)
}

export const mockRecipeService: RecipeService = {
  normalizeIngredients,

  generateSuggestions: generateWithFixtures,

  async getRecipe(recipeId: string) {
    await wait(150)
    const recipe = recipeCache.get(recipeId)
    return recipe ? adaptRecipePayload(recipe) : undefined
  },
}

async function generateWithOpenAI(request: GenerationRequest) {
  const response = await fetch(`${appConfig.supabaseFunctionUrl}/generate-recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: appConfig.supabaseAnonKey,
      Authorization: `Bearer ${appConfig.supabaseAnonKey}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) throw new Error(`Recipe generation failed with status ${response.status}.`)

  const payload: unknown = await response.json()
  if (!payload || typeof payload !== 'object' || !('recipes' in payload)) throw new Error('Recipe generation returned an invalid payload.')

  const recipes = adaptRecipeListPayload(payload.recipes)
  recipes.forEach((recipe) => recipeCache.set(recipe.id, recipe))
  return recipes
}

export const recipeService: RecipeService = {
  normalizeIngredients,

  async generateSuggestions(request) {
    if (!hasRecipeGenerationConfig) return mockRecipeService.generateSuggestions(request)

    try {
      return await generateWithOpenAI(request)
    } catch (error) {
      console.warn('AI generation unavailable; using curated Hapag fixtures.', error)
      return mockRecipeService.generateSuggestions(request)
    }
  },

  async getRecipe(recipeId: string) {
    const cachedRecipe = recipeCache.get(recipeId)
    if (cachedRecipe) return adaptRecipePayload(cachedRecipe)
    return mockRecipeService.getRecipe(recipeId)
  },
}

export function createDefaultRequest(rawInput: string): GenerationRequest {
  return {
    rawInput,
    ingredients: normalizeIngredients(rawInput),
    constraints: {
      servings: 3,
      allergies: [],
      spiceLevel: 'mild',
    },
  }
}

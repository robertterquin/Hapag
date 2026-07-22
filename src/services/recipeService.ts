import { recipeFixtures } from '../data/fixtures.ts'
import { appConfig, hasRecipeGenerationConfig } from '../config/env.ts'
import { normalizeIngredientInput } from '../lib/ingredientParser.ts'
import { adaptRecipeListPayload, adaptRecipePayload } from '../schemas/recipeAdapter.ts'
import type { GenerationRequest, IngredientSource, RecipeService } from '../types/domain.ts'

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

const recipeCache = new Map(recipeFixtures.map((recipe) => [recipe.id, recipe]))

export function cacheRecipe(recipe: ReturnType<typeof adaptRecipePayload>) {
  recipeCache.set(recipe.id, recipe)
}

async function generateWithFixtures() {
  await wait(350)
  return adaptRecipeListPayload(recipeFixtures)
}

export const mockRecipeService: RecipeService = {
  normalizeIngredients(input, source = 'manual') {
    return normalizeIngredientInput(input, source)
  },

  generateSuggestions: generateWithFixtures,

  async getRecipe(recipeId: string) {
    await wait(150)
    const recipe = recipeCache.get(recipeId)
    return recipe ? adaptRecipePayload(recipe) : undefined
  },
}

export class RecipeGenerationError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.status = status
    this.name = 'RecipeGenerationError'
  }
}

async function generateWithOpenAI(request: GenerationRequest, accessToken?: string) {
  const response = await fetch(`${appConfig.supabaseFunctionUrl}/generate-recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: appConfig.supabaseAnonKey,
      Authorization: `Bearer ${accessToken || appConfig.supabaseAnonKey}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) throw new RecipeGenerationError(`Recipe generation failed with status ${response.status}.`, response.status)

  const payload: unknown = await response.json()
  if (!payload || typeof payload !== 'object' || !('recipes' in payload)) throw new Error('Recipe generation returned an invalid payload.')

  const recipes = adaptRecipeListPayload(payload.recipes)
  recipes.forEach((recipe) => recipeCache.set(recipe.id, recipe))
  return recipes
}

export const recipeService: RecipeService = {
  normalizeIngredients(input, source: IngredientSource = 'manual') {
    return normalizeIngredientInput(input, source)
  },

  async generateSuggestions(request, accessToken) {
    if (!hasRecipeGenerationConfig) return mockRecipeService.generateSuggestions(request)

    try {
      return await generateWithOpenAI(request, accessToken)
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
    ingredients: normalizeIngredientInput(rawInput, 'manual'),
    constraints: {
      servings: 3,
      allergies: [],
      spiceLevel: 'mild',
    },
  }
}

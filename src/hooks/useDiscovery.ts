import { useState } from 'react'
import { formatIngredientInput } from '../lib/ingredientParser.ts'
import { recipeService, RecipeGenerationError } from '../services/recipeService.ts'
import { matchRecipeCatalog } from '../services/recipeMatcher.ts'
import type { CatalogRecipeCandidate, DiscoverySession, GenerationConstraints, IngredientDraft, NormalizedIngredient, Recipe } from '../types/domain.ts'
import { normalizeConstraints } from '../lib/recipeControls.ts'

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'

const defaultConstraints: GenerationConstraints = {
  servings: 3,
  allergies: [],
  spiceLevel: 'mild',
}

function dedupeIngredients(ingredients: NormalizedIngredient[]) {
  const merged: NormalizedIngredient[] = []
  for (const ingredient of ingredients) {
    const existing = merged.find((item) => item.canonicalName === ingredient.canonicalName && item.unit === ingredient.unit)
    if (existing) {
      existing.quantity += ingredient.quantity
    } else {
      merged.push(ingredient)
    }
  }
  return merged.map((ingredient, index) => ({ ...ingredient, id: `${ingredient.source}-${ingredient.canonicalName}-${index}` }))
}

export function useDiscovery() {
  const [session, setSession] = useState<DiscoverySession>({ rawInput: '', ingredients: [], constraints: defaultConstraints })
  const [suggestions, setSuggestions] = useState<Recipe[]>([])
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle')
  const [generationError, setGenerationError] = useState<string | null>(null)

  const startDiscovery = (value: string) => {
    setSession((current) => ({ ...current, rawInput: value, ingredients: value ? dedupeIngredients(recipeService.normalizeIngredients(value, 'manual')) : [] }))
    setSuggestions([])
    setGenerationStatus('idle')
    setGenerationError(null)
  }

  const resetDiscovery = () => {
    setSession({ rawInput: '', ingredients: [], constraints: defaultConstraints })
    setSuggestions([])
    setGenerationStatus('idle')
    setGenerationError(null)
  }

  const startFromIngredients = (rawInput: string, ingredients: NormalizedIngredient[]) => {
    setSession((current) => ({ ...current, rawInput, ingredients }))
    setGenerationStatus('idle')
  }

  const updateIngredients = (value: string) => {
    setSession((current) => ({ ...current, rawInput: value, ingredients: dedupeIngredients(recipeService.normalizeIngredients(value, 'manual')) }))
  }

  const addIngredients = (input: IngredientDraft) => {
    const additions = recipeService.normalizeIngredients(input.name, 'manual')
    if (additions.length === 0) return
    setSession((current) => {
      const ingredients = [...current.ingredients]
      for (const addition of additions) {
        const existingIndex = ingredients.findIndex((ingredient) => ingredient.source === 'manual' && ingredient.canonicalName === addition.canonicalName && ingredient.unit === addition.unit)
        if (existingIndex >= 0) {
          ingredients[existingIndex] = { ...ingredients[existingIndex], quantity: ingredients[existingIndex].quantity + addition.quantity }
        } else {
          ingredients.push(addition)
        }
      }
      return { ...current, rawInput: formatIngredientInput(ingredients), ingredients }
    })
    setSuggestions([])
    setGenerationStatus('idle')
    setGenerationError(null)
  }

  const updateConstraints = (patch: Partial<GenerationConstraints>) => {
    setSession((current) => ({ ...current, constraints: normalizeConstraints({ ...current.constraints, ...patch }) }))
  }

  const removeIngredient = (id: string) => {
    setSession((current) => {
      const ingredients = current.ingredients.filter((ingredient) => ingredient.id !== id)
      return { ...current, rawInput: formatIngredientInput(ingredients), ingredients }
    })
    setSuggestions([])
    setGenerationStatus('idle')
    setGenerationError(null)
  }

  const generateSuggestions = async (accessToken?: string) => {
    if (session.ingredients.length === 0) return
    setGenerationStatus('loading')
    setGenerationError(null)
    try {
      const candidateDishes: CatalogRecipeCandidate[] = matchRecipeCatalog(session.ingredients).map(({ dish, score, availableIngredients, missingIngredients }) => ({
        id: dish.id,
        name: dish.name,
        authenticity: dish.authenticity,
        category: dish.category,
        score,
        availableIngredients,
        missingIngredients,
      }))
      const result = await recipeService.generateSuggestions({ rawInput: session.rawInput, ingredients: session.ingredients, constraints: session.constraints, candidateDishes }, accessToken)
      setSuggestions(result)
      setGenerationStatus('success')
    } catch (error) {
      if (error instanceof RecipeGenerationError && error.status === 429) {
        setGenerationError('Naabot na ang limit ng AI generation. Subukan ulit pagkalipas ng ilang minuto.')
      } else if (error instanceof RecipeGenerationError && error.status === 503) {
        setGenerationError('Hindi available ang AI service ngayon. Suriin ang OpenAI at Upstash secrets sa Supabase Edge Function, pagkatapos ay subukan ulit.')
      } else {
        setGenerationError('Hindi nabuo ang mga recipe. Puwede kang mag-retry o bumalik para mag-edit.')
      }
      setGenerationStatus('error')
    }
  }

  return {
    session,
    suggestions,
    generationStatus,
    generationError,
    startDiscovery,
    resetDiscovery,
    startFromIngredients,
    updateIngredients,
    addIngredients,
    updateConstraints,
    removeIngredient,
    generateSuggestions,
  }
}

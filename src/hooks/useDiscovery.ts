import { useState } from 'react'
import { formatPantryInput, normalizeIngredientDraft } from '../lib/ingredientParser.ts'
import { recipeService } from '../services/recipeService.ts'
import type { DiscoverySession, GenerationConstraints, IngredientDraft, NormalizedIngredient, Recipe } from '../types/domain.ts'
import { normalizeConstraints } from '../lib/recipeControls.ts'

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'

const defaultConstraints: GenerationConstraints = {
  servings: 3,
  allergies: [],
  spiceLevel: 'mild',
}

export function useDiscovery() {
  const [session, setSession] = useState<DiscoverySession>({ rawInput: '', ingredients: [], constraints: defaultConstraints })
  const [suggestions, setSuggestions] = useState<Recipe[]>([])
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle')
  const [generationError, setGenerationError] = useState<string | null>(null)

  const startDiscovery = (value: string) => {
    setSession((current) => ({ ...current, rawInput: value, ingredients: value ? recipeService.normalizeIngredients(value, 'manual') : [] }))
    setGenerationStatus('idle')
  }

  const startFromIngredients = (rawInput: string, ingredients: NormalizedIngredient[]) => {
    setSession((current) => ({ ...current, rawInput, ingredients }))
    setGenerationStatus('idle')
  }

  const startFromPantry = (ingredients: NormalizedIngredient[]) => {
    const pantryIngredients = ingredients.map((ingredient) => ({ ...ingredient, source: 'pantry' as const }))
    startFromIngredients(formatPantryInput(pantryIngredients), pantryIngredients)
  }

  const replacePantryIngredients = (items: NormalizedIngredient[]) => {
    setSession((current) => {
      const manualIngredients = current.ingredients.filter((ingredient) => ingredient.source !== 'pantry')
      const pantryIngredients = items.map((item) => ({ ...item, source: 'pantry' as const }))
      const ingredients = [...pantryIngredients, ...manualIngredients]
      return { ...current, rawInput: formatPantryInput(ingredients), ingredients }
    })
    setGenerationStatus('idle')
  }

  const updateIngredients = (value: string) => {
    setSession((current) => ({ ...current, rawInput: value, ingredients: recipeService.normalizeIngredients(value, 'manual') }))
  }

  const addIngredients = (input: IngredientDraft) => {
    const addition = normalizeIngredientDraft(input, 'manual')
    if (!addition) return
    setSession((current) => {
      const ingredients = [...current.ingredients]
      const existingIndex = ingredients.findIndex((ingredient) => ingredient.source === 'manual' && ingredient.canonicalName === addition.canonicalName && ingredient.unit === addition.unit)
      if (existingIndex >= 0) {
        ingredients[existingIndex] = { ...ingredients[existingIndex], quantity: ingredients[existingIndex].quantity + addition.quantity }
      } else {
        ingredients.push(addition)
      }
      return { ...current, rawInput: formatPantryInput(ingredients), ingredients }
    })
  }

  const updateConstraints = (patch: Partial<GenerationConstraints>) => {
    setSession((current) => ({ ...current, constraints: normalizeConstraints({ ...current.constraints, ...patch }) }))
  }

  const removeIngredient = (id: string) => {
    setSession((current) => ({ ...current, ingredients: current.ingredients.filter((ingredient) => ingredient.id !== id) }))
  }

  const generateSuggestions = async () => {
    if (session.ingredients.length === 0) return
    setGenerationStatus('loading')
    setGenerationError(null)
    try {
      const result = await recipeService.generateSuggestions({ rawInput: session.rawInput, ingredients: session.ingredients, constraints: session.constraints })
      setSuggestions(result)
      setGenerationStatus('success')
    } catch {
      setGenerationError('Nandito pa rin ang ingredients mo. Puwede kang mag-retry o bumalik at mag-edit.')
      setGenerationStatus('error')
    }
  }

  return {
    session,
    suggestions,
    generationStatus,
    generationError,
    startDiscovery,
    startFromIngredients,
    startFromPantry,
    replacePantryIngredients,
    updateIngredients,
    addIngredients,
    updateConstraints,
    removeIngredient,
    generateSuggestions,
  }
}

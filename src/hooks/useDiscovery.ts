import { useCallback, useRef, useState } from 'react'
import { formatIngredientInput } from '../lib/ingredientParser.ts'
import { recipeService, RecipeGenerationError } from '../services/recipeService.ts'
import { matchRecipeCatalog } from '../services/recipeMatcher.ts'
import type { CatalogRecipeCandidate, DiscoverySession, GenerationConstraints, IngredientDraft, NormalizedIngredient, Recipe } from '../types/domain.ts'
import { normalizeConstraints } from '../lib/recipeControls.ts'
import type { UserPreferences } from '../services/persistenceService.ts'

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'

const defaultConstraints: GenerationConstraints = {
  servings: 3,
  allergies: [],
  spiceLevel: 'mild',
}

function constraintsFromPreferences(preferences: UserPreferences): GenerationConstraints {
  return normalizeConstraints({
    servings: preferences.default_servings,
    dietaryPreference: preferences.dietary_preference,
    allergies: preferences.allergies,
    spiceLevel: preferences.spice_level,
  })
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
  const preferredConstraints = useRef<GenerationConstraints>(defaultConstraints)
  const [session, setSession] = useState<DiscoverySession>({ rawInput: '', ingredients: [], constraints: defaultConstraints })
  const [suggestions, setSuggestions] = useState<Recipe[]>([])
  const [candidateDishes, setCandidateDishes] = useState<CatalogRecipeCandidate[]>([])
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle')
  const [generationError, setGenerationError] = useState<string | null>(null)

  const startDiscovery = (value: string) => {
    setSession((current) => ({ ...current, rawInput: value, ingredients: value ? dedupeIngredients(recipeService.normalizeIngredients(value, 'manual')) : [] }))
    setSuggestions([])
    setGenerationStatus('idle')
    setGenerationError(null)
  }

  const resetDiscovery = () => {
    setSession({ rawInput: '', ingredients: [], constraints: preferredConstraints.current })
    setSuggestions([])
    setGenerationStatus('idle')
    setGenerationError(null)
  }

  const applyPreferences = useCallback((preferences: UserPreferences) => {
    const nextConstraints = constraintsFromPreferences(preferences)
    preferredConstraints.current = nextConstraints
    setSession((current) => ({ ...current, constraints: nextConstraints }))
  }, [])

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
      const candidateDishes: CatalogRecipeCandidate[] = matchRecipeCatalog(session.ingredients).map(({ dish, score, availableIngredients, missingIngredients, substitutedIngredients }) => ({
        id: dish.id,
        name: dish.name,
        authenticity: dish.authenticity,
        category: dish.category,
        score,
        availableIngredients,
        missingIngredients,
        substitutedIngredients,
      }))
      setCandidateDishes(candidateDishes)
      // Catalog matches improve authenticity, but a partial or unfamiliar
      // combination may still be useful. In that case the Edge Function asks
      // the AI for a clearly labelled Hapag adaptation grounded in the user's
      // ingredients instead of blocking generation.
      const result = await recipeService.generateSuggestions({ rawInput: session.rawInput, ingredients: session.ingredients, constraints: session.constraints, candidateDishes }, accessToken)
      setSuggestions(result)
      setGenerationStatus('success')
    } catch (error) {
      if (error instanceof RecipeGenerationError && error.status === 429) {
        setGenerationError('AI generation limit reached. Please try again in a few minutes.')
      } else if (error instanceof RecipeGenerationError && error.status === 503) {
        setGenerationError('AI service is temporarily unavailable. Please check your Supabase Edge Function secrets and try again.')
      } else {
        setGenerationError('Could not generate recipes. You can try again or edit your ingredients.')
      }
      setGenerationStatus('error')
    }
  }

  return {
    session,
    suggestions,
    candidateDishes,
    generationStatus,
    generationError,
    startDiscovery,
    resetDiscovery,
    applyPreferences,
    startFromIngredients,
    updateIngredients,
    addIngredients,
    updateConstraints,
    removeIngredient,
    generateSuggestions,
  }
}

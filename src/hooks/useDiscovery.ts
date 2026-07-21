import { useState } from 'react'
import { recipeService } from '../services/recipeService.ts'
import type { DiscoverySession, GenerationConstraints, NormalizedIngredient, Recipe } from '../types/domain.ts'
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
    setSession((current) => ({ ...current, rawInput: value, ingredients: value ? recipeService.normalizeIngredients(value) : [] }))
    setGenerationStatus('idle')
  }

  const startFromIngredients = (rawInput: string, ingredients: NormalizedIngredient[]) => {
    setSession((current) => ({ ...current, rawInput, ingredients }))
    setGenerationStatus('idle')
  }

  const updateIngredients = (value: string) => {
    setSession((current) => ({ ...current, rawInput: value, ingredients: recipeService.normalizeIngredients(value) }))
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
    updateIngredients,
    updateConstraints,
    removeIngredient,
    generateSuggestions,
  }
}

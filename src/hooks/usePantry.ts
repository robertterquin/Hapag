import { useState } from 'react'
import { recipeService } from '../services/recipeService.ts'
import type { NormalizedIngredient } from '../types/domain.ts'

export function usePantry() {
  const [pantryItems, setPantryItems] = useState<NormalizedIngredient[]>([])

  const addPantryItem = (value: string) => {
    setPantryItems((items) => {
      const additions = recipeService.normalizeIngredients(value)
      return [...items, ...additions.filter((addition) => !items.some((item) => item.name === addition.name))]
    })
  }

  const removePantryItem = (id: string) => {
    setPantryItems((items) => items.filter((item) => item.id !== id))
  }

  return { pantryItems, addPantryItem, removePantryItem }
}

import type { Recipe } from '../types/domain.ts'
import { validateRecipeList } from '../schemas/recipeSchema.ts'

const available = (id: string, name: string, canonicalName: string, quantity: number | string, unit: Recipe['ingredients'][number]['unit']) => ({
  id,
  name,
  canonicalName,
  quantity,
  unit,
  available: true,
})

const missing = (id: string, name: string, canonicalName: string, quantity: number | string, unit: Recipe['ingredients'][number]['unit'], note?: string) => ({
  id,
  name,
  canonicalName,
  quantity,
  unit,
  available: false,
  note,
})

const rawRecipeFixtures = [
  {
    id: 'sardines-egg-pechay',
    title: 'Sardines with egg and pechay',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=82',
    localTitle: 'Sardinas na may itlog at pechay',
    description: 'A quick and budget-friendly home dish using the ingredients you already have.',
    matchReason: 'The oil from the sardines bastes the pechay as it sautés, so the greens absorb a savory, slightly smoky depth before the egg binds everything into a cohesive, satisfying dish.',
    ingredients: [
      available('sardines', 'Sardines', 'canned sardines', 1, 'can'),
      available('egg', 'Itlog', 'egg', 2, 'piece'),
      available('pechay', 'Pechay', 'pechay', 1, 'bundle'),
      missing('garlic', 'Bawang', 'garlic', 2, 'clove', 'Optional pantry staple'),
      missing('oil', 'Mantika', 'cooking oil', 1, 'tablespoon'),
    ],
    steps: [
      { id: 'sardines-step-1', order: 1, action: 'Sauté the garlic in cooking oil until fragrant and lightly golden.', durationMinutes: 2, heat: 'medium' },
      { id: 'sardines-step-2', order: 2, action: 'Add the canned sardines and pechay. Stir gently until the greens soften.', durationMinutes: 4, heat: 'medium' },
      { id: 'sardines-step-3', order: 3, action: 'Pour in the beaten eggs and stir gently until fully cooked.', durationMinutes: 3, heat: 'low' },
    ],
    servings: 3,
    timeMinutes: 20,
    difficulty: 'Easy',
    estimatedCost: { currency: 'PHP', min: 50, max: 85, confidence: 'low', note: 'Price estimate; varies by location and brand.' },
    costBreakdown: [
      { ingredient: 'Sardines', estimatedCost: 30, available: true },
      { ingredient: 'Eggs', estimatedCost: 24, available: true },
      { ingredient: 'Pechay', estimatedCost: 20, available: true },
      { ingredient: 'Pantry staples', estimatedCost: 10, available: false },
    ],
    substitutions: [
      { id: 'pechay-kangkong', original: 'Pechay', substitute: 'Kangkong', tradeoff: 'Leafier texture and wilts faster.' },
    ],
    tags: ['budget meal', 'quick', 'baon'],
    dietaryNotes: ['Contains fish and egg.'],
    spicyLevel: 'mild',
    source: 'fixture',
    schemaVersion: 'recipe.v1',
  },
  {
    id: 'ginisang-pechay-egg',
    title: 'Ginisang pechay with egg',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=82',
    localTitle: 'Ginisang pechay na may itlog',
    description: 'A simple, quick, and vegetable-centered Filipino home sauté.',
    matchReason: 'The tomatoes break down quickly in the hot pan and become a naturally sweet, acidic base that keeps the pechay bright and tender without overwhelming the delicate vegetable flavors.',
    ingredients: [
      available('pechay', 'Pechay', 'pechay', 1, 'bundle'),
      available('tomato', 'Kamatis', 'tomato', 2, 'piece'),
      available('egg', 'Itlog', 'egg', 2, 'piece'),
      missing('onion', 'Sibuyas', 'onion', 1, 'piece', 'Adds aroma'),
      missing('oil', 'Mantika', 'cooking oil', 1, 'tablespoon'),
    ],
    steps: [
      { id: 'pechay-step-1', order: 1, action: 'Sauté the sliced onions and fresh tomatoes in cooking oil until tender.', durationMinutes: 4, heat: 'medium' },
      { id: 'pechay-step-2', order: 2, action: 'Add the pechay greens and cook until wilted but still crisp-tender.', durationMinutes: 3, heat: 'medium' },
      { id: 'pechay-step-3', order: 3, action: 'Stir in the beaten eggs and season with salt and pepper to taste.', durationMinutes: 3, heat: 'low' },
    ],
    servings: 2,
    timeMinutes: 15,
    difficulty: 'Easy',
    estimatedCost: { currency: 'PHP', min: 35, max: 70, confidence: 'low', note: 'Estimated cost; not a live market price.' },
    costBreakdown: [
      { ingredient: 'Pechay', estimatedCost: 20, available: true },
      { ingredient: 'Kamatis', estimatedCost: 15, available: true },
      { ingredient: 'Itlog', estimatedCost: 24, available: true },
      { ingredient: 'Sibuyas at mantika', estimatedCost: 10, available: false },
    ],
    substitutions: [
      { id: 'pechay-kangkong-2', original: 'Pechay', substitute: 'Kangkong', tradeoff: 'Chewier leaves; add earlier if stems are thick.' },
    ],
    tags: ['vegetable', 'quick', 'budget meal'],
    dietaryNotes: ['Vegetarian if cooked without fish sauce.'],
    spicyLevel: 'mild',
    source: 'fixture',
    schemaVersion: 'recipe.v1',
  },
  {
    id: 'sardine-omelet-tomato',
    title: 'Sardine omelet with tomato',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=82',
    localTitle: 'Tortang sardinas na may kamatis',
    description: 'A flavorful Filipino sardine omelet perfect for quick meals and baon.',
    matchReason: 'Folding sardines directly into the egg batter lets the rich, savory fish flavor distribute evenly throughout, while the diced tomato adds bursts of acidity that cut through the egg and keep each bite balanced.',
    ingredients: [
      available('egg', 'Itlog', 'egg', 3, 'piece'),
      available('sardines', 'Sardinas', 'canned sardines', 1, 'can'),
      available('tomato', 'Kamatis', 'tomato', 1, 'piece'),
      missing('oil', 'Mantika', 'cooking oil', 1, 'tablespoon'),
      missing('pepper', 'Paminta', 'black pepper', 1, 'pinch'),
    ],
    steps: [
      { id: 'omelet-step-1', order: 1, action: 'Beat the eggs in a bowl and mix in the canned sardines, diced tomatoes, and ground black pepper.', durationMinutes: 3, heat: 'none' },
      { id: 'omelet-step-2', order: 2, action: 'Heat cooking oil in a skillet over medium heat and pour in the egg mixture.', durationMinutes: 2, heat: 'medium' },
      { id: 'omelet-step-3', order: 3, action: 'Cook on both sides until golden brown and the egg is fully set.', durationMinutes: 6, heat: 'low' },
    ],
    servings: 3,
    timeMinutes: 18,
    difficulty: 'Easy',
    estimatedCost: { currency: 'PHP', min: 45, max: 80, confidence: 'low', note: 'Price estimate; does not reflect bulk packaging.' },
    costBreakdown: [
      { ingredient: 'Itlog', estimatedCost: 36, available: true },
      { ingredient: 'Sardinas', estimatedCost: 30, available: true },
      { ingredient: 'Kamatis', estimatedCost: 10, available: true },
      { ingredient: 'Mantika at paminta', estimatedCost: 8, available: false },
    ],
    substitutions: [
      { id: 'sardines-tofu', original: 'Sardinas', substitute: 'Tofu', tradeoff: 'Vegetarian alternative with a milder flavor and firmer texture.' },
    ],
    tags: ['quick', 'baon', 'budget meal'],
    dietaryNotes: ['Contains fish and egg.'],
    spicyLevel: 'mild',
    region: 'Filipino home-style',
    source: 'fixture',
    schemaVersion: 'recipe.v1',
  },
]

export const recipeFixtures: Recipe[] = validateRecipeList(rawRecipeFixtures)

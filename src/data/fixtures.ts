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
    matchReason: 'A great way to use the sardines, eggs, and pechay you already have on hand.',
    ingredients: [
      available('sardines', 'Sardines', 'canned sardines', 1, 'can'),
      available('egg', 'Itlog', 'egg', 2, 'piece'),
      available('pechay', 'Pechay', 'pechay', 1, 'bundle'),
      missing('garlic', 'Bawang', 'garlic', 2, 'clove', 'Optional pantry staple'),
      missing('oil', 'Mantika', 'cooking oil', 1, 'tablespoon'),
    ],
    steps: [
      { id: 'sardines-step-1', order: 1, action: 'Igisa ang bawang sa mantika hanggang mabango.', durationMinutes: 2, heat: 'medium' },
      { id: 'sardines-step-2', order: 2, action: 'Idagdag ang sardinas at pechay. Haluin hanggang lumambot ang pechay.', durationMinutes: 4, heat: 'medium' },
      { id: 'sardines-step-3', order: 3, action: 'Ilagay ang binating itlog at haluin hanggang maluto.', durationMinutes: 3, heat: 'low' },
    ],
    servings: 3,
    timeMinutes: 20,
    difficulty: 'Easy',
    estimatedCost: { currency: 'PHP', min: 50, max: 85, confidence: 'low', note: 'Tantya lang ang presyo; nagbabago depende sa lugar at brand.' },
    costBreakdown: [
      { ingredient: 'Sardines', estimatedCost: 30, available: true },
      { ingredient: 'Itlog', estimatedCost: 24, available: true },
      { ingredient: 'Pechay', estimatedCost: 20, available: true },
      { ingredient: 'Pantry staples', estimatedCost: 10, available: false },
    ],
    substitutions: [
      { id: 'pechay-kangkong', original: 'Pechay', substitute: 'Kangkong', tradeoff: 'Mas madahon at mas mabilis lumambot.' },
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
    matchReason: 'Pechay, tomatoes, and eggs take center stage with only basic pantry items needed.',
    ingredients: [
      available('pechay', 'Pechay', 'pechay', 1, 'bundle'),
      available('tomato', 'Kamatis', 'tomato', 2, 'piece'),
      available('egg', 'Itlog', 'egg', 2, 'piece'),
      missing('onion', 'Sibuyas', 'onion', 1, 'piece', 'Adds aroma'),
      missing('oil', 'Mantika', 'cooking oil', 1, 'tablespoon'),
    ],
    steps: [
      { id: 'pechay-step-1', order: 1, action: 'Igisa ang sibuyas at kamatis hanggang lumambot.', durationMinutes: 4, heat: 'medium' },
      { id: 'pechay-step-2', order: 2, action: 'Idagdag ang pechay at lutuin hanggang malanta pero hindi sobra ang lambot.', durationMinutes: 3, heat: 'medium' },
      { id: 'pechay-step-3', order: 3, action: 'Ihalo ang itlog at timplahan ayon sa panlasa.', durationMinutes: 3, heat: 'low' },
    ],
    servings: 2,
    timeMinutes: 15,
    difficulty: 'Easy',
    estimatedCost: { currency: 'PHP', min: 35, max: 70, confidence: 'low', note: 'Estimate lang; hindi live market price.' },
    costBreakdown: [
      { ingredient: 'Pechay', estimatedCost: 20, available: true },
      { ingredient: 'Kamatis', estimatedCost: 15, available: true },
      { ingredient: 'Itlog', estimatedCost: 24, available: true },
      { ingredient: 'Sibuyas at mantika', estimatedCost: 10, available: false },
    ],
    substitutions: [
      { id: 'pechay-kangkong-2', original: 'Pechay', substitute: 'Kangkong', tradeoff: 'Mas chewy ang dahon; idagdag nang mas maaga kung makapal ang tangkay.' },
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
    matchReason: 'Combines eggs, sardines, and fresh tomatoes into an easy home-cooked dish.',
    ingredients: [
      available('egg', 'Itlog', 'egg', 3, 'piece'),
      available('sardines', 'Sardinas', 'canned sardines', 1, 'can'),
      available('tomato', 'Kamatis', 'tomato', 1, 'piece'),
      missing('oil', 'Mantika', 'cooking oil', 1, 'tablespoon'),
      missing('pepper', 'Paminta', 'black pepper', 1, 'pinch'),
    ],
    steps: [
      { id: 'omelet-step-1', order: 1, action: 'Batihin ang itlog at ihalo ang sardinas, kamatis, at paminta.', durationMinutes: 3, heat: 'none' },
      { id: 'omelet-step-2', order: 2, action: 'Painitin ang mantika at ibuhos ang halo sa kawali.', durationMinutes: 2, heat: 'medium' },
      { id: 'omelet-step-3', order: 3, action: 'Lutuin ang magkabilang panig hanggang maluto at mabuo ang itlog.', durationMinutes: 6, heat: 'low' },
    ],
    servings: 3,
    timeMinutes: 18,
    difficulty: 'Easy',
    estimatedCost: { currency: 'PHP', min: 45, max: 80, confidence: 'low', note: 'Tantya lang ang presyo at hindi kasama ang full package purchase cost.' },
    costBreakdown: [
      { ingredient: 'Itlog', estimatedCost: 36, available: true },
      { ingredient: 'Sardinas', estimatedCost: 30, available: true },
      { ingredient: 'Kamatis', estimatedCost: 10, available: true },
      { ingredient: 'Mantika at paminta', estimatedCost: 8, available: false },
    ],
    substitutions: [
      { id: 'sardines-tofu', original: 'Sardinas', substitute: 'Tofu', tradeoff: 'Vegetarian na bersyon, pero magbabago ang lasa at texture.' },
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

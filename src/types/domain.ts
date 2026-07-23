export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type RecipeAuthenticity = 'classic' | 'home-style' | 'hapag-adaptation'

export type IngredientUnit =
  | 'piece'
  | 'can'
  | 'bundle'
  | 'clove'
  | 'cup'
  | 'tablespoon'
  | 'teaspoon'
  | 'pinch'
  | 'gram'
  | 'kilogram'
  | 'block'
  | 'to-taste'

export type IngredientInputUnit =
  | 'piece'
  | 'can'
  | 'pack'
  | 'bottle'
  | 'bundle'
  | 'clove'
  | 'cup'
  | 'gram'
  | 'kilogram'
  | 'block'

export type IngredientSource = 'pantry' | 'manual'

export interface IngredientDraft {
  name: string
}

export interface NormalizedIngredient {
  id: string
  name: string
  canonicalName: string
  originalText: string
  quantity: number
  unit: IngredientInputUnit
  source: IngredientSource
  confidence: 'high' | 'medium' | 'low'
  available: boolean
}

export interface IngredientLine {
  id: string
  name: string
  canonicalName: string
  quantity: number | string
  unit: IngredientUnit
  available: boolean
  note?: string
}

export interface RecipeStep {
  id: string
  order: number
  action: string
  durationMinutes?: number
  heat?: 'low' | 'medium' | 'high' | 'none'
}

export interface RecipeSubstitution {
  id: string
  original: string
  substitute: string
  tradeoff: string
}

export interface CostEstimate {
  currency: 'PHP'
  min: number
  max: number
  confidence: 'low' | 'medium' | 'high'
  note: string
}

export interface CostLine {
  ingredient: string
  estimatedCost: number
  available: boolean
}

export interface Recipe {
  id: string
  title: string
  imageUrl?: string
  localTitle?: string
  description: string
  matchReason: string
  authenticity?: RecipeAuthenticity
  matchScore?: number
  ingredients: IngredientLine[]
  steps: RecipeStep[]
  servings: number
  timeMinutes: number
  difficulty: Difficulty
  estimatedCost: CostEstimate
  costBreakdown: CostLine[]
  substitutions: RecipeSubstitution[]
  tags: string[]
  dietaryNotes: string[]
  region?: string
  spicyLevel: 'mild' | 'medium' | 'hot'
  source: 'fixture' | 'ai'
  schemaVersion: 'recipe.v1'
}

export interface GenerationConstraints {
  servings: number
  budgetLimit?: number
  dietaryPreference?: 'none' | 'vegetarian' | 'low-sodium' | 'diabetic-friendly'
  allergies: string[]
  spiceLevel: 'mild' | 'medium' | 'hot'
}

export interface CatalogRecipeCandidate {
  id: string
  name: string
  authenticity: 'classic' | 'home-style' | 'hapag-adaptation'
  category: string
  score: number
  availableIngredients: string[]
  missingIngredients: string[]
}

export interface GenerationRequest {
  rawInput: string
  ingredients: NormalizedIngredient[]
  constraints: GenerationConstraints
  candidateDishes?: CatalogRecipeCandidate[]
}

export interface DiscoverySession {
  rawInput: string
  ingredients: NormalizedIngredient[]
  constraints: GenerationConstraints
}

export interface RecipeService {
  normalizeIngredients(input: string, source?: IngredientSource): NormalizedIngredient[]
  generateSuggestions(request: GenerationRequest, accessToken?: string): Promise<Recipe[]>
  getRecipe(recipeId: string): Promise<Recipe | undefined>
}

import { z } from 'zod'
import type { Recipe } from '../types/domain.ts'

export const recipeSchemaVersion = 'recipe.v1' as const

const ingredientUnitSchema = z.enum([
  'piece',
  'can',
  'bundle',
  'clove',
  'cup',
  'tablespoon',
  'teaspoon',
  'pinch',
  'gram',
  'kilogram',
  'block',
  'to-taste',
])

const ingredientLineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  canonicalName: z.string().min(1),
  quantity: z.union([z.number().positive(), z.string().min(1)]),
  unit: ingredientUnitSchema,
  available: z.boolean(),
  note: z.string().min(1).optional(),
})

const recipeStepSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  action: z.string().min(8),
  durationMinutes: z.number().int().positive().optional(),
  heat: z.enum(['low', 'medium', 'high', 'none']).optional(),
})

const costEstimateSchema = z.object({
  currency: z.literal('PHP'),
  min: z.number().nonnegative(),
  max: z.number().nonnegative(),
  confidence: z.enum(['low', 'medium', 'high']),
  note: z.string().min(1),
})

const costLineSchema = z.object({
  ingredient: z.string().min(1),
  estimatedCost: z.number().nonnegative(),
  available: z.boolean(),
})

const substitutionSchema = z.object({
  id: z.string().min(1),
  original: z.string().min(1),
  substitute: z.string().min(1),
  tradeoff: z.string().min(8),
})

export const recipeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  imageUrl: z.string().url().optional(),
  localTitle: z.string().min(1).optional(),
  description: z.string().min(12),
  matchReason: z.string().min(12),
  authenticity: z.enum(['classic', 'home-style', 'hapag-adaptation']).optional(),
  matchScore: z.number().int().min(0).max(100).optional(),
  ingredients: z.array(ingredientLineSchema).min(1),
  steps: z.array(recipeStepSchema).min(1),
  servings: z.number().int().positive(),
  timeMinutes: z.number().int().positive(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  estimatedCost: costEstimateSchema,
  costBreakdown: z.array(costLineSchema).min(1),
  substitutions: z.array(substitutionSchema),
  tags: z.array(z.string().min(1)).min(1),
  dietaryNotes: z.array(z.string().min(1)),
  region: z.string().min(1).optional(),
  spicyLevel: z.enum(['mild', 'medium', 'hot']),
  source: z.enum(['fixture', 'ai']),
  schemaVersion: z.literal(recipeSchemaVersion),
}).superRefine((recipe, context) => {
  if (recipe.estimatedCost.min > recipe.estimatedCost.max) {
    context.addIssue({ code: 'custom', path: ['estimatedCost', 'min'], message: 'Minimum cost cannot exceed maximum cost.' })
  }

  const stepOrders = recipe.steps.map((step) => step.order)
  const hasDuplicateStep = new Set(stepOrders).size !== stepOrders.length
  const hasGap = stepOrders.some((order, index) => order !== index + 1)
  if (hasDuplicateStep || hasGap) {
    context.addIssue({ code: 'custom', path: ['steps'], message: 'Steps must use unique consecutive order values starting at 1.' })
  }
})

export type RecipeSchemaOutput = z.infer<typeof recipeSchema>

export class RecipeValidationError extends Error {
  readonly issues: ReadonlyArray<{ path: ReadonlyArray<string | number>; message: string }>

  constructor(issues: ReadonlyArray<{ path: ReadonlyArray<string | number>; message: string }>) {
    super('Recipe data failed validation.')
    this.name = 'RecipeValidationError'
    this.issues = issues
  }
}

function toValidationError(issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>) {
  return new RecipeValidationError(issues.map((issue) => ({ path: issue.path.filter((part): part is string | number => typeof part === 'string' || typeof part === 'number'), message: issue.message })))
}

export function validateRecipe(input: unknown): Recipe {
  const result = recipeSchema.safeParse(input)
  if (!result.success) throw toValidationError(result.error.issues)
  return result.data
}

export function validateRecipeList(input: unknown): Recipe[] {
  const result = z.array(recipeSchema).safeParse(input)
  if (!result.success) throw toValidationError(result.error.issues)
  return result.data
}

export function summarizeValidationError(error: unknown) {
  if (error instanceof RecipeValidationError) {
    return error.issues.map((issue) => `${issue.path.join('.')} ${issue.message}`).join(' ')
  }
  return 'Recipe data could not be validated.'
}

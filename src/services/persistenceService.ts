import type { Session, User } from '@supabase/supabase-js'
import { isPantryUnit } from '../lib/ingredientParser.ts'
import { adaptRecipePayload } from '../schemas/recipeAdapter.ts'
import { cacheRecipe } from './recipeService.ts'
import type { NormalizedIngredient, Recipe } from '../types/domain.ts'
import { supabase } from '../lib/supabase.ts'

export interface UserPreferences {
  language: 'Taglish' | 'Tagalog' | 'English'
  default_servings: number
  dietary_preference: 'none' | 'vegetarian' | 'low-sodium' | 'diabetic-friendly'
  allergies: string[]
  spice_level: 'mild' | 'medium' | 'hot'
}

export interface PersistedRecipeState {
  saved: Recipe[]
  cooked: Recipe[]
}

export interface PantryRow {
  id: string
  ingredient_name: string
  canonical_name: string
  quantity: number | string | null
  unit: string | null
  confidence: 'high' | 'medium' | 'low'
  available: boolean
}

const requireClient = () => {
  if (!supabase) throw new Error('Supabase is not configured. Add the VITE_SUPABASE_* values to .env.local.')
  return supabase
}

export const persistenceService = {
  async getSession(): Promise<Session | null> {
    const client = requireClient()
    const { data, error } = await client.auth.getSession()
    if (error) throw error
    return data.session
  },

  async getUser(): Promise<User | null> {
    const client = requireClient()
    const { data, error } = await client.auth.getUser()
    if (error) throw error
    return data.user
  },

  async signInWithPassword(email: string, password: string) {
    const client = requireClient()
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  async signUp(input: { fullName: string; email: string; password: string }) {
    const client = requireClient()
    const { data, error } = await client.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: { full_name: input.fullName },
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    })
    if (error) throw error
    return { session: data.session }
  },

  async signOut() {
    const client = requireClient()
    const { error } = await client.auth.signOut()
    if (error) throw error
  },

  async loadRecipeState(userId: string): Promise<PersistedRecipeState> {
    const client = requireClient()
    const [savedResult, cookedResult] = await Promise.all([
      client.from('saved_recipes').select('recipe_snapshot').eq('user_id', userId).order('saved_at', { ascending: false }),
      client.from('cooked_events').select('recipe_snapshot').eq('user_id', userId).order('cooked_at', { ascending: false }),
    ])
    if (savedResult.error) throw savedResult.error
    if (cookedResult.error) throw cookedResult.error
    const decode = (rows: Array<{ recipe_snapshot: unknown }> | null) => (rows ?? []).flatMap((row) => {
      try {
        const recipe = adaptRecipePayload(row.recipe_snapshot)
        cacheRecipe(recipe)
        return [recipe]
      } catch {
        return []
      }
    })
    return { saved: decode(savedResult.data), cooked: decode(cookedResult.data) }
  },

  async saveRecipe(userId: string, recipe: Recipe) {
    const client = requireClient()
    const { error } = await client.from('saved_recipes').upsert({
      user_id: userId, recipe_id: recipe.id, title: recipe.title, source: recipe.source,
      recipe_snapshot: recipe, is_favorite: true,
    }, { onConflict: 'user_id,recipe_id' })
    if (error) throw error
  },

  async removeSavedRecipe(userId: string, recipeId: string) {
    const { error } = await requireClient().from('saved_recipes').delete().eq('user_id', userId).eq('recipe_id', recipeId)
    if (error) throw error
  },

  async markCooked(userId: string, recipe: Recipe) {
    const { error } = await requireClient().from('cooked_events').insert({ user_id: userId, recipe_id: recipe.id, recipe_snapshot: recipe, servings: recipe.servings })
    if (error) throw error
  },

  async loadPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await requireClient().from('user_preferences').select('language,default_servings,dietary_preference,allergies,spice_level').eq('user_id', userId).maybeSingle()
    if (error) throw error
    return data as UserPreferences | null
  },

  async savePreferences(userId: string, preferences: UserPreferences) {
    const { error } = await requireClient().from('user_preferences').upsert({ user_id: userId, ...preferences }, { onConflict: 'user_id' })
    if (error) throw error
  },

  async loadPantryItems(userId: string): Promise<NormalizedIngredient[]> {
    const { data, error } = await requireClient().from('pantry_items').select('id,ingredient_name,canonical_name,quantity,unit,confidence,available').eq('user_id', userId).order('created_at', { ascending: true })
    if (error) throw error
    return ((data ?? []) as PantryRow[]).map((row) => ({
      id: row.id,
      name: row.ingredient_name,
      canonicalName: row.canonical_name,
      originalText: row.ingredient_name,
      quantity: typeof row.quantity === 'number' && row.quantity > 0 ? row.quantity : Number(row.quantity) > 0 ? Number(row.quantity) : 1,
      unit: isPantryUnit(row.unit) ? row.unit : 'piece',
      source: 'pantry',
      confidence: row.confidence,
      available: row.available,
    }))
  },

  async savePantryItem(userId: string, item: NormalizedIngredient) {
    const { data, error } = await requireClient().from('pantry_items').upsert({ user_id: userId, ingredient_name: item.name, canonical_name: item.canonicalName, quantity: item.quantity, unit: item.unit, confidence: item.confidence, available: item.available }, { onConflict: 'user_id,canonical_name' }).select('id,ingredient_name,canonical_name,quantity,unit,confidence,available').single()
    if (error) throw error
    const row = data as PantryRow
    return {
      id: row.id,
      name: row.ingredient_name,
      canonicalName: row.canonical_name,
      originalText: row.ingredient_name,
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity ?? 1),
      unit: isPantryUnit(row.unit) ? row.unit : 'piece',
      source: 'pantry',
      confidence: row.confidence,
      available: row.available,
    } satisfies NormalizedIngredient
  },

  async updatePantryItem(userId: string, item: Pick<NormalizedIngredient, 'id' | 'name' | 'canonicalName' | 'quantity' | 'unit' | 'confidence' | 'available'>) {
    const { data, error } = await requireClient().from('pantry_items').update({ ingredient_name: item.name, canonical_name: item.canonicalName, quantity: item.quantity, unit: item.unit, confidence: item.confidence, available: item.available }).eq('id', item.id).eq('user_id', userId).select('id,ingredient_name,canonical_name,quantity,unit,confidence,available').single()
    if (error) throw error
    const row = data as PantryRow
    return {
      id: row.id,
      name: row.ingredient_name,
      canonicalName: row.canonical_name,
      originalText: row.ingredient_name,
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity ?? 1),
      unit: isPantryUnit(row.unit) ? row.unit : 'piece',
      source: 'pantry',
      confidence: row.confidence,
      available: row.available,
    } satisfies NormalizedIngredient
  },

  async removePantryItem(userId: string, itemId: string) {
    const { error } = await requireClient().from('pantry_items').delete().eq('user_id', userId).eq('id', itemId)
    if (error) throw error
  },
}

// Grounding checks that keep AI recipes tied to the ingredients the cook actually has.
// Pure functions with no Deno APIs, so the node test suite can import them directly.
export type JsonRecord = Record<string, unknown>

export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const ingredientAliases: Record<string, string> = {
  bawang: 'garlic',
  sibuyas: 'onion',
  itlog: 'egg',
  eggs: 'egg',
  kamatis: 'tomato',
  tomatoes: 'tomato',
  sardinas: 'sardines',
  manok: 'chicken',
  baboy: 'pork',
  hipon: 'shrimp',
  repolyo: 'cabbage',
  pechay: 'bok choy',
  'bok choy': 'bok choy',
  sampalok: 'tamarind',
  gata: 'coconut milk',
  toyo: 'soy sauce',
  suka: 'vinegar',
}

export function canonicalizeGeneratedIngredient(value: unknown) {
  if (typeof value !== 'string') return undefined
  const cleaned = value.toLowerCase().trim().replace(/[.,!?;:()[\]{}]/g, '').replace(/\s+/g, ' ')
  if (!cleaned) return undefined
  // Aliases and plain names go through the same singular form, so "sardinas" and "sardines" agree.
  return (ingredientAliases[cleaned] ?? cleaned).replace(/s$/, '')
}

function canonicalNameOf(ingredient: JsonRecord) {
  return canonicalizeGeneratedIngredient(ingredient.canonicalName) ?? canonicalizeGeneratedIngredient(ingredient.name)
}

export function getIngredientNames(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.flatMap((ingredient) => {
    if (!isRecord(ingredient)) return []
    const canonical = canonicalNameOf(ingredient)
    return canonical ? [{ canonical, available: ingredient.available === true }] : []
  })
}

export function getProvidedIngredientSet(payload: JsonRecord) {
  return new Set(
    Array.isArray(payload.ingredients)
      ? payload.ingredients.flatMap((ingredient) => {
        if (!isRecord(ingredient)) return []
        const canonical = canonicalNameOf(ingredient)
        return canonical ? [canonical] : []
      })
      : [],
  )
}

export function validateCandidateGrounding(candidateDishes: unknown, providedIngredients: Set<string>) {
  if (!Array.isArray(candidateDishes) || candidateDishes.length === 0 || providedIngredients.size === 0) return false
  return candidateDishes.every((candidate) => {
    if (!isRecord(candidate) || !Array.isArray(candidate.availableIngredients)) return false
    return candidate.availableIngredients.every((ingredient) => {
      const canonical = canonicalizeGeneratedIngredient(ingredient)
      return canonical !== undefined && providedIngredients.has(canonical)
    })
  })
}

// Only ingredients the cook provided may be marked as on hand. The model sometimes marks
// staples like oil or salt as available; clearing the flag keeps the answer truthful
// without discarding three otherwise good recipes.
export function markOnlyProvidedAvailable(recipes: JsonRecord[], payload: JsonRecord) {
  const provided = getProvidedIngredientSet(payload)
  return recipes.map((recipe) => {
    if (!Array.isArray(recipe.ingredients)) return recipe
    return {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => {
        if (!isRecord(ingredient) || ingredient.available !== true) return ingredient
        const canonical = canonicalNameOf(ingredient)
        return canonical && provided.has(canonical) ? ingredient : { ...ingredient, available: false }
      }),
    }
  })
}

const dishKey = (value: unknown) => (typeof value === 'string' ? value.toLowerCase().replace(/[^a-z]/g, '') : '')

function findCandidate(recipe: JsonRecord, candidates: JsonRecord[]) {
  const keys = new Set([dishKey(recipe.id), dishKey(recipe.title), dishKey(recipe.localTitle)].filter(Boolean))
  return candidates.find((candidate) => keys.has(dishKey(candidate.id)) || keys.has(dishKey(candidate.name)))
}

// Each recipe must use at least one provided ingredient. A recipe that is one of the catalog
// candidates must also keep every ingredient that candidate was matched on, so the cook's
// adobo still uses their soy sauce and vinegar. Recipes are checked against their own
// candidate, not the first one, since three different dishes need different ingredients.
export function validateRecipeGrounding(recipes: JsonRecord[], payload: JsonRecord) {
  const providedIngredients = getProvidedIngredientSet(payload)
  if (providedIngredients.size === 0) return false
  const candidates = Array.isArray(payload.candidateDishes) ? payload.candidateDishes.filter(isRecord) : []

  return recipes.every((recipe) => {
    const recipeIngredients = getIngredientNames(recipe.ingredients)
    const recipeNames = new Set(recipeIngredients.map((ingredient) => ingredient.canonical))
    const usesProvidedIngredient = [...providedIngredients].some((ingredient) => recipeNames.has(ingredient))
    const doesNotInventAvailability = recipeIngredients.every((ingredient) => !ingredient.available || providedIngredients.has(ingredient.canonical))

    const candidate = findCandidate(recipe, candidates)
    const required = candidate && Array.isArray(candidate.availableIngredients)
      ? candidate.availableIngredients.flatMap((ingredient) => {
        const canonical = canonicalizeGeneratedIngredient(ingredient)
        return canonical ? [canonical] : []
      })
      : []
    const keepsCandidateIngredients = required.every((ingredient) => recipeNames.has(ingredient))

    return usesProvidedIngredient && doesNotInventAvailability && keepsCandidateIngredients
  })
}

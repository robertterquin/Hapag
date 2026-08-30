import { consumeRateLimit, getRateLimitConfig } from './rateLimit.ts'

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
}

const recipeJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    recipes: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          localTitle: { anyOf: [{ type: 'string' }, { type: 'null' }] },
          description: { type: 'string' },
          matchReason: { type: 'string' },
          authenticity: { enum: ['classic', 'home-style', 'hapag-adaptation'] },
          matchScore: { type: 'integer', minimum: 0, maximum: 100 },
          ingredients: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                canonicalName: { type: 'string' },
                quantity: { anyOf: [{ type: 'number', exclusiveMinimum: 0 }, { type: 'string', minLength: 1 }] },
                unit: { enum: ['piece', 'can', 'bundle', 'clove', 'cup', 'tablespoon', 'teaspoon', 'pinch', 'gram', 'kilogram', 'block', 'to-taste'] },
                available: { type: 'boolean' },
                note: { anyOf: [{ type: 'string' }, { type: 'null' }] },
              },
              required: ['id', 'name', 'canonicalName', 'quantity', 'unit', 'available', 'note'],
            },
          },
          steps: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: { type: 'string' },
                order: { type: 'integer', minimum: 1 },
                action: { type: 'string' },
                durationMinutes: { anyOf: [{ type: 'integer', minimum: 1 }, { type: 'null' }] },
                heat: { anyOf: [{ enum: ['low', 'medium', 'high', 'none'] }, { type: 'null' }] },
              },
              required: ['id', 'order', 'action', 'durationMinutes', 'heat'],
            },
          },
          servings: { type: 'integer', minimum: 1 },
          timeMinutes: { type: 'integer', minimum: 1 },
          difficulty: { enum: ['Easy', 'Medium', 'Hard'] },
          estimatedCost: {
            type: 'object',
            additionalProperties: false,
            properties: {
              currency: { enum: ['PHP'] },
              min: { type: 'number', minimum: 0 },
              max: { type: 'number', minimum: 0 },
              confidence: { enum: ['low', 'medium', 'high'] },
              note: { type: 'string' },
            },
            required: ['currency', 'min', 'max', 'confidence', 'note'],
          },
          costBreakdown: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                ingredient: { type: 'string' },
                estimatedCost: { type: 'number', minimum: 0 },
                available: { type: 'boolean' },
              },
              required: ['ingredient', 'estimatedCost', 'available'],
            },
          },
          substitutions: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: { type: 'string' },
                original: { type: 'string' },
                substitute: { type: 'string' },
                tradeoff: { type: 'string' },
              },
              required: ['id', 'original', 'substitute', 'tradeoff'],
            },
          },
          tags: { type: 'array', items: { type: 'string' }, minItems: 1 },
          dietaryNotes: { type: 'array', items: { type: 'string' } },
          region: { anyOf: [{ type: 'string' }, { type: 'null' }] },
          spicyLevel: { enum: ['mild', 'medium', 'hot'] },
          source: { enum: ['ai'] },
          schemaVersion: { enum: ['recipe.v1'] },
        },
        required: [
          'id', 'title', 'localTitle', 'description', 'matchReason', 'authenticity', 'matchScore', 'ingredients', 'steps',
          'servings', 'timeMinutes', 'difficulty', 'estimatedCost', 'costBreakdown',
          'substitutions', 'tags', 'dietaryNotes', 'region', 'spicyLevel', 'source', 'schemaVersion',
        ],
      },
    },
  },
  required: ['recipes'],
} as const

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isGenerationRequest(value: unknown): value is JsonRecord {
  if (!isRecord(value)) return false
  return typeof value.rawInput === 'string' && Array.isArray(value.ingredients) && isRecord(value.constraints)
}

function responseJson(body: JsonRecord, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, ...extraHeaders } })
}

function getClientIp(request: Request) {
  return request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown'
}

async function hashValue(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function identifyUser(request: Request) {
  const authorization = request.headers.get('Authorization')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!authorization || !supabaseUrl || !anonKey) return undefined

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: authorization },
    })
    if (!response.ok) return undefined
    const user = await response.json() as { id?: unknown }
    return typeof user.id === 'string' ? user.id : undefined
  } catch {
    return undefined
  }
}

function isValidConstraints(value: JsonRecord) {
  const servings = value.servings
  const allergies = value.allergies
  const spiceLevel = value.spiceLevel
  const budgetLimit = value.budgetLimit
  return Number.isInteger(servings) && servings >= 1 && servings <= 20
    && Array.isArray(allergies) && allergies.every((item) => typeof item === 'string')
    && (spiceLevel === 'mild' || spiceLevel === 'medium' || spiceLevel === 'hot')
    && (budgetLimit === undefined || (typeof budgetLimit === 'number' && Number.isFinite(budgetLimit) && budgetLimit >= 0))
}

function isValidCandidateDishes(value: unknown) {
  if (value === undefined) return true
  if (!Array.isArray(value) || value.length > 5) return false
  return value.every((candidate) => {
    if (!isRecord(candidate)) return false
    return typeof candidate.id === 'string'
      && typeof candidate.name === 'string'
      && (candidate.authenticity === 'classic' || candidate.authenticity === 'home-style' || candidate.authenticity === 'hapag-adaptation')
      && typeof candidate.category === 'string'
      && typeof candidate.score === 'number' && Number.isFinite(candidate.score) && candidate.score >= 0 && candidate.score <= 100
      && Array.isArray(candidate.availableIngredients) && candidate.availableIngredients.every((item) => typeof item === 'string')
      && Array.isArray(candidate.missingIngredients) && candidate.missingIngredients.every((item) => typeof item === 'string')
  })
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function extractOutputText(response: unknown) {
  if (!isRecord(response)) return undefined
  if (typeof response.output_text === 'string') return response.output_text

  const output = response.output
  if (!Array.isArray(output)) return undefined
  for (const item of output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue
    for (const content of item.content) {
      if (isRecord(content) && content.type === 'output_text' && typeof content.text === 'string') return content.text
    }
  }
  return undefined
}

function removeNullableFields(recipes: JsonRecord[]) {
  return recipes.map((recipe) => {
    const normalizedRecipe = { ...recipe }
    for (const field of ['localTitle', 'region']) {
      if (normalizedRecipe[field] === null) delete normalizedRecipe[field]
    }

    if (Array.isArray(normalizedRecipe.ingredients)) {
      normalizedRecipe.ingredients = normalizedRecipe.ingredients.map((ingredient) => {
        if (!isRecord(ingredient) || ingredient.note !== null) return ingredient
        const normalizedIngredient = { ...ingredient }
        delete normalizedIngredient.note
        return normalizedIngredient
      })
    }

    if (Array.isArray(normalizedRecipe.steps)) {
      normalizedRecipe.steps = normalizedRecipe.steps.map((step) => {
        if (!isRecord(step)) return step
        const normalizedStep = { ...step }
        if (normalizedStep.durationMinutes === null) delete normalizedStep.durationMinutes
        if (normalizedStep.heat === null) delete normalizedStep.heat
        return normalizedStep
      })
    }
    return normalizedRecipe
  })
}

function getDishCulinaryInsight(title: string): string {
  const lower = title.toLowerCase()
  if (/afritada/i.test(lower)) return 'Simmering the meat in savory tomato sauce creates a rich, hearty sauce that thickens naturally without requiring heavy seasoning.'
  if (/sinigang/i.test(lower)) return 'The savory protein yields a rich broth that balances beautifully with the sharp, mouth-watering sour tamarind soup profile.'
  if (/adobo/i.test(lower)) return 'Braising in soy sauce, vinegar, and garlic tenderizes the meat while reducing into a deeply savory, aromatic glaze.'
  if (/tinola/i.test(lower)) return 'Infusing fresh ginger into the broth highlights the natural sweetness of the meat for a light, comforting soup.'
  if (/menudo|mechado|caldereta/i.test(lower)) return 'The slow tomato braise allows the meat and root vegetables to meld together into a thick, deeply satisfying stew.'
  if (/pochero/i.test(lower)) return 'The combination of savory meat and sweet-tangy tomato broth gives this classic Spanish-Filipino stew its signature comforting depth.'
  if (/kinulob/i.test(lower)) return 'Slow cooking in a tightly covered pot traps steam and aromatics to keep the meat remarkably tender, juicy, and infused with flavor.'
  if (/sarciado|escabeche/i.test(lower)) return 'Sautéing fresh tomatoes and eggs creates a luscious, savory sauce that clings perfectly to the protein.'
  if (/paksiw/i.test(lower)) return 'Simmering with vinegar and aromatics creates a bright, tangy broth that keeps the dish clean, light, and flavorful.'
  if (/nilaga|bulalo/i.test(lower)) return 'Gentle simmering coaxes out rich, pure broth while keeping the leafy greens and vegetables crisp-tender.'
  if (/torta|omelet/i.test(lower)) return 'The egg creates a golden, savory crust that locks in moisture and complements the tender filling perfectly.'
  if (/ginisang|ginisa|guisado/i.test(lower)) return 'A quick, high-heat sauté keeps the vegetables crisp and vibrant while garlic and onions build a fragrant base.'
  if (/pancit|bihon|canton|miki|sotanghon/i.test(lower)) return 'Tossing the noodles in seasoned broth lets them absorb the savory essence of the sautéed meat and vegetables.'
  if (/bistek|steak/i.test(lower)) return 'Marinating in citrus and soy sauce creates a tenderizing, tangy-savory reduction accented by sweet sliced onions.'
  if (/kare-kare/i.test(lower)) return 'A nutty, savory sauce coats the tender meat and greens for a comforting, authentic Filipino classic.'
  if (/pinakbet|pakbet/i.test(lower)) return 'Gently steaming fresh indigenous vegetables allows their natural sweetness and crisp textures to shine through with savory depth.'
  if (/laing|pinangat/i.test(lower)) return 'Simmering leaves slowly in rich coconut milk and chilies creates a velvety, melt-in-your-mouth consistency with gentle heat.'
  if (/inasal/i.test(lower)) return 'Marinating with calamansi, ginger, and garlic infuses the meat with a bright, citrusy aroma that browns beautifully.'
  if (/humba/i.test(lower)) return 'Slow braising with soy sauce, vinegar, and aromatics yields a melt-in-your-mouth tenderness with a rich sweet-savory finish.'
  if (/pesa/i.test(lower)) return 'Simmering with fresh ginger and greens produces a clean, delicately aromatic broth that comforts without feeling heavy.'
  if (/ginataang|gata/i.test(lower)) return 'Simmering gently in coconut milk creates a luscious, creamy sauce that brings out the best in vegetables and proteins.'
  if (/arroz caldo|lugaw|goto/i.test(lower)) return 'Simmering rice with ginger, garlic, and broth creates a deeply comforting, silky porridge perfect for any time of day.'
  if (/monggo|munggo/i.test(lower)) return 'Slow-simmered mung beans break down into a comforting, earthy stew enriched with savory aromatics.'
  return 'A classic home-style preparation where gentle simmering coaxes out rich, comforting flavors with minimal effort.'
}

function sanitizeMatchReasons(recipes: JsonRecord[]) {
  return recipes.map((recipe) => {
    const title = typeof recipe.title === 'string' ? recipe.title : ''
    const matchReason = typeof recipe.matchReason === 'string' ? recipe.matchReason : ''
    if (!matchReason || /(?:candidate|score|\bgrounded\b|from the session|supplied|marked.*available|marks.*as unavailable|availableingredients|missingingredients|preserves.*identity|still needed|natural fit for this dish|already have on hand|minarkahang available)/i.test(matchReason)) {
      return { ...recipe, matchReason: getDishCulinaryInsight(title) }
    }
    return recipe
  })
}

function cleanDishTitle(title: string): string {
  if (!title || typeof title !== 'string') return ''
  const cleaned = title
    // Strip leading prefixes like "Hapag ", "Home-Style ", "Quick ", "Authentic "
    .replace(/^(?:hapag|home-style|quick|authentic)(?:\s+|-|:)\s*/i, '')
    // Strip artificial descriptive suffixes like "na may inihaw-style na bawang", "style na..."
    .replace(/\s+(?:na\s+may|may)\s+[a-z0-9\s-]+style(?:\s+na)?\s+[\w\s]+$/i, '')
    // Strip artificial aromatic compound suffixes like "sa sibuyas at paminta", "sa bawang at sibuyas"
    .replace(/\s+sa\s+(?:sibuyas|bawang|paminta|kamatis|luya|toyo|suka|mantika|asin|gata)(?:\s+(?:at|&)\s+(?:sibuyas|bawang|paminta|kamatis|luya|toyo|suka|mantika|asin|gata))?$/i, '')
    // Strip "with [ingredient] and [ingredient]"
    .replace(/\s+with\s+(?:garlic|onion|pepper|black pepper|ginger|salt|oil|soy sauce|vinegar)(?:\s+(?:and|&)\s+(?:garlic|onion|pepper|black pepper|ginger|salt|oil|soy sauce|vinegar))?$/i, '')
    .trim()

  return cleaned || title
}

function cleanGeneratedRecipeTitles(recipes: JsonRecord[]) {
  return recipes.map((recipe) => {
    const title = typeof recipe.title === 'string' ? cleanDishTitle(recipe.title) : recipe.title
    const localTitle = typeof recipe.localTitle === 'string' ? cleanDishTitle(recipe.localTitle) : recipe.localTitle
    return { ...recipe, title, localTitle }
  })
}

function validateResultComposition(recipes: JsonRecord[], candidateDishes: unknown) {
  const adaptationCount = recipes.filter((recipe) => recipe.authenticity === 'hapag-adaptation').length
  const strongCatalogMatches = Array.isArray(candidateDishes)
    ? candidateDishes.filter((candidate) => isRecord(candidate)
      && (candidate.authenticity === 'classic' || candidate.authenticity === 'home-style')
      && typeof candidate.score === 'number'
      && candidate.score >= 60).length
    : 0

  // Strong catalog matches should not be replaced by several invented
  // variations. Allow one clearly labelled adaptation only when fewer than
  // two strong catalog matches are available.
  const hasCatalogCandidates = Array.isArray(candidateDishes) && candidateDishes.length > 0
  const maximumAdaptations = strongCatalogMatches >= 2 ? 0 : hasCatalogCandidates ? 1 : 3
  return adaptationCount <= maximumAdaptations
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

function canonicalizeGeneratedIngredient(value: unknown) {
  if (typeof value !== 'string') return undefined
  const cleaned = value.toLowerCase().trim().replace(/[.,!?;:()[\]{}]/g, '').replace(/\s+/g, ' ')
  if (!cleaned) return undefined
  return ingredientAliases[cleaned] ?? cleaned.replace(/s$/, '')
}

function getIngredientNames(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.flatMap((ingredient) => {
    if (!isRecord(ingredient)) return []
    const canonical = canonicalizeGeneratedIngredient(ingredient.canonicalName)
      ?? canonicalizeGeneratedIngredient(ingredient.name)
    return canonical ? [{ canonical, available: ingredient.available === true }] : []
  })
}

function getProvidedIngredientSet(payload: JsonRecord) {
  return new Set(
    Array.isArray(payload.ingredients)
      ? payload.ingredients.flatMap((ingredient) => {
        if (!isRecord(ingredient)) return []
        const canonical = canonicalizeGeneratedIngredient(ingredient.canonicalName)
          ?? canonicalizeGeneratedIngredient(ingredient.name)
        return canonical ? [canonical] : []
      })
      : [],
  )
}

function validateCandidateGrounding(candidateDishes: unknown, providedIngredients: Set<string>) {
  if (!Array.isArray(candidateDishes) || candidateDishes.length === 0 || providedIngredients.size === 0) return false
  return candidateDishes.every((candidate) => {
    if (!isRecord(candidate) || !Array.isArray(candidate.availableIngredients)) return false
    return candidate.availableIngredients.every((ingredient) => {
      const canonical = canonicalizeGeneratedIngredient(ingredient)
      return canonical !== undefined && providedIngredients.has(canonical)
    })
  })
}

function validateRecipeGrounding(recipes: JsonRecord[], payload: JsonRecord) {
  const providedIngredients = getProvidedIngredientSet(payload)
  if (providedIngredients.size === 0) return false

  const candidates = Array.isArray(payload.candidateDishes) ? payload.candidateDishes : []
  const primaryCandidate = candidates.find(isRecord)
  const groundedIngredients = primaryCandidate && Array.isArray(primaryCandidate.availableIngredients)
    ? new Set(primaryCandidate.availableIngredients.flatMap((ingredient) => {
      const canonical = canonicalizeGeneratedIngredient(ingredient)
      return canonical ? [canonical] : []
    }))
    : new Set<string>()
  // Catalog-required ingredients must remain in every suggestion. For a
  // no-match custom adaptation, require overlap with the user's ingredients
  // without forcing every variation to use every ingredient in the same way.
  const requiredIngredients = groundedIngredients

  return recipes.every((recipe) => {
    const recipeIngredients = getIngredientNames(recipe.ingredients)
    const recipeNames = new Set(recipeIngredients.map((ingredient) => ingredient.canonical))
    const keepsGroundedIngredients = [...requiredIngredients].every((ingredient) => recipeNames.has(ingredient))
    const usesProvidedIngredient = [...providedIngredients].some((ingredient) => recipeNames.has(ingredient))
    const doesNotInventAvailability = recipeIngredients.every((ingredient) => !ingredient.available || providedIngredients.has(ingredient.canonical))
    return keepsGroundedIngredients && usesProvidedIngredient && doesNotInventAvailability
  })
}

async function handler(request: Request) {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return responseJson({ error: 'Only POST requests are supported.' }, 405)

  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (!apiKey) return responseJson({ error: 'AI generation is not configured.' }, 503)

  const maxInputLength = positiveInteger(Deno.env.get('AI_MAX_INPUT_LENGTH'), 2000)
  const maxIngredients = positiveInteger(Deno.env.get('AI_MAX_INGREDIENTS'), 20)
  const maxBodyLength = 32_000
  let payload: unknown
  try {
    const rawBody = await request.text()
    if (rawBody.length > maxBodyLength) return responseJson({ error: 'Request payload is too large.' }, 413)
    payload = JSON.parse(rawBody)
  } catch {
    return responseJson({ error: 'Request body must be valid JSON.' }, 400)
  }

  if (!isGenerationRequest(payload) || !Array.isArray(payload.ingredients) || payload.ingredients.length === 0) {
    return responseJson({ error: 'At least one ingredient is required.' }, 400)
  }

  const rawInput = typeof payload.rawInput === 'string' ? payload.rawInput : ''
  const constraints = isRecord(payload.constraints) ? payload.constraints : undefined
  if (payload.ingredients.length > maxIngredients) return responseJson({ error: `A maximum of ${maxIngredients} ingredients is allowed.` }, 413)
  if (rawInput.length > maxInputLength) return responseJson({ error: `Ingredient input must be ${maxInputLength} characters or fewer.` }, 413)
  if (!constraints || !isValidConstraints(constraints)) return responseJson({ error: 'Generation constraints are invalid.' }, 400)
  if (!isValidCandidateDishes(payload.candidateDishes)) return responseJson({ error: 'Recipe candidates are invalid.' }, 400)
  if (Array.isArray(payload.candidateDishes) && payload.candidateDishes.length > 0
    && !validateCandidateGrounding(payload.candidateDishes, getProvidedIngredientSet(payload))) {
    return responseJson({ error: 'Recipe candidates are not grounded in the provided ingredients.' }, 400)
  }

  const rateLimitConfig = getRateLimitConfig((name) => Deno.env.get(name))
  const userId = await identifyUser(request)
  if (!userId) {
    const identity = `ip:${await hashValue(getClientIp(request))}`
    const currentWindow = Math.floor(Date.now() / 1000 / rateLimitConfig.windowSeconds)

    try {
      const rateLimit = await consumeRateLimit(`hapag:ai:${identity}:${currentWindow}`, rateLimitConfig.anonymousLimit, rateLimitConfig.windowSeconds, (name) => Deno.env.get(name))
      if (!rateLimit.allowed) return responseJson({ error: 'AI generation rate limit exceeded.' }, 429, { 'Retry-After': String(rateLimit.retryAfterSeconds) })
    } catch (error) {
      console.error('AI rate limiting failed', error instanceof Error ? error.message : 'unknown')
      return responseJson({ error: 'AI generation is temporarily unavailable.' }, 503)
    }
  }

  const model = Deno.env.get('OPENAI_MODEL')
  if (!model) return responseJson({ error: 'OPENAI_MODEL is not configured.' }, 503)

  const reasoningEffort = Deno.env.get('OPENAI_REASONING_EFFORT')
  const openAiRequest = {
    model,
    store: false,
    input: [
      {
        role: 'developer',
        content: [{
          type: 'input_text',
          text: 'You are Hapag, an authentic Filipino cooking assistant. Generate exactly three practical, authentic Filipino recipe choices using the ingredients provided for this cooking session first. Always ground your suggestions in authentic, recognizable Filipino dishes (such as Sinigang, Adobo, Tinola, Pochero, Sarciado, Menudo, Nilaga, Ginataang Isda, Paksiw, Escabeche, Inihaw, Tortang Talong, etc.) using the supplied candidateDishes from the Filipino catalog. Preserve authentic Filipino dish identity. Set authenticity to "classic" for traditional dishes or "home-style" for familiar home-cooked variations; do not create artificial or invented fusion recipes.\n\nCRITICAL DISH NAMING & MATCHING RULES:\n1. TITLES ("title" and "localTitle"): Use clean, authentic, standard Filipino dish names (e.g., "Ginataang Tilapia", "Sarciadong Isda", "Paksiw na Tilapia", "Chicken Adobo", "Pork Sinigang", "Tortang Talong", "Ginisang Monggo").\n2. NEVER invent artificial descriptive compound dish names by appending ingredients or styles:\n   - NEVER generate titles with "sa [ingredient] at [ingredient]" (e.g., DO NOT name a dish "Ginataang Tilapia sa Sibuyas at Paminta" or "Adobong Manok sa Bawang at Toyo").\n   - NEVER generate titles with "na May [Style]-Style na [ingredient]" (e.g., DO NOT name a dish "Ginataang Tilapia na May Inihaw-Style na Bawang" or "Pritong Baboy Style na...").\n   - NEVER generate titles with "with Garlic and Onion" or "with Onion and Pepper".\n3. DIVERSITY ACROSS 3 CHOICES: Each of the 3 recipe suggestions MUST be a DISTINCT, recognized Filipino dish (e.g., if user has Tilapia, Ginger, Garlic, Onion, and Coconut Milk, suggest "Ginataang Tilapia", "Paksiw na Tilapia", and "Sarciadong Tilapia" or "Inihaw na Tilapia"). Do NOT output 3 minor variations of the same dish title!\n4. PROTEIN ACCURACY: NEVER name a dish after a meat or seafood species that was not provided (e.g., if the user provided shrimp/hipon, NEVER name suggestions "Ginataang Pusit" or "Ginataang Tahong" adapted with shrimp! Suggest authentic shrimp dishes like "Ginataang Hipon", "Garlic Butter Shrimp", "Halabos na Hipon", "Sinigang na Hipon", or "Ginataang Kalabasa at Sitaw").\n5. COOKING STEPS ("steps[].action"): ALWAYS write every cooking step action in clear, concise, natural English (e.g., "Heat the cooking oil in a pot over medium heat and sauté the garlic and onions until fragrant."). Every step must be 100% in English.\n6. INGREDIENTS ("ingredients[].name"): Write ingredient names in clear English with standard culinary naming (e.g., Garlic, Onion, Chicken, Tilapia, Pechay / Bok Choy, Cooking Oil, Soy Sauce, Vinegar, Eggs).\n7. SUBSTITUTIONS ("substitutions[].tradeoff"): Write the tradeoff explanation in clear English.\n8. DESCRIPTIONS & MATCH REASONS: Write "description" and "matchReason" in clear, appetizing English. If a home-style variation was made, describe the flavor nuance in the description, NEVER in the dish title. Return only the requested JSON structure.',
        }],
      },
      {
        role: 'developer',
        content: [{
          type: 'input_text',
          text: 'Grounding review: Use the provided ingredients as the basis for every recipe and never mark an unprovided ingredient as available. Ground every suggestion in authentic Filipino cuisine using the supplied candidateDishes from the 150-dish Filipino catalog. Ensure dishes are authentic classic or home-style Filipino ulam.',
        }],
      },
      { role: 'user', content: [{ type: 'input_text', text: JSON.stringify(payload) }] },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'hapag_recipe_list',
        strict: true,
        schema: recipeJsonSchema,
      },
    },
    ...(reasoningEffort ? { reasoning: { effort: reasoningEffort } } : {}),
  }

  try {
    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(openAiRequest),
    })

    if (!openAiResponse.ok) {
      console.error('OpenAI generation failed with status', openAiResponse.status)
      return responseJson({ error: 'AI generation is temporarily unavailable.' }, 502)
    }

    const responseBody: unknown = await openAiResponse.json()
    const outputText = extractOutputText(responseBody)
    if (!outputText) return responseJson({ error: 'AI returned no recipe content.' }, 502)

    const generatedPayload: unknown = JSON.parse(outputText)
    if (!isRecord(generatedPayload) || !Array.isArray(generatedPayload.recipes)) {
      return responseJson({ error: 'AI returned an invalid recipe payload.' }, 502)
    }

    const recipes = generatedPayload.recipes.filter(isRecord)
    if (recipes.length !== 3) {
      return responseJson({ error: 'AI must return exactly three grounded recipes.' }, 502)
    }
    if (!validateResultComposition(recipes, payload.candidateDishes)) {
      return responseJson({ error: 'AI returned too many custom adaptations for the available Filipino dishes.' }, 502)
    }
    if (!validateRecipeGrounding(recipes, payload)) {
      return responseJson({ error: 'AI returned a recipe that was not grounded in the provided ingredients.' }, 502)
    }

    return responseJson({ recipes: sanitizeMatchReasons(removeNullableFields(cleanGeneratedRecipeTitles(recipes))) })
  } catch (error) {
    console.error('Unexpected recipe generation error', error instanceof Error ? error.message : 'unknown error')
    return responseJson({ error: 'AI generation is temporarily unavailable.' }, 502)
  }
}

Deno.serve(handler)

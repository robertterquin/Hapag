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

  const rateLimitConfig = getRateLimitConfig((name) => Deno.env.get(name))
  const userId = await identifyUser(request)
  const identity = userId ? `user:${userId}` : `ip:${await hashValue(getClientIp(request))}`
  const currentWindow = Math.floor(Date.now() / 1000 / rateLimitConfig.windowSeconds)
  const limit = userId ? rateLimitConfig.authenticatedLimit : rateLimitConfig.anonymousLimit

  try {
    const rateLimit = await consumeRateLimit(`hapag:ai:${identity}:${currentWindow}`, limit, rateLimitConfig.windowSeconds, (name) => Deno.env.get(name))
    if (!rateLimit.allowed) return responseJson({ error: 'AI generation rate limit exceeded.' }, 429, { 'Retry-After': String(rateLimit.retryAfterSeconds) })
  } catch (error) {
    console.error('AI rate limiting failed', error instanceof Error ? error.message : 'unknown')
    return responseJson({ error: 'AI generation is temporarily unavailable.' }, 503)
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
          text: 'You are Hapag, a careful Filipino cooking assistant. Generate exactly three practical recipe choices using the ingredients provided for this cooking session first. Prefer the supplied Filipino candidate dishes and preserve their known identity. Set authenticity to classic only for a supplied classic dish, home-style for a familiar variation, or hapag-adaptation for a custom idea. Set matchScore to the candidate match score or a realistic 0–100 estimate. Clearly identify ingredients that are still needed. If adapting a candidate or creating a custom idea, describe it as a Hapag adaptation in matchReason; never present an invented recipe as a classic dish. Use Filipino, English, or Taglish naturally. Estimated PHP costs are approximate only. Respect allergies, dietary preference, servings, budget, and spice level. Do not make medical claims. Every step must be safe, clear, and ordered from 1. Return only the requested JSON structure.',
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

    return responseJson({ recipes: removeNullableFields(generatedPayload.recipes.filter(isRecord)) })
  } catch (error) {
    console.error('Unexpected recipe generation error', error instanceof Error ? error.message : 'unknown error')
    return responseJson({ error: 'AI generation is temporarily unavailable.' }, 502)
  }
}

Deno.serve(handler)

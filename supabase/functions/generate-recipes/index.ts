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
          'id', 'title', 'localTitle', 'description', 'matchReason', 'ingredients', 'steps',
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

function responseJson(body: JsonRecord, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders })
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

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return responseJson({ error: 'Request body must be valid JSON.' }, 400)
  }

  if (!isGenerationRequest(payload) || !Array.isArray(payload.ingredients) || payload.ingredients.length === 0) {
    return responseJson({ error: 'At least one ingredient is required.' }, 400)
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
          text: 'You are Hapag, a careful Filipino cooking assistant. Generate exactly three practical recipe choices using the available ingredients first. Ingredients marked as coming from My Ingredients represent foods the user has available, not measured inventory; never infer or claim an exact quantity. Clearly identify ingredients that are still needed. Use Filipino, English, or Taglish naturally. Estimated PHP costs are approximate only. Respect allergies, dietary preference, servings, budget, and spice level. Do not make medical claims. Every step must be safe, clear, and ordered from 1. Return only the requested JSON structure.',
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

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { test } from 'node:test'

const readSource = (relativePath) => readFile(resolve(process.cwd(), relativePath), 'utf8')

test('Phase 10 includes a server-side recipe generation function', async () => {
  const source = await readSource('supabase/functions/generate-recipes/index.ts')

  assert.match(source, /Deno\.serve\(handler\)/)
  assert.match(source, /OPENAI_API_KEY/)
  assert.match(source, /https:\/\/api\.openai\.com\/v1\/responses/)
  assert.match(source, /schemaVersion: \{ enum: \['recipe\.v1'\] \}/)
  assert.match(source, /source: \{ enum: \['ai'\] \}/)
})

test('browser recipe service falls back when AI is unavailable', async () => {
  const source = await readSource('src/services/recipeService.ts')

  assert.match(source, /hasRecipeGenerationConfig/)
  assert.match(source, /generateWithOpenAI/)
  assert.match(source, /using curated Hapag fixtures/)
  assert.match(source, /adaptRecipeListPayload\(payload\.recipes\)/)
})

test('Phase 10 environment examples separate public and server secrets', async () => {
  const browserEnv = await readSource('.env.example')
  const functionEnv = await readSource('supabase/functions/.env.example')

  assert.match(browserEnv, /VITE_SUPABASE_URL/)
  assert.match(browserEnv, /VITE_SUPABASE_ANON_KEY/)
  assert.doesNotMatch(browserEnv, /OPENAI_API_KEY/)
  assert.match(functionEnv, /OPENAI_API_KEY/)
  assert.match(functionEnv, /OPENAI_REASONING_EFFORT=low/)
})

test('Supabase URL configuration accepts a project base URL and derives the functions path', async () => {
  const source = await readSource('src/config/env.ts')

  assert.match(source, /normalizeSupabaseUrl/)
  assert.match(source, /rest\|functions/)
  assert.match(source, /functions\/v1/)
})

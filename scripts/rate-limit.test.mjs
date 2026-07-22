import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')

test('recipe generation forwards the session token and exposes rate-limit errors', async () => {
  const service = await read('src/services/recipeService.ts')
  const discovery = await read('src/hooks/useDiscovery.ts')
  const app = await read('src/app/App.tsx')

  assert.match(service, /accessToken \|\| appConfig\.supabaseAnonKey/)
  assert.match(discovery, /status === 429/)
  assert.match(app, /auth\.session\?\.access_token/)
})

test('Edge Function validates requests and rate-limits user and IP identities', async () => {
  const functionSource = await read('supabase/functions/generate-recipes/index.ts')
  const limiter = await read('supabase/functions/generate-recipes/rateLimit.ts')
  const env = await read('supabase/functions/.env.example')

  assert.match(functionSource, /AI_MAX_INPUT_LENGTH/)
  assert.match(functionSource, /AI_MAX_INGREDIENTS/)
  assert.match(functionSource, /Retry-After/)
  assert.match(functionSource, /hapag:ai:/)
  assert.match(functionSource, /auth\/v1\/user/)
  assert.match(limiter, /UPSTASH_REDIS_REST_URL/)
  assert.match(limiter, /INCR|incr/)
  assert.match(env, /AI_AUTHENTICATED_LIMIT=10/)
  assert.match(env, /AI_ANONYMOUS_LIMIT=3/)
})

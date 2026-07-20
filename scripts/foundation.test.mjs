import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { test } from 'node:test'

const readSource = (relativePath) => readFile(resolve(process.cwd(), relativePath), 'utf8')

test('route map includes the Phase 4 application destinations', async () => {
  const source = await readSource('src/app/router.ts')

  for (const route of ['/ulam', '/results', '/saved', '/pantry', '/profile', '/auth']) {
    assert.match(source, new RegExp(route.replace('/', '\\/')))
  }

  assert.match(source, /recipeMatch = cleanPath\.match/)
})

test('fixture data exposes the stable recipe contract', async () => {
  const source = await readSource('src/data/fixtures.ts')

  assert.match(source, /export const recipeFixtures: Recipe\[\]/)
  assert.match(source, /sardines-egg-pechay/)
  assert.match(source, /ginisang-pechay-egg/)
  assert.match(source, /sardine-omelet-tomato/)
  assert.match(source, /schemaVersion: 'recipe\.v1'/)
})

test('public environment boundary does not contain secret API key names', async () => {
  const source = await readSource('src/config/env.ts')

  assert.doesNotMatch(source, /OPENAI_API_KEY/)
  assert.match(source, /VITE_SUPABASE_URL/)
  assert.match(source, /VITE_SUPABASE_ANON_KEY/)
})

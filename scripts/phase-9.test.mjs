import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { filipinoRecipeCatalog, validateFilipinoRecipeCatalog } from '../src/data/filipinoRecipeCatalog.ts'
import { normalizeIngredientInput } from '../src/lib/ingredientParser.ts'
import { matchRecipeCatalog, MINIMUM_MATCH_SCORE } from '../src/services/recipeMatcher.ts'

const read = (path) => readFile(path, 'utf8')

test('production catalog and matcher smoke cases remain valid', () => {
  assert.equal(filipinoRecipeCatalog.length, 150)
  assert.doesNotThrow(() => validateFilipinoRecipeCatalog())

  const cases = [
    ['repolyo, canton noodles', 'pancit-canton'],
    ['sampalok, hipon', 'sinigang-na-hipon'],
    ['shrimp, garlic, butter', 'garlic-butter-shrimp'],
    ['pork, peanut butter', 'kare-kare'],
  ]

  for (const [input, expectedId] of cases) {
    const [match] = matchRecipeCatalog(normalizeIngredientInput(input))
    assert.equal(match?.dish.id, expectedId, input)
    assert.ok((match?.score ?? 0) >= MINIMUM_MATCH_SCORE, input)
  }

  assert.deepEqual(matchRecipeCatalog(normalizeIngredientInput('peanut butter, tomato')), [])
})

test('production function keeps JWT verification, grounding, and composition safeguards', async () => {
  const functionSource = await read('supabase/functions/generate-recipes/index.ts')
  const config = await read('supabase/config.toml')

  assert.match(config, /verify_jwt\s*=\s*true/)
  assert.match(functionSource, /validateRecipeGrounding/)
  assert.match(functionSource, /validateResultComposition/)
  assert.match(functionSource, /maximumAdaptations = strongCatalogMatches >= 2 \? 0 : 1/)
  assert.match(functionSource, /AI_MAX_INGREDIENTS/)
  assert.match(functionSource, /AI_MAX_INPUT_LENGTH/)
})

test('production environment boundary contains no browser-exposed server secrets', async () => {
  const browserEnv = await read('.env.example')
  const functionEnv = await read('supabase/functions/.env.example')

  assert.doesNotMatch(browserEnv, /OPENAI_API_KEY|UPSTASH_REDIS_REST_TOKEN/)
  assert.match(functionEnv, /OPENAI_API_KEY=/)
  assert.match(functionEnv, /UPSTASH_REDIS_REST_TOKEN=/)
  assert.match(functionEnv, /AI_ANONYMOUS_LIMIT=3/)
})

test('production documentation includes deployment and security checks', async () => {
  const readme = await read('README.md')
  assert.match(readme, /Authenticated users are not subject to the anonymous AI quota/)
  assert.match(readme, /Row Level Security protects user-owned recipes/)
  assert.match(readme, /production checklist/i)
})

test('catalog matches are preferred while no-match input can still reach AI fallback', async () => {
  const discovery = await read('src/hooks/useDiscovery.ts')
  assert.match(discovery, /partial or unfamiliar/)
  assert.doesNotMatch(discovery, /candidateDishes\.length === 0/)
  assert.match(discovery, /recipeService\.generateSuggestions/) 
})

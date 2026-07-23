import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(path, 'utf8')

test('discovery sends ranked Filipino candidates with the generation request', async () => {
  const source = await read('src/hooks/useDiscovery.ts')
  assert.match(source, /matchRecipeCatalog\(session\.ingredients\)/)
  assert.match(source, /candidateDishes/)
  assert.match(source, /availableIngredients/)
  assert.match(source, /missingIngredients/)
})

test('Edge Function validates and grounds generation with candidate dishes', async () => {
  const source = await read('supabase/functions/generate-recipes/index.ts')
  assert.match(source, /isValidCandidateDishes/)
  assert.match(source, /candidate\.authenticity/)
  assert.match(source, /Prefer the supplied Filipino candidate dishes/)
  assert.match(source, /Hapag adaptation in matchReason/)
})

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
  assert.match(source, /Prefer the highest-overlap supplied Filipino candidate dishes/)
  assert.match(source, /Every suggestion MUST use every ingredient listed in the first candidate availableIngredients/)
  assert.match(source, /distinctive user ingredient such as peanut butter/)
  assert.match(source, /Hapag adaptation in matchReason/)
  assert.match(source, /validateResultComposition/)
  assert.match(source, /Return at most one hapag-adaptation/)
  assert.match(source, /strongCatalogMatches >= 2/)
  assert.match(source, /hasCatalogCandidates/)
  assert.match(source, /hasCatalogCandidates \? 1 : 3/)
  assert.match(source, /too many custom adaptations/)
  assert.match(source, /validateRecipeGrounding/)
  assert.match(source, /validateCandidateGrounding/)
  assert.match(source, /Recipe candidates are not grounded in the provided ingredients/)
  assert.match(source, /use the provided ingredients as the basis for every recipe/)
  assert.match(source, /AI must return exactly three grounded recipes/)
  assert.match(source, /doesNotInventAvailability/)
  assert.match(source, /not grounded in the provided ingredients/)
  assert.match(source, /all three results may be clearly labelled Hapag adaptations/)
  assert.match(source, /removeRedundantAdaptationPrefix/)
  assert.match(source, /Do not put Hapag in the title of an adaptation/)
})

test('client adapter removes legacy adaptation title prefixes', async () => {
  const source = await read('src/schemas/recipeAdapter.ts')
  assert.match(source, /removeAdaptationTitlePrefix/)
  assert.match(source, /recipe\.authenticity !== 'hapag-adaptation'/)
  assert.match(source, /replace\(\/\^\(\?:hapag/)
})

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
  const source = await read('supabase/functions/generate-recipes/index.ts') + await read('supabase/functions/generate-recipes/grounding.ts')
  assert.match(source, /isValidCandidateDishes/)
  assert.match(source, /candidate\.authenticity/)
  assert.match(source, /Generate exactly three practical, authentic Filipino recipe choices/)
  assert.match(source, /using the supplied candidateDishes from the Filipino catalog/)
  assert.match(source, /do not create artificial or invented fusion recipes/)
  assert.match(source, /NEVER name a dish after a meat or seafood species that was not provided/)
  assert.match(source, /validateResultComposition/)
  assert.match(source, /strongCatalogMatches >= 2/)
  assert.match(source, /hasCatalogCandidates/)
  assert.match(source, /hasCatalogCandidates \? 1 : 3/)
  assert.match(source, /too many custom adaptations/)
  assert.match(source, /validateRecipeGrounding/)
  assert.match(source, /validateCandidateGrounding/)
  assert.match(source, /Recipe candidates are not grounded in the provided ingredients/)
  assert.match(source, /Use the provided ingredients as the basis for every recipe and never mark an unprovided ingredient as available/)
  assert.match(source, /AI must return exactly three grounded recipes/)
  assert.match(source, /doesNotInventAvailability/)
  assert.match(source, /not grounded in the provided ingredients/)
  assert.match(source, /cleanGeneratedRecipeTitles/)
  assert.match(source, /sanitizeMatchReasons/)
})

test('client adapter removes legacy adaptation title prefixes', async () => {
  const { cleanDishTitle } = await import('../src/schemas/recipeAdapter.ts')
  assert.equal(cleanDishTitle('Hapag: Chicken Adobo'), 'Chicken Adobo')
  assert.equal(cleanDishTitle('Hapag Sinigang na Baboy'), 'Sinigang na Baboy')
  assert.equal(cleanDishTitle('Home-style Tortang Talong'), 'Tortang Talong')
})

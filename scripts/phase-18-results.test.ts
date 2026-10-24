import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { dishPhotos } from '../src/data/dishPhotos.ts'
import { filipinoRecipeCatalog } from '../src/data/filipinoRecipeCatalog.ts'
import { recipeFixtures } from '../src/data/fixtures.ts'
import { getDishIcon, getDishPhoto } from '../src/lib/dishPhotoLookup.ts'
import { getIngredientStatus, isPantryStaple } from '../src/lib/pantryStaples.ts'
import { buildDishIdeas, suggestUnlockIngredient } from '../src/lib/catalogIdeas.ts'
import { normalizeIngredientInput } from '../src/lib/ingredientParser.ts'

test('every dish photo belongs to a catalog dish and carries a free licence and credit', () => {
  const catalogIds = new Set(filipinoRecipeCatalog.map((dish) => dish.id))
  const entries = Object.entries(dishPhotos)
  assert.ok(entries.length >= 40)
  for (const [dishId, photo] of entries) {
    assert.ok(catalogIds.has(dishId), `${dishId} is a catalog dish`)
    assert.match(photo.src, /^https:\/\/((upload|thumb)\.wikimedia\.org\/[^?]+|images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg\?auto=compress&cs=tinysrgb&w=960)$/, dishId)
    assert.match(photo.sourceUrl, /^https:\/\/(commons\.wikimedia\.org\/wiki\/File:|www\.pexels\.com\/photo\/)/, dishId)
    assert.match(photo.license, /^(CC0|CC BY(-SA)? [0-9.]+|Pexels License)$/, dishId)
    assert.ok(photo.author.trim().length > 0, `${dishId} has an author`)
  }
  assert.equal(new Set(entries.map(([, photo]) => photo.src)).size, entries.length, 'no photo is reused for two dishes')
})

test('photos are matched by exact dish name only', () => {
  assert.equal(getDishPhoto({ title: 'Chicken Adobo' }), dishPhotos['chicken-adobo'])
  assert.equal(getDishPhoto({ title: 'Something else', localTitle: 'Adobong Manok' }), dishPhotos['chicken-adobo'])
  assert.equal(getDishPhoto({ id: 'sinigang-na-baboy', title: 'Anything' }), dishPhotos['sinigang-na-baboy'])
  assert.equal(getDishPhoto({ title: 'Adobong Manok sa Gata' }), dishPhotos['adobong-manok-sa-gata'])
  assert.equal(getDishPhoto({ title: 'Sarciadong Tilapia' }), undefined)
  assert.equal(getDishPhoto({ title: 'Pancit Bihon' }), undefined)
})

test('sample recipes no longer use unrelated stock photos', async () => {
  assert.ok(recipeFixtures.every((recipe) => recipe.imageUrl === undefined))
  const fixtures = await readFile('src/data/fixtures.ts', 'utf8')
  assert.doesNotMatch(fixtures, /unsplash/)
})

test('pantry staples are recognised in English and Tagalog and never shown as missing', () => {
  assert.equal(isPantryStaple('Bawang'), true)
  assert.equal(isPantryStaple('cooking oil'), true)
  assert.equal(isPantryStaple('Mantika'), true)
  assert.equal(isPantryStaple('chicken'), false)
  assert.equal(getIngredientStatus({ name: 'Bawang', canonicalName: 'bawang', available: false }), 'staple')
  assert.equal(getIngredientStatus({ name: 'Tamarind', canonicalName: 'tamarind', available: false }), 'missing')
  assert.equal(getIngredientStatus({ name: 'Bawang', canonicalName: 'bawang', available: true }), 'have')
})

test('catalog dish ideas cover the no-AI path for an adobo pantry', () => {
  const ideas = buildDishIdeas(normalizeIngredientInput('chicken, soy sauce, vinegar, garlic, potato'))
  assert.ok(ideas.length > 0)
  assert.equal(ideas[0].id, 'chicken-adobo')
  for (const idea of ideas) {
    assert.ok(idea.missing.every((item) => !isPantryStaple(item)), `${idea.id} lists no staples as missing`)
  }
})

test('empty results suggest the one ingredient that unlocks the most dishes', () => {
  const unlock = suggestUnlockIngredient(normalizeIngredientInput('peanut butter, tomato'))
  assert.ok(unlock)
  assert.ok(unlock.gain > 0)
  const [parsed] = normalizeIngredientInput(unlock.name)
  assert.notEqual(parsed.canonicalName, 'tomato')
})

test('sample recipes only match when every on-hand ingredient was provided', async () => {
  const service = await readFile('src/services/recipeService.ts', 'utf8')
  assert.match(service, /onHand\.length > 0 && onHand\.every\(/)
  assert.doesNotMatch(service, /recipe\.ingredients\.some\(/)
})

test('results fall back to catalog ideas when AI is missing or fails', async () => {
  const discovery = await readFile('src/hooks/useDiscovery.ts', 'utf8')
  const results = await readFile('src/pages/ResultsPage.tsx', 'utf8')
  assert.match(discovery, /setIdeas\(buildDishIdeas\(session\.ingredients\)\)/)
  assert.match(discovery, /hasRecipeGenerationConfig \? null : 'not-configured'/)
  assert.match(discovery, /setFallback\('error'\)/)
  assert.match(results, /<DishIdeaCard/)
  assert.match(results, /suggestUnlockIngredient/)
})

test('dishes without a photo get a tile icon from their dish type', () => {
  assert.equal(getDishIcon({ id: 'sinigang-na-isda', title: 'Sinigang na Isda' }), '🍲')
  assert.equal(getDishIcon({ title: 'Pancit Bihon' }), '🍜')
  assert.equal(getDishIcon({ title: 'Something the AI invented' }), '🍽️')
})

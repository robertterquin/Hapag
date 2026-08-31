import assert from 'node:assert/strict'
import test from 'node:test'
import { getMascotLoadingBanter } from '../src/lib/mascotBanter.ts'
import { normalizeIngredientInput } from '../src/lib/ingredientParser.ts'

test('mascot banter recognizes adobo combinations', () => {
  const ingredients = normalizeIngredientInput('manok, toyo, suka, bawang')
  const banters = getMascotLoadingBanter(ingredients)
  assert.ok(banters.length >= 2)
  assert.equal(banters[0].tag, 'Adobo Vibe')
  assert.ok(banters[0].headline.includes('Adobo'))
})

test('mascot banter recognizes sinigang and sour soup combinations', () => {
  const ingredients = normalizeIngredientInput('baboy, sampalok, kangkong, kamatis')
  const banters = getMascotLoadingBanter(ingredients)
  assert.ok(banters.length >= 2)
  assert.equal(banters[0].tag, 'Sour Soup')
  assert.ok(banters[0].headline.toLowerCase().includes('sour') || banters[0].headline.toLowerCase().includes('tamarind'))
})

test('mascot banter recognizes fish and tomato sarciado combinations', () => {
  const ingredients = normalizeIngredientInput('tilapia, kamatis, sibuyas, itlog')
  const banters = getMascotLoadingBanter(ingredients)
  assert.ok(banters.length >= 2)
  assert.equal(banters[0].tag, 'Fresh Catch')
  assert.ok(banters[0].headline.includes('Sarciado') || banters[0].headline.includes('fish'))
})

test('mascot banter recognizes coconut milk ginataan combinations', () => {
  const ingredients = normalizeIngredientInput('gata, sitaw, kalabasa, sili')
  const banters = getMascotLoadingBanter(ingredients)
  assert.ok(banters.length >= 2)
  assert.equal(banters[0].tag, 'Creamy Ginataan')
})

test('mascot banter recognizes canned goods budget upgrades', () => {
  const ingredients = normalizeIngredientInput('sardinas, itlog, pechay')
  const banters = getMascotLoadingBanter(ingredients)
  assert.ok(banters.length >= 2)
  assert.equal(banters[0].tag, 'Pantry Upgrade')
})

test('mascot banter falls back gracefully for generic or single ingredients', () => {
  const banters = getMascotLoadingBanter([])
  assert.ok(banters.length >= 2)
  assert.equal(banters[0].tag, "Chef's Kitchen")
})


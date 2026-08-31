import assert from 'node:assert/strict'
import test from 'node:test'
import { specializeDishTitle, adaptRecipePayload } from '../src/schemas/recipeAdapter.ts'

test('specializeDishTitle specializes generic fish dishes when tilapia is provided', () => {
  const ingredients = [{ name: 'Tilapia', canonicalName: 'tilapia' }]

  assert.equal(specializeDishTitle('Sarciadong Isda', ingredients), 'Sarciadong Tilapia')
  assert.equal(specializeDishTitle('Paksiw na Isda', ingredients), 'Paksiw na Tilapia')
  assert.equal(specializeDishTitle('Inihaw na Isda', ingredients), 'Inihaw na Tilapia')
  assert.equal(specializeDishTitle('Sinigang na Isda', ingredients), 'Sinigang na Tilapia')
  assert.equal(specializeDishTitle('Tinolang Isda', ingredients), 'Tinolang Tilapia')
  assert.equal(specializeDishTitle('Pesang Isda', ingredients), 'Pesang Tilapia')
  assert.equal(specializeDishTitle('Daing na Isda', ingredients), 'Daing na Tilapia')
  assert.equal(specializeDishTitle('Kilawing Isda', ingredients), 'Kilawing Tilapia')
  assert.equal(specializeDishTitle('Escabeche', ingredients), 'Escabecheng Tilapia')
  assert.equal(specializeDishTitle('Escabecheng Isda', ingredients), 'Escabecheng Tilapia')
  assert.equal(specializeDishTitle('Ginataang Isda', ingredients), 'Ginataang Tilapia')
  assert.equal(specializeDishTitle('Fish Sarciado', ingredients), 'Tilapia Sarciado')
  assert.equal(specializeDishTitle('Grilled Fish', ingredients), 'Grilled Tilapia')
})

test('specializeDishTitle specializes generic fish dishes for bangus, galunggong, salmon, and tanigue', () => {
  assert.equal(
    specializeDishTitle('Sinigang na Isda', [{ name: 'Bangus', canonicalName: 'bangus' }]),
    'Sinigang na Bangus'
  )
  assert.equal(
    specializeDishTitle('Sarciadong Isda', [{ name: 'Milkfish', canonicalName: 'milkfish' }]),
    'Sarciadong Bangus'
  )
  assert.equal(
    specializeDishTitle('Paksiw na Isda', [{ name: 'Galunggong', canonicalName: 'galunggong' }]),
    'Paksiw na Galunggong'
  )
  assert.equal(
    specializeDishTitle('Sinigang na Isda', [{ name: 'Salmon', canonicalName: 'salmon' }]),
    'Sinigang na Salmon'
  )
  assert.equal(
    specializeDishTitle('Kilawing Isda', [{ name: 'Tanigue', canonicalName: 'tanigue' }]),
    'Kilawing Tanigue'
  )
})

test('specializeDishTitle specializes generic vegetable dishes', () => {
  assert.equal(
    specializeDishTitle('Ginisang Gulay', [{ name: 'Pechay', canonicalName: 'pechay' }]),
    'Ginisang Pechay'
  )
  assert.equal(
    specializeDishTitle('Ginisang Gulay', [{ name: 'Sayote', canonicalName: 'sayote' }]),
    'Ginisang Sayote'
  )
  assert.equal(
    specializeDishTitle('Ginisang Gulay', [{ name: 'Upo', canonicalName: 'upo' }]),
    'Ginisang Upo'
  )
  assert.equal(
    specializeDishTitle('Ginisang Gulay', [{ name: 'Ampalaya', canonicalName: 'ampalaya' }]),
    'Ginisang Ampalaya'
  )
  assert.equal(
    specializeDishTitle('Ginataang Gulay', [{ name: 'Langka', canonicalName: 'langka' }]),
    'Ginataang Langka'
  )
  assert.equal(
    specializeDishTitle('Ginataang Gulay', [{ name: 'Puso ng Saging', canonicalName: 'puso ng saging' }]),
    'Ginataang Puso ng Saging'
  )
  assert.equal(
    specializeDishTitle('Ginataang Gulay', [
      { name: 'Kalabasa', canonicalName: 'squash' },
      { name: 'Sitaw', canonicalName: 'string beans' },
    ]),
    'Ginataang Kalabasa at Sitaw'
  )
})

test('specializeDishTitle specializes pork cuts', () => {
  assert.equal(
    specializeDishTitle('Inihaw na Baboy', [{ name: 'Liempo', canonicalName: 'pork belly' }]),
    'Inihaw na Liempo'
  )
})

test('adaptRecipePayload automatically specializes dish titles on payload adaptation', () => {
  const rawPayload = {
    id: 'test-recipe-1',
    title: 'Sarciadong Isda',
    localTitle: 'Sarciadong Isda',
    description: 'A classic Filipino dish with fish and egg.',
    matchReason: 'Classic match for ingredients.',
    authenticity: 'classic',
    matchScore: 92,
    ingredients: [
      { id: 'i1', name: 'Tilapia', canonicalName: 'tilapia', quantity: 2, unit: 'piece', available: true },
      { id: 'i2', name: 'Tomato', canonicalName: 'tomato', quantity: 2, unit: 'piece', available: true },
      { id: 'i3', name: 'Egg', canonicalName: 'egg', quantity: 1, unit: 'piece', available: true },
    ],
    steps: [
      { id: 's1', order: 1, action: 'Pan-fry the tilapia until golden.', durationMinutes: 8, heat: 'medium' },
      { id: 's2', order: 2, action: 'Sauté tomatoes and add beaten egg.', durationMinutes: 5, heat: 'medium' },
    ],
    servings: 4,
    timeMinutes: 25,
    difficulty: 'Easy',
    estimatedCost: { currency: 'PHP', min: 180, max: 260, confidence: 'high', note: 'Based on wet market prices.' },
    costBreakdown: [
      { ingredient: 'Tilapia', estimatedCost: 160, available: true },
      { ingredient: 'Tomato', estimatedCost: 20, available: true },
    ],
    substitutions: [],
    tags: ['Filipino', 'Seafood'],
    dietaryNotes: [],
    region: 'Luzon',
    spicyLevel: 'mild',
    source: 'ai',
    schemaVersion: 'recipe.v1',
  }

  const recipe = adaptRecipePayload(rawPayload)
  assert.equal(recipe.title, 'Sarciadong Tilapia')
  assert.equal(recipe.localTitle, 'Sarciadong Tilapia')
})

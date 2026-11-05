import assert from 'node:assert/strict'
import { test } from 'node:test'
import { filipinoRecipeCatalog } from '../src/data/filipinoRecipeCatalog.ts'
import { fitsDietAndAllergies } from '../src/lib/dietFilter.ts'

const dish = (id: string) => {
  const found = filipinoRecipeCatalog.find((entry) => entry.id === id)
  assert.ok(found, `catalog has ${id}`)
  return found
}
const allowed = (allergies: string[], dietaryPreference?: 'vegetarian') => filipinoRecipeCatalog.filter((entry) => fitsDietAndAllergies(entry, { allergies, dietaryPreference }))

test('a peanut allergy, typed in English or Tagalog, removes peanut dishes', () => {
  for (const word of ['peanuts', 'mani', 'nuts']) {
    assert.ok(allowed([word]).every((entry) => ![...entry.requiredIngredients, ...entry.optionalIngredients].includes('peanut butter')), word)
  }
  assert.equal(fitsDietAndAllergies(dish('chicken-adobo'), { allergies: ['peanuts'] }), true)
})

test('shellfish and seafood allergies cover shrimp paste and fish sauce', () => {
  const ingredientsOf = (entries: typeof filipinoRecipeCatalog) => new Set(entries.flatMap((entry) => [...entry.requiredIngredients, ...entry.optionalIngredients]))
  assert.equal(ingredientsOf(allowed(['hipon'])).has('shrimp paste'), false)
  assert.equal(ingredientsOf(allowed(['seafood'])).has('fish sauce'), false)
})

test('vegetarian drops meat and fish dishes but keeps vegetable ones', () => {
  const vegetarian = allowed([], 'vegetarian')
  assert.equal(vegetarian.some((entry) => entry.id === 'chicken-adobo'), false)
  assert.ok(vegetarian.length > 0)
  assert.equal(allowed([]).length, filipinoRecipeCatalog.length)
})

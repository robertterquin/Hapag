import assert from 'node:assert/strict'
import test from 'node:test'
import { filipinoRecipeCatalog, validateFilipinoRecipeCatalog } from '../src/data/filipinoRecipeCatalog.ts'

test('Filipino catalog contains exactly 50 unique dishes', () => {
  assert.equal(filipinoRecipeCatalog.length, 50)
  assert.equal(new Set(filipinoRecipeCatalog.map((dish) => dish.id)).size, 50)
  assert.equal(new Set(filipinoRecipeCatalog.map((dish) => dish.name)).size, 50)
})

test('catalog entries contain matching metadata and valid substitutions', () => {
  assert.doesNotThrow(() => validateFilipinoRecipeCatalog())
  for (const dish of filipinoRecipeCatalog) {
    assert.ok(dish.requiredIngredients.length > 0)
    assert.ok(dish.description)
    assert.ok(['classic', 'home-style', 'hapag-adaptation'].includes(dish.authenticity))
    assert.ok(dish.commonSubstitutions.every((item) => item.ingredient && item.substitute && item.note))
  }
})

test('catalog validation rejects duplicate dishes and empty ingredients', () => {
  assert.throws(() => validateFilipinoRecipeCatalog([...filipinoRecipeCatalog, filipinoRecipeCatalog[0]]), /Expected 50/)
  const invalid = filipinoRecipeCatalog.map((dish, index) => index === 0
    ? { ...dish, requiredIngredients: [''] }
    : dish)
  assert.throws(() => validateFilipinoRecipeCatalog(invalid), /empty ingredient/)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeIngredientInput } from '../src/lib/ingredientParser.ts'
import { matchRecipeCatalog } from '../src/services/recipeMatcher.ts'
import { getIngredientGroup } from '../src/data/ingredientGroups.ts'

test('matcher ranks Chicken Adobo for matching chicken ingredients', () => {
  const ingredients = normalizeIngredientInput('manok, bawang, toyo, suka')
  const [match] = matchRecipeCatalog(ingredients)

  assert.equal(match.dish.id, 'chicken-adobo')
  assert.equal(match.score, 80)
  assert.equal(match.kind, 'strong-match')
  assert.deepEqual(match.availableIngredients, ['chicken', 'garlic', 'soy sauce', 'vinegar'])
  assert.deepEqual(match.missingIngredients, [])
})

test('matcher reports missing ingredients for partial dishes', () => {
  const ingredients = normalizeIngredientInput('manok, bawang, toyo')
  const [match] = matchRecipeCatalog(ingredients)

  assert.equal(match.dish.id, 'chicken-adobo')
  assert.equal(match.score, 60)
  assert.equal(match.kind, 'partial-match')
  assert.deepEqual(match.missingIngredients, ['vinegar'])
})

test('matcher uses normalized Tagalog and English aliases', () => {
  const ingredients = normalizeIngredientInput('sardinas, itlog, bawang')
  const [match] = matchRecipeCatalog(ingredients)

  assert.equal(match.dish.id, 'sardines-with-egg')
  assert.equal(match.kind, 'strong-match')
  assert.deepEqual(match.availableIngredients, ['sardines', 'egg', 'garlic'])
})

test('distinctive ingredients prioritize the relevant Filipino dish', () => {
  const ingredients = normalizeIngredientInput('peanut butter, pork')
  const [match] = matchRecipeCatalog(ingredients)

  assert.equal(match.dish.id, 'kare-kare')
  assert.ok(match.score > 20)
  assert.ok(match.availableIngredients.includes('peanut butter'))
})

test('matcher rejects weak matches instead of returning misleading adaptations', () => {
  const ingredients = normalizeIngredientInput('butter')

  assert.deepEqual(matchRecipeCatalog(ingredients), [])
})

test('matcher prioritizes essential and distinctive ingredients', () => {
  const [match] = matchRecipeCatalog(normalizeIngredientInput('peanut butter, pork'))

  assert.equal(match.dish.id, 'kare-kare')
  assert.ok(match.score >= 20)
  assert.ok(match.availableIngredients.includes('peanut butter'))
  assert.equal(match.substitutedIngredients[0].requiredIngredient, 'oxtail')
  assert.equal(match.substitutedIngredients[0].providedIngredient, 'pork')
})

test('matcher handles empty input and custom limits', () => {
  assert.deepEqual(matchRecipeCatalog([]), [])
  const matches = matchRecipeCatalog(normalizeIngredientInput('egg, tomato'), undefined, 2)
  assert.equal(matches.length, 2)
})

test('expanded catalog matches common Filipino meal combinations', () => {
  const pancitMatches = matchRecipeCatalog(normalizeIngredientInput('repolyo, canton noodles'))
  const sinigangMatches = matchRecipeCatalog(normalizeIngredientInput('sampalok, hipon'))

  assert.equal(pancitMatches[0].dish.id, 'pancit-canton')
  assert.equal(sinigangMatches[0].dish.id, 'sinigang-na-hipon')
  assert.equal(matchRecipeCatalog(normalizeIngredientInput('liempo, soy sauce, garlic'))[0].dish.id, 'grilled-liempo')
  assert.equal(matchRecipeCatalog(normalizeIngredientInput('shrimp, garlic, butter'))[0].dish.id, 'garlic-butter-shrimp')
  assert.ok(pancitMatches.every((match) => match.score >= 20))
  assert.ok(sinigangMatches.every((match) => match.score >= 20))
})

test('matcher rejects a distinctive ingredient paired with an unrelated ingredient', () => {
  assert.deepEqual(matchRecipeCatalog(normalizeIngredientInput('peanut butter, tomato')), [])
})

test('removed snack and dessert ingredients do not create a main-meal match', () => {
  const matches = matchRecipeCatalog(normalizeIngredientInput('kamote, brown sugar'))
  assert.ok(matches.every((match) => match.score === 0))
})

test('ingredient groups and explicit substitutions are conservative', () => {
  assert.equal(getIngredientGroup('shrimp'), 'seafood')
  assert.equal(getIngredientGroup('garlic'), 'aromatics')
  assert.equal(getIngredientGroup('butter'), 'cooking-fats')

  const [match] = matchRecipeCatalog(normalizeIngredientInput('shrimp, calamansi, tomato, onion'))
  assert.equal(match.dish.id, 'sinigang-na-hipon')
  assert.ok(match.substitutedIngredients.some((item) => item.requiredIngredient === 'tamarind' && item.providedIngredient === 'calamansi'))
  assert.ok(match.score < 100)

  const [kareKare] = matchRecipeCatalog(normalizeIngredientInput('pork, peanut butter'))
  assert.equal(kareKare.dish.id, 'kare-kare')
  assert.deepEqual(kareKare.substitutedIngredients, [{
    requiredIngredient: 'oxtail',
    providedIngredient: 'pork',
    note: 'Pork creates a home-style Kare-Kare variation.',
  }])
})

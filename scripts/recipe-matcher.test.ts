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
  const matches = matchRecipeCatalog(normalizeIngredientInput('manok, bawang'), undefined, 2)
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

test('explicit essential ingredients protect dish identity', () => {
  assert.equal(matchRecipeCatalog(normalizeIngredientInput('cabbage, canton noodles'))[0].dish.id, 'pancit-canton')
  assert.deepEqual(matchRecipeCatalog(normalizeIngredientInput('garlic, butter')), [])
  assert.deepEqual(matchRecipeCatalog(normalizeIngredientInput('tomato, onion')), [])
})

test('dish identity rules require defining ingredient groups', () => {
  const porkSinigangMatches = matchRecipeCatalog(normalizeIngredientInput('pork, tomato, onion'))
  assert.ok(porkSinigangMatches.every((match) => match.dish.id !== 'sinigang-na-baboy'))
  assert.deepEqual(matchRecipeCatalog(normalizeIngredientInput('shrimp, garlic, butter'))[0].dish.id, 'garlic-butter-shrimp')
  assert.equal(matchRecipeCatalog(normalizeIngredientInput('rice noodles, cabbage, chicken'))[0].dish.id, 'pancit-bihon')
  assert.equal(matchRecipeCatalog(normalizeIngredientInput('flour noodles, cabbage, pork'))[0].dish.id, 'pancit-habhab')
})

test('expanded dish rules protect adobo, tinola, menudo, and paksiw identities', () => {
  assert.ok(matchRecipeCatalog(normalizeIngredientInput('chicken, garlic, vinegar')).some((match) => match.dish.id === 'chicken-adobo'))
  assert.ok(!matchRecipeCatalog(normalizeIngredientInput('chicken, garlic, ginger')).some((match) => match.dish.id === 'chicken-adobo'))
  assert.ok(matchRecipeCatalog(normalizeIngredientInput('chicken, ginger, onion')).some((match) => match.dish.id === 'tinolang-manok'))
  assert.ok(!matchRecipeCatalog(normalizeIngredientInput('pork, potato, carrot')).some((match) => match.dish.id === 'menudo'))
  assert.ok(matchRecipeCatalog(normalizeIngredientInput('pork, vinegar, garlic')).some((match) => match.dish.id === 'paksiw-na-baboy'))
})

test('expanded vegetable and rice meal rules require defining ingredients', () => {
  assert.ok(matchRecipeCatalog(normalizeIngredientInput('taro leaves, coconut milk')).some((match) => match.dish.id === 'laing'))
  assert.ok(!matchRecipeCatalog(normalizeIngredientInput('taro leaves, coconut milk')).some((match) => match.dish.id === 'pinakbet'))
  assert.ok(matchRecipeCatalog(normalizeIngredientInput('bitter melon, eggplant, shrimp paste')).some((match) => match.dish.id === 'pinakbet'))
  assert.ok(matchRecipeCatalog(normalizeIngredientInput('cooked rice, chicken, ginger')).some((match) => match.dish.id === 'arroz-caldo'))
})

test('pancit identity rules distinguish noodle families', () => {
  const riceNoodleMatches = matchRecipeCatalog(normalizeIngredientInput('rice noodles, shrimp, shrimp paste, egg'))
  assert.ok(riceNoodleMatches.some((match) => match.dish.id === 'pancit-palabok'))
  assert.ok(!riceNoodleMatches.some((match) => match.dish.id === 'pancit-canton'))

  const eggNoodleMatches = matchRecipeCatalog(normalizeIngredientInput('egg noodles, chicken, cabbage, soy sauce'))
  assert.ok(eggNoodleMatches.some((match) => match.dish.id === 'pancit-miki'))
  assert.ok(!eggNoodleMatches.some((match) => match.dish.id === 'pancit-bihon'))
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

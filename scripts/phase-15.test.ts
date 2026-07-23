import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeIngredientInput } from '../src/lib/ingredientParser.ts'
import { matchRecipeCatalog } from '../src/services/recipeMatcher.ts'

const verifiedCases = [
  ['chicken, garlic, vinegar', 'chicken-adobo'],
  ['chicken, ginger, green papaya', 'tinolang-manok'],
  ['pork, tomato sauce, potato', 'menudo'],
  ['fish, vinegar, garlic', 'paksiw-na-isda'],
  ['taro leaves, coconut milk, chili, shrimp paste', 'laing'],
  ['bitter melon, eggplant, long beans, shrimp paste', 'pinakbet'],
  ['cooked rice, chicken, ginger, garlic', 'arroz-caldo'],
  ['rice noodles, shrimp, shrimp paste, egg', 'pancit-palabok'],
  ['thick rice noodles, shrimp, shrimp paste, egg, smoked fish', 'pancit-malabon'],
  ['flour noodles, pork, cabbage, carrot', 'pancit-habhab'],
  ['shrimp, garlic, butter', 'garlic-butter-shrimp'],
  ['pork, peanut butter', 'kare-kare'],
] as const

test('Phase 15 verified combinations rank the intended Filipino dish', () => {
  for (const [input, expectedId] of verifiedCases) {
    const [match] = matchRecipeCatalog(normalizeIngredientInput(input))
    assert.equal(match?.dish.id, expectedId, input)
  }
})

test('Phase 15 false-positive guard cases stay out of unrelated dishes', () => {
  const sinigangWithoutSouring = matchRecipeCatalog(normalizeIngredientInput('pork, tomato, onion'))
  assert.ok(sinigangWithoutSouring.every((match) => !match.dish.id.startsWith('sinigang-')))

  const adoboWithoutSoyOrVinegar = matchRecipeCatalog(normalizeIngredientInput('chicken, garlic, ginger'))
  assert.ok(adoboWithoutSoyOrVinegar.every((match) => !match.dish.id.includes('adobo')))

  const unrelated = matchRecipeCatalog(normalizeIngredientInput('peanut butter, tomato'))
  assert.deepEqual(unrelated, [])
})

test('no-match input is allowed to use the grounded AI fallback', async () => {
  const { readFile } = await import('node:fs/promises')
  const discovery = await readFile('src/hooks/useDiscovery.ts', 'utf8')
  assert.match(discovery, /partial or unfamiliar/)
  assert.match(discovery, /clearly labelled Hapag adaptation/)
  assert.match(discovery, /recipeService\.generateSuggestions/)
})

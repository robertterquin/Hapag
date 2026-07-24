import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')

test('ingredient suggestions are shared across Home and Ulam AI', async () => {
  const component = await read('src/components/IngredientSuggestions.tsx')
  const home = await read('src/pages/HomePage.tsx')
  const ulam = await read('src/pages/UlamPage.tsx')

  assert.match(component, /commonIngredients/)
  assert.match(component, /suggestion-chip/)
  assert.doesNotMatch(home, /IngredientPrompt/)
  assert.match(home, /Simulan sa Ulam AI/)
  assert.doesNotMatch(home, /recipeFixtures|home-sample|home-final-cta|home-benefits/)
  assert.match(home, /how-it-works-heading/)
  assert.match(home, /Ilagay ang mga sangkap/)
  assert.match(home, /Suriin at iangkop ang preferences/)
  assert.match(home, /Pumili ng ulam at simulan ang pagluluto/)
  assert.match(home, /info-card-mango/)
  assert.match(ulam, /suggestions=\{commonIngredients\}/)
  assert.match(ulam, /onSuggestionSelect=/)
  assert.doesNotMatch(ulam, /<IngredientSuggestions/)
})

test('results use a calm cooking loading state and accessible form focus styles', async () => {
  const loading = await read('src/components/CookingLoadingState.tsx')
  const results = await read('src/pages/ResultsPage.tsx')
  const index = await read('src/index.css')

  assert.match(loading, /Tinitingnan ang mga sangkap/)
  assert.match(loading, /Naghahanap ng bagay/)
  assert.match(results, /CookingLoadingState/)
  assert.match(index, /input:focus-visible, select:focus-visible/)
})

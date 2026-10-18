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
  assert.match(home, /Ano'ng ulam\?/)
  assert.match(home, /<IngredientAddForm/)
  assert.match(home, /onSurprise/)
  assert.match(home, /onStart\(''\)/)
  assert.doesNotMatch(home, /recipeFixtures|home-sample|home-final-cta|home-benefits/)
  assert.doesNotMatch(home, /info-card-mango|info-card-green/)
  assert.doesNotMatch(home, /home-recipe-preview|Hapag result|Mga puwedeng lutuin gamit ang sangkap mo/)
  assert.match(ulam, /<KusinaShelf/)
  assert.doesNotMatch(ulam, /<IngredientSuggestions/)
})

test('results use a calm cooking loading state and accessible form focus styles', async () => {
  const loading = await read('src/components/CookingLoadingState.tsx')
  const results = await read('src/pages/ResultsPage.tsx')
  const index = await read('src/index.css')

  assert.match(loading, /getMascotLoadingBanter/)
  assert.match(loading, /aria-live="polite"/)
  assert.match(results, /CookingLoadingState/)
  assert.match(index, /input:focus-visible, select:focus-visible/)
})

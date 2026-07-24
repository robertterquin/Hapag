import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')

test('Motion is configured with reduced-motion support and route transitions', async () => {
  const main = await read('src/main.tsx')
  const app = await read('src/app/App.tsx')
  const shell = await read('src/components/AppShell.tsx')
  const index = await read('src/index.css')

  assert.match(main, /MotionConfig reducedMotion="user"/)
  assert.match(shell, /AnimatePresence/)
  assert.match(shell, /contentKey/)
  assert.match(app, /recipe-detail.*recipeId/)
  assert.match(index, /prefers-reduced-motion/)
})

test('shared recipe and cooking interactions use restrained Motion transitions', async () => {
  const card = await read('src/components/RecipeCard.tsx')
  const chips = await read('src/components/IngredientChips.tsx')
  const cooking = await read('src/pages/CookingPage.tsx')

  assert.match(card, /whileHover=\{\{ y: -6, scale: 1\.012 \}\}/)
  assert.match(card, /whileTap=\{\{ scale: 0\.9 \}\}/)
  assert.match(chips, /AnimatePresence/)
  assert.match(cooking, /AnimatePresence/)
  assert.match(cooking, /animate=\{\{ width:/)
})

test('card elevation uses Radix shadow tokens and reduced-motion-safe hover styling', async () => {
  const css = await read('src/App.css')
  const tokens = await read('src/index.css')

  assert.match(tokens, /--color-shadow-hover: var\(--slate-a6\)/)
  assert.match(tokens, /--color-card-focus: var\(--teal-a5\)/)
  assert.match(css, /\.recipe-card:hover, \.recipe-card:focus-within/)
  assert.match(css, /\.recipe-card:hover \.recipe-card-image/)
  assert.match(css, /prefers-reduced-motion/)
  assert.doesNotMatch(css, /\.info-card:hover, \.info-card:focus-within/)
})

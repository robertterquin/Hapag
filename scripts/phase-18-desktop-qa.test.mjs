import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')

test('sticky bars keep working: overflow clipping lives on body, never on html', async () => {
  const css = await read('src/index.css')
  const htmlRules = [...css.matchAll(/(^|\n)html\s*\{([^}]*)\}/g)].map((match) => match[2])
  assert.ok(htmlRules.every((rule) => !/overflow/.test(rule)), 'html must not set overflow; it stops body overflow from reaching the viewport')
  const body = css.match(/\nbody\s*\{([^}]*)\}/)[1]
  assert.match(body, /overflow-x:\s*clip/)
  assert.doesNotMatch(body, /overflow-x:\s*hidden/)
})

test('Ulam AI keeps the phone order and pins the list on desktop', async () => {
  const page = await read('src/pages/UlamPage.tsx')
  const css = await read('src/App.css')
  for (const name of ['input', 'selected', 'staples', 'pantry', 'prefs', 'cook']) assert.match(page, new RegExp(`ulam-order-${name}`))
  assert.match(css, /\.ulam-main, \.ulam-side, \.ulam-order-cook \{ display: contents; \}/)
  assert.match(css, /\.ulam-order-cook > \.sticky-action-bar \{ order: 6; \}/)
  assert.match(css, /\.ulam-side \{ position: sticky; top: 96px;/)
})

test('recipe detail shows prep and method side by side on wide screens', async () => {
  const page = await read('src/pages/RecipeDetailPage.tsx')
  const css = await read('src/App.css')
  assert.ok(page.indexOf('detail-prep') < page.indexOf('<ShoppingListPanel'))
  assert.ok(page.indexOf('detail-method') < page.indexOf('steps-heading'))
  assert.match(css, /grid-template-areas: "prep method" "side method";/)
})

test('controls meet the 44px touch target and links show a focus ring', async () => {
  const css = await read('src/App.css')
  const tokens = await read('src/index.css')
  const rule = css.match(/\n([^\n{]*\.shelf-item-chip[^\n{]*)\{ min-height: 44px; \}/)
  assert.ok(rule, 'shared 44px rule exists')
  for (const selector of ['.mobile-brand', '.sign-in-link', '.text-button', '.suggestion-chip', '.pairing-chip', '.shelf-tab', '.cooking-voice-button']) assert.ok(rule[1].includes(selector), selector)
  assert.match(css, /\.save-button \{ width: 44px; height: 44px; \}/)
  assert.match(css, /\.serving-stepper button \{ min-width: 44px; min-height: 44px; \}/)
  assert.match(tokens, /a:focus-visible, \[tabindex\]:focus-visible/)
})

test('reduced motion also stops the mascot looping pulses', async () => {
  const mascot = await read('src/components/ChefKalabaw.tsx')
  assert.match(mascot, /const reduceMotion = useReducedMotion\(\)/)
  assert.equal(mascot.match(/animate=\{reduceMotion \? undefined :/g)?.length, 4)
})

test('secondary pages and libraries load as separate chunks', async () => {
  const app = await read('src/app/App.tsx')
  const vite = await read('vite.config.ts')
  for (const page of ['CookingPage', 'RecipeDetailPage', 'ResultsPage', 'SavedPage', 'ProfilePage', 'AuthPage']) {
    assert.match(app, new RegExp(`const ${page} = lazy\\(\\(\\) => import\\('\\.\\./pages/${page}\\.tsx'\\)`))
  }
  assert.match(app, /<Suspense fallback=/)
  assert.match(app, /import \{ HomePage \} from '\.\.\/pages\/HomePage\.tsx'/)
  assert.match(vite, /codeSplitting/)
  for (const group of ['react', 'supabase', 'motion', 'vendor']) assert.match(vite, new RegExp(`name: '${group}'`))
})

test('user-facing errors do not leak backend setup details', async () => {
  const discovery = await read('src/hooks/useDiscovery.ts')
  const messages = [...discovery.matchAll(/setGenerationError\('([^']+)'\)/g)].map((match) => match[1])
  assert.ok(messages.length >= 3)
  for (const message of messages) assert.doesNotMatch(message, /Supabase|Edge Function|secret/i)
})

test('dish photos reserve their space before loading', async () => {
  const image = await read('src/components/DishImage.tsx')
  assert.match(image, /width=\{640\} height=\{360\}/)
  assert.match(image, /loading=\{variant === 'card' \? 'lazy' : 'eager'\}/)
})

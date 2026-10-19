import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')
const sources = async () => {
  const files = []
  for (const dir of ['src/pages', 'src/components']) {
    for (const name of await readdir(dir)) if (name.endsWith('.tsx')) files.push(`${dir}/${name}`)
  }
  return Promise.all(files.map(async (path) => [path, await read(path)]))
}

test('no heading has a kicker or eyebrow above it (Home keeps its brand line)', async () => {
  for (const [path, source] of await sources()) {
    assert.doesNotMatch(source, /className="(section|shelf|step)-kicker"/, `${path} still renders a kicker`)
    if (!path.endsWith('HomePage.tsx')) assert.doesNotMatch(source, /className="eyebrow"/, `${path} still renders an eyebrow`)
  }
  assert.doesNotMatch(await read('src/pages/CookingPage.tsx'), /<span>Cooking mode<\/span>/)
})

test('buttons use sentence case', async () => {
  for (const [path, source] of await sources()) {
    for (const label of ['Edit Ingredients', 'Try Again', 'Find Recipes', 'Back to Home', 'Cooking Steps']) {
      assert.ok(!source.includes(`>${label}<`), `${path} has "${label}"`)
    }
  }
})

test('results show one fallback message and one summary line', async () => {
  const results = await read('src/pages/ResultsPage.tsx')
  assert.match(results, /className="results-summary"/)
  assert.match(results, /className="ideas-note"/)
  assert.doesNotMatch(results, /AI recipes are unavailable right now/)
})

test('cost lines never call a staple "missing"', async () => {
  const cost = await read('src/components/CostBreakdown.tsx')
  assert.doesNotMatch(cost, /missing<\//)
  assert.match(cost, /staple/)
})

test('cards render no placeholder photo tile', async () => {
  const image = await read('src/components/DishImage.tsx')
  assert.doesNotMatch(image, /No photo yet/)
})

test('content pages share one card surface and drop background doodles', async () => {
  const css = await read('src/App.css')
  assert.match(css, /--surface-border:\s*1px solid/)
  assert.match(css, /\.app-background::after\s*\{\s*display:\s*none/)
})

test('every interactive control keeps a 44px minimum height', async () => {
  const css = await read('src/App.css')
  for (const rule of [/\.nav-item \{[^}]*min-height: 44px/, /\.auth-mode-switch button \{[^}]*min-height: 44px/, /\.shelf-item-chip:has\(\.item-name small\) \{[^}]*min-height: 44px/, /\.results-summary \.text-button \{[^}]*min-height: 44px/]) {
    assert.match(css, rule)
  }
})

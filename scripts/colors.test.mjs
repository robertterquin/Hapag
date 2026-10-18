import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')

test('Radix palettes are imported and mapped to Hapag semantic tokens', async () => {
  const css = await read('src/index.css')

  for (const palette of ['orange', 'brown', 'sand', 'amber', 'green', 'tomato']) {
    assert.match(css, new RegExp(`@radix-ui/colors/${palette}\\.css`))
  }

  for (const token of ['--color-action', '--color-tomato', '--color-border', '--color-warning-bg', '--color-error-bg']) {
    assert.match(css, new RegExp(`${token}:\\s+var\\(--`))
  }

  for (const token of ['--color-brand', '--color-brand-strong', '--color-brand-soft', '--color-mango', '--color-cream', '--color-calamansi', '--color-ink', '--color-muted', '--color-success-bg']) {
    assert.match(css, new RegExp(`${token}:\\s+(?:var\\(--|#[0-9A-Fa-f]{6})`))
  }

  assert.match(css, /--color-brand:\s+#B5442A/)
  assert.match(css, /--color-action:\s+var\(--color-brand\)/)
  assert.match(css, /--color-cream:\s+#FFF8EE/)
  assert.match(css, /--color-warning-bg:\s+var\(--amber-2\)/)
  assert.match(css, /--color-error-bg:\s+var\(--tomato-2\)/)
})

test('application CSS uses semantic alpha tokens for translucent surfaces and borders', async () => {
  const css = await read('src/App.css')
  const recipeCardRules = css.slice(css.indexOf('.recipe-card {'), css.indexOf('.recipe-card-image-placeholder'))
  assert.doesNotMatch(recipeCardRules, /rgb\(/)
  assert.match(css, /var\(--color-focus-ring\)/)
  assert.match(css, /var\(--color-shadow-soft\)/)
  assert.match(css, /var\(--color-success-border\)/)
})

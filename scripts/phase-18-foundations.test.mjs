import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
  const [r, g, b] = channels.map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}

async function resolveColor(css, token) {
  const value = css.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1].trim()
  assert.ok(value, `${token} is defined`)
  if (value.startsWith('#')) return value
  const radix = value.match(/^var\(--([a-z]+)-(\d+)\)$/)
  assert.ok(radix, `${token} resolves to a hex or Radix step`)
  const palette = await read(`node_modules/@radix-ui/colors/${radix[1]}.css`)
  return palette.match(new RegExp(`--${radix[1]}-${radix[2]}:\\s*(#[0-9a-fA-F]{6})`))[1]
}

test('brand and action colours meet WCAG AA contrast with white', async () => {
  const css = await read('src/index.css')
  const white = '#ffffff'
  assert.ok(contrast(await resolveColor(css, '--color-brand'), white) >= 4.5, 'brand text on white')
  assert.ok(contrast(await resolveColor(css, '--color-brand-strong'), await resolveColor(css, '--color-brand-soft')) >= 4.5, 'brand-strong on brand-soft')
  assert.ok(contrast(white, await resolveColor(css, '--color-action')) >= 4.5, 'white text on primary buttons')
})

test('orange is reserved for primary actions; everything else uses brand tokens', async () => {
  const css = await read('src/App.css')
  assert.doesNotMatch(css, /--color-ube|--color-lavender/)
  assert.match(css, /\.button-primary \{[^}]*background: var\(--color-action\)/)
  assert.match(css, /\.mobile-nav-item-active \.mobile-nav-indicator[^{]*\{[^}]*var\(--color-brand-soft\)/)
})

test('every Radix palette referenced in CSS is imported', async () => {
  const tokens = await read('src/index.css')
  const css = `${tokens}\n${await read('src/App.css')}`
  const imported = new Set([...tokens.matchAll(/@radix-ui\/colors\/([a-z]+)(-alpha)?\.css/g)].map((match) => `${match[1]}${match[2] ? '-a' : ''}`))
  const radixPalettes = ['gray', 'mauve', 'slate', 'sage', 'olive', 'sand', 'tomato', 'red', 'ruby', 'crimson', 'pink', 'plum', 'purple', 'violet', 'iris', 'indigo', 'blue', 'cyan', 'teal', 'jade', 'green', 'grass', 'bronze', 'gold', 'brown', 'orange', 'amber', 'yellow', 'lime', 'mint', 'sky', 'white', 'black']
  const used = [...css.matchAll(/var\(--([a-z]+)-(a?)\d+\)/g)]
    .filter((match) => radixPalettes.includes(match[1]))
    .map((match) => `${match[1]}${match[2] ? '-a' : ''}`)
  for (const palette of new Set(used)) assert.ok(imported.has(palette), `${palette} is imported`)
})

test('signed-out header shows a sign-in action instead of a placeholder avatar', async () => {
  const shell = await read('src/components/AppShell.tsx')
  assert.match(shell, /isSignedIn \?/)
  assert.match(shell, /onNavigate\('\/auth'\)/)
  assert.doesNotMatch(shell, /\?\? 'U'/)
})

test('shared components cover the accessibility contract', async () => {
  const segmented = await read('src/components/SegmentedControl.tsx')
  assert.match(segmented, /role="radiogroup"/)
  assert.match(segmented, /aria-checked=\{checked\}/)
  assert.match(segmented, /ArrowRight/)

  const sheet = await read('src/components/BottomSheet.tsx')
  assert.match(sheet, /showModal\(\)/)
  assert.match(sheet, /onCancel=/)
  assert.match(sheet, /aria-label="Close"/)

  const chip = await read('src/components/IngredientChip.tsx')
  assert.match(chip, /'have' \| 'missing' \| 'staple' \| 'substitute'/)
  assert.match(chip, /aria-label=\{`Remove \$\{name\}`\}/)

  const bar = await read('src/components/StickyActionBar.tsx')
  assert.match(bar, /useKeyboardOpen/)
})

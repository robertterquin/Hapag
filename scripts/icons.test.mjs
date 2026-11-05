import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { usedIconNames } from './build-icons.mjs'

test('every icon the app uses is bundled (run `npm run icons` after adding one)', () => {
  const bundled = new Set(JSON.parse(readFileSync('src/data/icons.json', 'utf8')).flatMap((set) => Object.keys(set.icons).map((name) => `${set.prefix}:${name}`)))
  const missing = usedIconNames().filter((name) => !bundled.has(name))
  assert.deepEqual(missing, [])
})

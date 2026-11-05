// Bundles only the icons the app uses, so none are fetched from Iconify's servers at runtime.
// Run `npm run icons` after using a new icon; scripts/icons.test.mjs fails until you do.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const sets = { lucide: '@iconify-json/lucide/icons.json', 'fluent-emoji-flat': '@iconify-json/fluent-emoji-flat/icons.json' }
const walk = (dir) => readdirSync(dir).flatMap((name) => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : [path] })

export function usedIconNames() {
  const pattern = new RegExp(`['"\`](${Object.keys(sets).join('|')}):([a-z0-9-]+)['"\`]`, 'g')
  const names = new Set()
  for (const file of walk('src').filter((path) => /\.(ts|tsx)$/.test(path))) {
    for (const match of readFileSync(file, 'utf8').matchAll(pattern)) names.add(`${match[1]}:${match[2]}`)
  }
  return [...names].sort()
}

if (process.argv[1]?.endsWith('build-icons.mjs')) {
  const collections = []
  for (const [prefix, path] of Object.entries(sets)) {
    const source = JSON.parse(readFileSync(new URL(import.meta.resolve(path)), 'utf8'))
    const icons = {}
    for (const name of usedIconNames().filter((full) => full.startsWith(`${prefix}:`)).map((full) => full.slice(prefix.length + 1))) {
      const real = source.icons[name] ? name : source.aliases?.[name]?.parent
      if (!real || !source.icons[real]) throw new Error(`Unknown icon ${prefix}:${name}`)
      icons[name] = source.icons[real]
    }
    collections.push({ prefix, width: source.width, height: source.height, icons })
  }
  writeFileSync('src/data/icons.json', `${JSON.stringify(collections)}\n`)
  console.log('bundled', collections.map((set) => `${set.prefix}: ${Object.keys(set.icons).length}`).join(', '))
}

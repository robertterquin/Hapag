import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')

test('removed My Ingredients code is disconnected from the application', async () => {
  const app = await read('src/app/App.tsx')
  const shell = await read('src/components/AppShell.tsx')
  const ulam = await read('src/pages/UlamPage.tsx')
  const service = await read('src/services/persistenceService.ts')

  assert.doesNotMatch(app, /usePantry|PantryPicker|PantryPage|startFromPantry|replacePantryIngredients/)
  assert.doesNotMatch(shell, /My Ingredients|pantry/)
  assert.doesNotMatch(ulam, /PantryPicker|pantryItems|My Ingredients/)
  assert.doesNotMatch(service, /pantry_items|loadPantryItems|savePantryItem|updatePantryItem|removePantryItem/)
})

test('legacy pantry URL redirects to Ulam AI and the database schema remains preserved', async () => {
  const router = await read('src/app/router.ts')
  const migration = await read('supabase/migrations/0001_hapag_master.sql')
  assert.match(router, /pathname === '\/pantry'/)
  assert.match(router, /replaceState\(\{\}, '', '\/ulam'\)/)
  assert.match(migration, /create table if not exists public\.pantry_items/)
  assert.match(migration, /pantry_items_insert_own/)
  assert.match(migration, /pantry_items_delete_own/)
})

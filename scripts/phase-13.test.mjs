import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')

test('phase 13 pantry persistence is wired to the RLS-backed pantry table', async () => {
  const service = await read('src/services/persistenceService.ts')
  const hook = await read('src/hooks/usePantry.ts')
  const migration = await read('supabase/migrations/0001_hapag_master.sql')
  assert.match(service, /from\('pantry_items'\)/)
  assert.match(service, /savePantryItem/)
  assert.match(service, /updatePantryItem/)
  assert.match(service, /quantity,unit/)
  assert.match(service, /removePantryItem/)
  assert.match(hook, /usePantry\(session/)
  assert.match(migration, /pantry_items_insert_own/)
  assert.match(migration, /pantry_items_delete_own/)
})

test('phase 13 preserves pantry-to-discovery generation', async () => {
  const app = await read('src/app/App.tsx')
  const page = await read('src/pages/PantryPage.tsx')
  assert.match(app, /startFromPantry\(pantry\.pantryItems\)/)
  assert.match(page, /Use pantry in Ulam AI/)
  assert.match(page, /Sign in to sync your pantry/)
})

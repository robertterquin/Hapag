import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const migration = fs.readFileSync('supabase/migrations/0001_hapag_master.sql', 'utf8')
const app = fs.readFileSync('src/app/App.tsx', 'utf8')
const auth = fs.readFileSync('src/hooks/useAuth.ts', 'utf8')

test('phase 11 master migration contains all user-owned tables', () => {
  for (const table of ['profiles', 'user_preferences', 'saved_recipes', 'cooked_events', 'pantry_items']) {
    assert.match(migration, new RegExp(`create table if not exists public\\.${table}`))
  }
  assert.match(migration, /enable row level security/)
  assert.match(migration, /on_auth_user_created/)
  assert.match(migration, /saved_recipes_select_own/)
  assert.match(migration, /cooked_events_insert_own/)
  assert.match(migration, /grant select, insert, update, delete on table public\.saved_recipes to authenticated/)
  assert.match(migration, /grant select, insert, update, delete on table public\.pantry_items to authenticated/)
})

test('phase 11 app wiring uses auth and persistence hooks', () => {
  assert.match(app, /useAuth\(\)/)
  assert.match(app, /useSavedRecipes\(auth\.session\)/)
  assert.match(app, /usePreferences\(auth\.session\)/)
  assert.match(auth, /onAuthStateChange/)
})

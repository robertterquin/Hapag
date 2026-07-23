import { readFile } from 'node:fs/promises'
import test from 'node:test'
import assert from 'node:assert/strict'

const read = (path) => readFile(path, 'utf8')

test('Phase 17 exposes the four result feedback choices', async () => {
  const source = await read('src/components/RecipeFeedback.tsx')
  assert.match(source, /Helpful/)
  assert.match(source, /Not relevant/)
  assert.match(source, /Missing an ingredient/)
  assert.match(source, /Not a Filipino dish/)
})

test('Phase 17 stores feedback locally and reranks suggestions', async () => {
  const source = await read('src/hooks/useRecipeFeedback.ts')
  assert.match(source, /localStorage/)
  assert.match(source, /rankRecipes/)
  assert.match(source, /not-filipino/)
  const app = await read('src/app/App.tsx')
  assert.match(app, /recipeFeedback\.rankRecipes\(discovery\.suggestions\)/)
  assert.match(app, /onFeedback=\{submitFeedback\}/)
})

test('Phase 17 includes authenticated persistence with user-owned RLS', async () => {
  const migration = await read('supabase/migrations/0004_recipe_feedback.sql')
  assert.match(migration, /create table if not exists public\.recipe_feedback/)
  assert.match(migration, /enable row level security/)
  assert.match(migration, /auth\.uid\(\) = user_id/)
  assert.match(migration, /unique \(user_id, recipe_id\)/)
  const persistence = await read('src/services/persistenceService.ts')
  assert.match(persistence, /submitRecipeFeedback/)
  assert.match(persistence, /candidate_dishes/)
})

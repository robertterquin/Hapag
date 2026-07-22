import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { normalizeIngredientInput } from '../src/lib/ingredientParser.ts'

const read = (path: string) => readFile(path, 'utf8')

test('manual ingredient input remains the single discovery source', () => {
  const [sardines] = normalizeIngredientInput('2 cans sardines', 'manual')
  assert.equal(sardines.canonicalName, 'canned sardines')
  assert.equal(sardines.quantity, 2)
  assert.equal(sardines.unit, 'can')
  assert.equal(sardines.source, 'manual')
})

test('Ulam AI keeps ingredient review and manual additions', async () => {
  const ulam = await read('src/pages/UlamPage.tsx')
  const discovery = await read('src/hooks/useDiscovery.ts')
  assert.match(ulam, /Ingredient review/)
  assert.match(ulam, /Add an ingredient/)
  assert.match(discovery, /addIngredients/)
  assert.doesNotMatch(ulam, /PantryPicker|My Ingredients/)
  assert.doesNotMatch(discovery, /startFromPantry|replacePantryIngredients/)
})

test('legacy pantry application files are removed while schema files remain', async () => {
  const migration = await read('supabase/migrations/0001_hapag_master.sql')
  assert.match(migration, /pantry_items/)
  await assert.rejects(() => read('src/pages/PantryPage.tsx'))
  await assert.rejects(() => read('src/hooks/usePantry.ts'))
  await assert.rejects(() => read('src/components/PantryPicker.tsx'))
})

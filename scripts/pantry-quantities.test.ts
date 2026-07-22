import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { normalizeIngredientDraft, normalizeIngredientInput } from '../src/lib/ingredientParser.ts'

const read = (path: string) => readFile(path, 'utf8')

test('name-only ingredient drafts use one compatibility piece', () => {
  const sardines = normalizeIngredientDraft({ name: 'sardines' }, 'pantry')
  assert.equal(sardines?.quantity, 1)
  assert.equal(sardines?.unit, 'piece')
  assert.equal(sardines?.canonicalName, 'canned sardines')
  assert.equal(sardines?.source, 'pantry')
})

test('unknown ingredient names remain reviewable', () => {
  const [unknown] = normalizeIngredientInput('something new', 'pantry')
  assert.equal(unknown.confidence, 'low')
})

test('my ingredients persistence keeps compatibility columns without exposing quantities', async () => {
  const service = await read('src/services/persistenceService.ts')
  const hook = await read('src/hooks/usePantry.ts')
  const app = await read('src/app/App.tsx')
  const page = await read('src/pages/PantryPage.tsx')
  const migration = await read('supabase/migrations/0003_pantry_quantities.sql')
  assert.match(service, /quantity,unit/)
  assert.match(service, /quantity: 1/)
  assert.match(service, /unit: 'piece'/)
  assert.match(hook, /already in My Ingredients/)
  assert.match(app, /startFromPantry\(pantry\.pantryItems\)/)
  assert.match(page, /My Ingredients/)
  assert.match(migration, /pantry_items_quantity_positive/)
})

test('my ingredients uses a name-only form and auto-save editor', async () => {
  const addForm = await read('src/components/IngredientAddForm.tsx')
  const editor = await read('src/components/PantryItemEditor.tsx')
  const page = await read('src/pages/PantryPage.tsx')
  assert.match(page, /Add an ingredient/)
  assert.match(addForm, /onSubmit\(\{ name: name\.trim\(\) \}\)/)
  assert.doesNotMatch(addForm, /Quantity|Unit|type="number"/)
  assert.match(editor, /onBlur=/)
  assert.doesNotMatch(editor, /pantry-quantity|pantry-unit|<button[^>]*>Save<\/button>/)
})

test('ulam picker selects names and preserves manual ingredients', async () => {
  const picker = await read('src/components/PantryPicker.tsx')
  const discovery = await read('src/hooks/useDiscovery.ts')
  const ulam = await read('src/pages/UlamPage.tsx')
  assert.match(picker, /type="checkbox"/)
  assert.match(picker, /Use selected ingredients/)
  assert.doesNotMatch(picker, /quantityDrafts|type="number"|Available:/)
  assert.match(discovery, /replacePantryIngredients/)
  assert.match(discovery, /source === 'manual'/)
  assert.match(ulam, /initialSelectedIds=\{selectedPantryIds\}/)
})

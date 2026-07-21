import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { normalizeIngredientDraft, normalizeIngredientInput } from '../src/lib/ingredientParser.ts'

const read = (path: string) => readFile(path, 'utf8')

test('pantry parser reads quantities and curated units', () => {
  const [sardines, eggs, peppers] = normalizeIngredientInput('2 cans sardines, 10 eggs, 2 bell peppers', 'pantry')
  assert.deepEqual(
    { quantity: sardines.quantity, unit: sardines.unit, canonicalName: sardines.canonicalName, source: sardines.source },
    { quantity: 2, unit: 'can', canonicalName: 'canned sardines', source: 'pantry' },
  )
  assert.deepEqual({ quantity: eggs.quantity, unit: eggs.unit, canonicalName: eggs.canonicalName }, { quantity: 10, unit: 'piece', canonicalName: 'egg' })
  assert.deepEqual({ quantity: peppers.quantity, unit: peppers.unit, canonicalName: peppers.canonicalName }, { quantity: 2, unit: 'piece', canonicalName: 'bell pepper' })
})

test('pantry parser defaults missing quantities and marks them for review', () => {
  const [rice] = normalizeIngredientInput('rice', 'pantry')
  assert.equal(rice.quantity, 1)
  assert.equal(rice.unit, 'piece')
  assert.equal(rice.confidence, 'low')
})

test('structured pantry drafts treat known ingredients as explicit entries', () => {
  const sardines = normalizeIngredientDraft({ name: 'sardines', quantity: 2, unit: 'can' }, 'pantry')
  assert.equal(sardines?.quantity, 2)
  assert.equal(sardines?.unit, 'can')
  assert.equal(sardines?.confidence, 'high')
})

test('pantry persistence and Pantry-to-Ulam wiring include structured inventory', async () => {
  const service = await read('src/services/persistenceService.ts')
  const hook = await read('src/hooks/usePantry.ts')
  const app = await read('src/app/App.tsx')
  const ulam = await read('src/pages/UlamPage.tsx')
  const migration = await read('supabase/migrations/0003_pantry_quantities.sql')
  assert.match(service, /quantity,unit/)
  assert.match(service, /updatePantryItem/)
  assert.match(hook, /addPantryItem/)
  assert.match(hook, /existing\.quantity \+ addition\.quantity/)
  assert.match(app, /setPantryPickerExpanded\(true\)/)
  assert.match(ulam, /onAddIngredients/)
  assert.match(migration, /pantry_items_quantity_positive/)
  assert.match(migration, /pantry_items_unit_allowed/)
})

test('pantry uses one-item structured entry and auto-saves row edits', async () => {
  const addForm = await read('src/components/IngredientAddForm.tsx')
  const editor = await read('src/components/PantryItemEditor.tsx')
  const page = await read('src/pages/PantryPage.tsx')
  assert.match(page, /IngredientAddForm/)
  assert.match(addForm, /name.*quantity.*unit/s)
  assert.match(editor, /onBlur=/)
  assert.match(editor, /onChange=.*commit\(nextUnit\)/s)
  assert.doesNotMatch(editor, /<button[^>]*>Save<\/button>/)
})

test('ulam pantry picker limits temporary selection to available stock', async () => {
  const picker = await read('src/components/PantryPicker.tsx')
  const discovery = await read('src/hooks/useDiscovery.ts')
  assert.match(picker, /type="checkbox"/)
  assert.match(picker, /max=\{item\.quantity\}/)
  assert.match(picker, /step="any"/)
  assert.match(picker, /onBlur=\{\(\) => commitQuantity\(item\)\}/)
  assert.match(discovery, /replacePantryIngredients/)
  assert.match(discovery, /source === 'manual'/)
})

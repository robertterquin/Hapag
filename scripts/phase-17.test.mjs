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
  assert.match(app, /onFeedback=\{recipeFeedback\.setRecipeFeedback\}/)
})

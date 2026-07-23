import { readFile } from 'node:fs/promises'
import test from 'node:test'
import assert from 'node:assert/strict'

const read = (path) => readFile(path, 'utf8')

test('Phase 16 release checklist protects server configuration', async () => {
  const guide = await read('docs/27-phase-16-production-release.md')
  assert.match(guide, /npx supabase functions deploy generate-recipes/)
  assert.match(guide, /VITE_SUPABASE_URL/)
  assert.match(guide, /Do not add `OPENAI_API_KEY` or `UPSTASH_REDIS_REST_TOKEN` to Vercel/)
  assert.match(guide, /Never commit `\.env`, `\.env\.local`, or `supabase\/functions\/\.env`/)
})

test('Phase 16 documents both catalog and no-match verification paths', async () => {
  const guide = await read('docs/27-phase-16-production-release.md')
  assert.match(guide, /Catalog match:/)
  assert.match(guide, /No catalog match:/)
  assert.match(guide, /Hapag adaptation/)
  assert.match(guide, /anonymous quota/)
})

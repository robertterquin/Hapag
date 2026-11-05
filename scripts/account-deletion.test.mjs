import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')

test('account deletion confirms the caller before using the admin key', async () => {
  const fn = await read('supabase/functions/delete-account/index.ts')
  const check = fn.indexOf('/auth/v1/user')
  const remove = fn.indexOf('/auth/v1/admin/users/')
  assert.ok(check > 0 && remove > check, 'checks the user before deleting')
  assert.match(fn, /if \(!userResponse\.ok\) return json/)
  assert.match(await read('supabase/config.toml'), /\[functions\.delete-account\]\s*verify_jwt = true/)
})

test('every user table cascades when the account is deleted', async () => {
  const files = (await readdir('supabase/migrations')).filter((name) => name.endsWith('.sql'))
  const sql = (await Promise.all(files.map((name) => read(`supabase/migrations/${name}`)))).join('\n')
  const references = sql.match(/references auth\.users\(id\)[^,\n]*/g) ?? []
  assert.ok(references.length >= 6)
  for (const reference of references) assert.match(reference, /on delete cascade/)
})

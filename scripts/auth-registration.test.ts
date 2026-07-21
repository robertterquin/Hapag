import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateRegistration } from '../src/lib/authValidation.ts'

test('registration validation accepts a complete account form', () => {
  assert.deepEqual(validateRegistration({ fullName: 'Robert Terquin', email: 'robert@example.com', password: 'password123', confirmPassword: 'password123' }), {})
})

test('registration validation reports required and mismatched fields', () => {
  const errors = validateRegistration({ fullName: ' ', email: 'not-an-email', password: 'short', confirmPassword: 'different' })
  assert.equal(errors.fullName, 'Enter your full name.')
  assert.equal(errors.email, 'Enter a valid email address.')
  assert.equal(errors.password, 'Use at least 8 characters.')
  assert.equal(errors.confirmPassword, 'Passwords do not match.')
})

test('email-password sign-in and registration wiring remain present', async () => {
  const [auth, service] = await Promise.all([import('node:fs/promises').then(({ readFile }) => readFile('src/hooks/useAuth.ts', 'utf8')), import('node:fs/promises').then(({ readFile }) => readFile('src/services/persistenceService.ts', 'utf8'))])
  assert.match(auth, /signInWithPassword/)
  assert.match(auth, /signUp/)
  assert.match(service, /auth\.signInWithPassword/)
  assert.match(service, /auth\.signUp/)
  assert.match(service, /full_name: input\.fullName/)
})

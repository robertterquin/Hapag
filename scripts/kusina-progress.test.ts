import assert from 'node:assert/strict'
import { test } from 'node:test'
import { KUSINA_STEP_NAMES, KUSINA_STEPS, kusinaProgress } from '../src/lib/kusinaProgress.ts'
import { AI_TIMEOUT_MS } from '../src/lib/aiTimeout.ts'

test('the loading steps advance through the real stages and never claim the AI is done', () => {
  assert.equal(KUSINA_STEPS.length, 4)
  assert.equal(KUSINA_STEP_NAMES.length, KUSINA_STEPS.length)
  assert.equal(kusinaProgress(0).active, 0)
  assert.equal(kusinaProgress(800).active, 1)
  assert.equal(kusinaProgress(5000).active, 2)
  assert.ok(kusinaProgress(5000).aiShare > 0 && kusinaProgress(5000).aiShare < 0.5)
  assert.equal(kusinaProgress(AI_TIMEOUT_MS * 2).aiShare, 0.96)
  assert.equal(kusinaProgress(1000).late, false)
  assert.equal(kusinaProgress(AI_TIMEOUT_MS * 0.9).late, true)
})

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mealOfHour, mealTimeLabel } from '../src/lib/mealTime.ts'

test('the Home chip names the meal for the hour', () => {
  assert.equal(mealOfHour(7), 'Almusal na')
  assert.equal(mealOfHour(12), 'Tanghalian na')
  assert.equal(mealOfHour(15), 'Merienda na')
  assert.equal(mealOfHour(18), 'Hapunan na')
  assert.equal(mealOfHour(23), 'Gabi na')
  assert.equal(mealOfHour(2), 'Gabi na')
  assert.deepEqual(mealTimeLabel(new Date(2026, 10, 6, 18, 5)), { time: '6:05 PM', meal: 'Hapunan na' })
})

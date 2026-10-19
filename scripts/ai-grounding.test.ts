import assert from 'node:assert/strict'
import { test } from 'node:test'
import { canonicalizeGeneratedIngredient, markOnlyProvidedAvailable, validateRecipeGrounding } from '../supabase/functions/generate-recipes/grounding.ts'

const have = (canonicalName: string) => ({ name: canonicalName, canonicalName, available: true })
const buy = (canonicalName: string) => ({ name: canonicalName, canonicalName, available: false })

// The request the app sent for "manok, bawang, toyo, suka" (trimmed to the fields grounding reads).
const payload = {
  ingredients: ['chicken', 'garlic', 'soy sauce', 'vinegar'].map((canonicalName) => ({ canonicalName, available: true })),
  candidateDishes: [
    { id: 'chicken-adobo', name: 'Chicken Adobo', availableIngredients: ['chicken', 'garlic', 'soy sauce', 'vinegar'] },
    { id: 'adobong-manok-sa-gata', name: 'Adobong Manok sa Gata', availableIngredients: ['chicken', 'soy sauce', 'vinegar'] },
    { id: 'chicken-barbecue', name: 'Chicken Barbecue', availableIngredients: ['chicken', 'soy sauce'] },
  ],
}

const adobo = { id: 'chicken-adobo', title: 'Chicken Adobo', ingredients: [have('chicken'), have('garlic'), have('soy sauce'), have('vinegar'), buy('bay leaf')] }
const saGata = { id: 'x1', title: 'Adobong Manok sa Gata', ingredients: [have('chicken'), have('soy sauce'), have('vinegar'), buy('coconut milk')] }
const barbecue = { id: 'x2', title: 'Chicken Barbecue', ingredients: [have('chicken'), have('soy sauce'), buy('calamansi'), buy('brown sugar')] }

test('three different dishes pass when each keeps its own candidate ingredients', () => {
  assert.equal(validateRecipeGrounding([adobo, saGata, barbecue], payload), true)
})

test('a recipe that drops an ingredient its candidate was matched on is rejected', () => {
  const adoboWithoutVinegar = { ...adobo, ingredients: adobo.ingredients.filter((item) => item.canonicalName !== 'vinegar') }
  assert.equal(validateRecipeGrounding([adoboWithoutVinegar, saGata, barbecue], payload), false)
})

test('a recipe that uses none of the provided ingredients is rejected', () => {
  const pancit = { id: 'pancit', title: 'Pancit Canton', ingredients: [buy('noodles'), buy('carrot')] }
  assert.equal(validateRecipeGrounding([adobo, saGata, pancit], payload), false)
})

test('staples the model marks as on hand are cleared instead of failing the batch', () => {
  const withOil = { ...barbecue, ingredients: [...barbecue.ingredients, have('cooking oil')] }
  const recipes = markOnlyProvidedAvailable([adobo, saGata, withOil], payload)
  const oil = (recipes[2].ingredients as Array<{ canonicalName: string, available: boolean }>).find((item) => item.canonicalName === 'cooking oil')
  assert.equal(oil?.available, false)
  assert.equal(validateRecipeGrounding(recipes, payload), true)
})

test('aliases and plain names reach the same canonical form', () => {
  assert.equal(canonicalizeGeneratedIngredient('Sardinas'), canonicalizeGeneratedIngredient('sardines'))
  assert.equal(canonicalizeGeneratedIngredient('toyo'), 'soy sauce')
  assert.equal(canonicalizeGeneratedIngredient('Eggs'), 'egg')
})

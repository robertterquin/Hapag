# Phase 1 Golden Input Fixtures

These fixtures represent the product-definition cases that the first implementation must understand. They are input and behavior fixtures, not final recipe-quality fixtures. Recipe fixtures and domain research are expanded in Phase 3.

## Fixture format

Each case defines:

- User input.
- Context or constraint.
- Expected interpretation.
- Required product behavior.

## F01 — Complete Taglish ingredient list

**Input:** `May itlog, kamatis, sardinas, at pechay ako.`

**Expected interpretation:** The user has egg, tomato, sardines, and pechay available.

**Required behavior:** Show editable ingredient chips and return three practical Filipino meal suggestions. Each suggestion must explain its ingredient match, missing ingredients, time, difficulty, servings, and estimated cost.

## F02 — Incomplete ingredient list

**Input:** `May manok ako.`

**Expected interpretation:** Chicken is available, but the list is incomplete.

**Required behavior:** Suggest practical dishes using common pantry assumptions only when clearly labelled. If a missing ingredient materially changes the dish, ask at most one useful clarification or show missing ingredients explicitly.

## F03 — Taglish leftover input

**Input:** `May leftover rice and egg ako.`

**Expected interpretation:** The user has cooked rice and egg and may want a quick meal.

**Required behavior:** Prefer practical leftover-friendly suggestions and show any additional ingredients needed. Do not assume a full pantry without labelling the assumption.

## F04 — Budget-constrained request

**Input:** `Budget meal lang, under P100 sana. May itlog at kamatis ako.`

**Expected interpretation:** The user wants an egg-and-tomato-based meal with an estimated total cost below P100.

**Required behavior:** Preserve the budget as a hard preference, show an estimated cost range, label the estimate, and explain when a suggestion may exceed the limit.

## F05 — Serving-constrained request

**Input:** `May sardinas at pechay ako. Pang-apat na tao.`

**Expected interpretation:** The user wants a meal for four people using sardines and pechay.

**Required behavior:** Generate suggestions with four servings and make the serving count visible before the recipe is opened. Later serving adjustment must scale quantities without corrupting units.

## F06 — Dietary preference

**Input:** `Vegetarian sana. May tofu, pechay, at mushroom ako.`

**Expected interpretation:** The user wants vegetarian suggestions from tofu, pechay, and mushroom.

**Required behavior:** Treat vegetarian as a constraint, show the applied preference, and avoid suggestions that conflict with it. Use guidance language rather than medical-safety language.

## F07 — Allergy-sensitive request

**Input:** `May peanut allergy ako. May gulay at tofu ako.`

**Expected interpretation:** Peanuts must be excluded, and hidden ingredients or cross-contact may still be possible.

**Required behavior:** Treat the allergy as safety-critical, exclude known peanut ingredients, show a visible warning to verify labels and cross-contact, and never claim the result is allergy-safe.

## F08 — Empty input

**Input:** ``

**Expected interpretation:** No generation request should be created.

**Required behavior:** Keep the user on the ingredient input state, explain what to enter, and do not make an OpenAI call.

## F09 — Unknown or unclear ingredient

**Input:** `May isang bagay na pang-ulam, di ko alam pangalan.`

**Expected interpretation:** The ingredient cannot be reliably normalized.

**Required behavior:** Ask the user to clarify or remove the unknown item. Never silently invent a normalized ingredient.

## Fixture acceptance rubric

For every fixture, the implementation must:

- Preserve the original input until the user confirms or edits it.
- Make normalized ingredients visible and removable.
- Preserve budget, serving, dietary, and allergy constraints.
- Avoid silent assumptions that materially change the recommendation.
- Label estimated cost and AI-generated content.
- Provide a useful recovery path when input is empty, unclear, invalid, or unsafe.
- Avoid medical or guaranteed-safety claims.

# Phase 3 Recipe Fixtures

These fixtures are the first golden recipe-quality set for Hapag. They are deliberately small and explainable so the static UI, schema validator, and future generation service can render the same contract.

## Fixture contract

Each fixture records:

- Available ingredients.
- Missing ingredients.
- Expected dish family.
- Positive constraints.
- Negative constraints.
- Domain notes that must remain visible to the user.

## R01 — Taglish pantry starter

**Input:** `May itlog, kamatis, sardinas, at pechay ako.`

**Expected suggestions:**

1. Sardines with egg and pechay.
2. Ginisang pechay with egg and tomato.
3. Sardine omelet with tomato.

**Available ingredients:** egg, tomato, canned sardines, pechay.

**Likely missing ingredients:** cooking oil, garlic, onion, rice.

**Must preserve:** fish and egg context, estimated cost note, available-versus-missing distinction, and a clear match reason for every suggestion.

## R02 — Adobo with incomplete pantry

**Input:** `May manok, bawang, suka, at toyo ako.`

**Expected dish family:** chicken adobo.

**Available ingredients:** chicken, garlic, vinegar, soy sauce.

**Possible missing ingredients:** onion, pepper, bay leaf, oil, rice.

**Positive behavior:** Explain that the available ingredients support the core adobo pattern.

**Incomplete behavior:** Do not require bay leaf or onion if the dish can proceed without them; show them as optional or missing context rather than inventing them as available.

## R03 — Sinigang with source-sensitive sourness

**Input:** `May baboy, kamatis, sibuyas, kangkong, at sampalok ako.`

**Expected dish family:** pork sinigang.

**Available ingredients:** pork, tomato, onion, water spinach, tamarind.

**Possible missing ingredients:** labanos, sitaw, okra, gabi, salt, rice.

**Must preserve:** tamarind as the souring source and vegetable cooking order.

**Negative constraint:** Do not replace sampalok with calamansi without explaining the flavor difference.

## R04 — Tortang talong with a missing binder

**Input:** `May talong lang ako.`

**Expected dish family:** eggplant-based meal, with tortang talong shown as requiring egg.

**Available ingredients:** eggplant.

**Missing ingredients:** egg, oil, salt.

**Positive behavior:** Offer tortang talong as a suggestion with egg clearly marked missing, or offer roasted or sautéed eggplant as a suggestion that does not require egg.

**Negative behavior:** Never present classic tortang talong as fully cookable from eggplant alone.

## R05 — Ginisang gulay with vegetarian constraint

**Input:** `Vegetarian sana. May pechay, sayote, kamatis, at tofu ako.`

**Expected dish family:** vegetarian ginisang gulay or tofu-and-vegetable sauté.

**Available ingredients:** pechay, chayote, tomato, tofu.

**Possible missing ingredients:** garlic, onion, oil, salt, soy sauce.

**Positive behavior:** Keep fish sauce, sardines, meat, and meat-based stock out of the suggestion.

**Safety note:** Soy sauce and tofu are soy-containing context and should remain visible if an allergy is later added.

## R06 — Budget sardines meal

**Input:** `Budget meal lang, under P100 sana. May sardinas at itlog ako.`

**Expected dish family:** sardines and egg with an optional leafy vegetable.

**Positive behavior:** Show an estimated range, state whether the estimate is for ingredients used or ingredients purchased, and identify any missing item that may push the total above the target.

**Negative behavior:** Do not guarantee that the meal will cost under P100 without a location-specific, fresh price reference.

## R07 — Allergy-sensitive exclusion

**Input:** `May peanut allergy ako. May tofu, pechay, at kanin ako.`

**Expected dish family:** tofu and vegetable rice or sautéed tofu and pechay.

**Must exclude:** peanuts and peanut-containing sauces where known.

**Must display:** verify packaged labels and cross-contact warning.

**Negative behavior:** Never label the result `peanut-free` or `allergy-safe` solely from the generated ingredient list.

## R08 — Negative vegetarian seafood case

**Input:** `Vegetarian ako. May sardinas at pechay ako.`

**Expected behavior:** Reject sardines as a compatible protein, explain the conflict, and ask the user to remove the vegetarian constraint or use a non-fish alternative.

**Negative behavior:** Do not suggest sardines with a vegetarian badge.

## R09 — Incomplete rice distinction

**Input:** `May bigas ako pero wala pang kanin.`

**Expected behavior:** Treat rice as uncooked and do not suggest fried-rice recipes that require cooked rice without showing the cooking prerequisite.

**Negative behavior:** Do not normalize `bigas` and `kanin` to the same availability state.

## R10 — Unclear ingredient case

**Input:** `May pang-gisa ako.`

**Expected behavior:** Ask for the actual ingredients or let the user choose from a clarification list. Do not normalize `pang-gisa` into garlic, onion, or oil without confirmation.

## Fixture review matrix

| Fixture | Positive case | Negative case | Incomplete case | Primary rule |
|---|---:|---:|---:|---|
| R01 | Yes | No | No | Taglish normalization and match explanation |
| R02 | Yes | No | Yes | Core dish pattern and optional ingredients |
| R03 | Yes | Yes | No | Souring source and cooking order |
| R04 | Yes | Yes | Yes | Missing binder must remain visible |
| R05 | Yes | Yes | No | Vegetarian exclusion and soy context |
| R06 | Yes | Yes | Yes | Cost estimate uncertainty |
| R07 | Yes | Yes | No | Allergy warning without safety guarantee |
| R08 | No | Yes | No | Hard dietary exclusion |
| R09 | No | Yes | Yes | Uncooked versus cooked rice |
| R10 | No | Yes | Yes | No silent normalization of vague terms |

## Fixture rendering requirements

The Phase 8 static UI and Phase 9 schema engine must render these fixtures with:

- Available and missing ingredients separated.
- Time, difficulty, servings, and estimated cost visible.
- Match reason visible before the user opens detail.
- Substitution and safety notes preserved.
- Invalid or conflicting constraints represented as a recovery state.
- No raw model prose required to fill a missing structured field.

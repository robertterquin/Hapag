# Phase 3: Filipino Recipe Domain Research

**Status:** Implemented; ready for Phase 3 sign-off

This document defines the initial Filipino recipe vocabulary, dish patterns, measurement conventions, cost assumptions, substitution boundaries, and safety rules that the Hapag frontend, fixtures, validator, and future OpenAI prompt must share.

## Research boundary

Hapag is a practical cooking assistant, not a nutrition or medical product. This phase defines cooking-domain behavior and transparent estimates. It does not create clinical nutrition claims or certify recipes as safe.

Reference sources:

- The [Philippine Statistics Authority Retail Price Survey](https://psa.gov.ph/retail-price-survey) provides the intended source structure for regional and commodity-level reference prices.
- The [DOST-FNRI Philippine Food Composition Tables](https://i.fnri.dost.gov.ph/fct/library) are a possible future reference for nutrition data. They are not used to make medical claims in the MVP.
- The [USDA Food Safety and Inspection Service leftovers guidance](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety) supports conservative leftover-handling copy and is not a substitute for local regulatory advice.
- The [US FDA food-allergy guidance](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies) is used as a general reference for the distinction between ingredient labeling and cross-contact. Hapag must still avoid claiming allergy safety.

## Domain principles

1. Filipino terms are accepted as aliases, not treated as a forced language mode.
2. A normalized ingredient keeps the user's original wording for correction and transparency.
3. Ingredient availability is separate from recipe requirements.
4. A dish suggestion must explain the cooking pattern it is using.
5. Substitutions preserve method where possible and disclose taste, texture, time, or allergen changes.
6. Cost is a reference estimate with a source, unit, location, and freshness date.
7. Raw or undercooked food is not presented as an ordinary low-risk shortcut.
8. Allergy and dietary labels are constraints and warnings, never guarantees.
9. Recipe fixtures must include positive, negative, and incomplete cases.

## Canonical ingredient vocabulary

These aliases are initial product vocabulary. They are not exhaustive and should be expanded from real user inputs during evaluation.

| Canonical ingredient | Accepted aliases and variants | Notes |
|---|---|---|
| egg | itlog, itlog ng manok, egg | Flag when the user has an egg allergy. |
| tomato | kamatis, kamatis na pula, tomato | Common base for sautéed dishes and sour soups. |
| onion | sibuyas, bombay, pulang sibuyas, onion | Preserve the user's variety when known. |
| garlic | bawang, garlic | `Butil ng bawang` means a garlic clove. |
| ginger | luya, ginger | Useful for soups and fish; do not assume it is available. |
| chicken | manok, chicken, native chicken | Meat type and cut remain separate fields. |
| pork | baboy, pork, liempo, kasim | `Liempo` and `kasim` are cuts, not full pork aliases. |
| fish | isda, fish, bangus, tilapia | Preserve species when provided. |
| canned sardines | sardinas, sardinas na de-lata, canned sardines | Mark as canned fish; brand is not a recipe requirement. |
| tofu | tokwa, tofu, tokwa't tofu | Flag soy when allergy context is present. |
| eggplant | talong, eggplant | `Tortang talong` requires a separate egg constraint. |
| pechay | pechay, bok choy, pak choi | Preserve the user's exact variety when supplied. |
| water spinach | kangkong, water spinach | Cooking time and texture differ from pechay. |
| string beans | sitaw, string beans | Keep `sitaw` as the preferred display term in Filipino copy. |
| chayote | sayote, chayote | Often used in soups and sautéed vegetables. |
| squash | kalabasa, squash | Preserve whether it is fresh or pre-cut. |
| coconut milk | gata, kakang gata, coconut milk | `Kakang gata` is thicker first extract; do not silently equate it with all gata. |
| rice | bigas, kanin, rice, leftover rice, bahaw | Distinguish uncooked `bigas` from cooked `kanin`. |
| soy sauce | toyo, soy sauce | Flag soy and possible gluten according to the product label, not the dish name alone. |
| fish sauce | patis, fish sauce | Flag fish; it is not vegetarian. |
| vinegar | suka, vinegar, sukang paombong, sukang sasa | Preserve vinegar type when supplied because flavor varies. |
| calamansi | calamansi, kalamansi | Use as an acidic citrus ingredient, not a direct tamarind equivalent. |
| tamarind | sampalok, tamarind, sinigang mix | A packaged mix is not the same as fresh fruit; preserve source. |
| chili | sili, siling labuyo, siling haba, chili | Preserve variety and allow spice adjustment. |
| salt | asin, salt | Use sparingly in low-sodium contexts. |
| black pepper | paminta, pamintang durog, pepper | Preserve ground or whole form when known. |

## Filipino measurement and action vocabulary

| Product term | English interpretation | Rendering rule |
|---|---|---|
| kutsara | tablespoon | Display as `kutsara (tbsp)` when the user's language is mixed. |
| kutsarita | teaspoon | Display as `kutsarita (tsp)` when clarification helps. |
| tasa | cup | Keep quantity numeric and unit separate. |
| kalahating tasa | half cup | Normalize to `0.5 tasa` for calculation while retaining the phrase for display. |
| pakurot | pinch | Do not scale aggressively; keep as a qualitative small amount. |
| piraso | piece | Use for eggs, tomatoes, chilis, and similar countable items. |
| butil | clove or grain | Resolve from ingredient context; ask when ambiguous. |
| tali | bunch | Use for leafy vegetables when sold by bundle. |
| hiwa | slice or cut piece | Preserve the cut description in preparation notes. |
| gisa | sauté until aromatic | Pair with an observable action such as `igisa ang bawang at sibuyas`. |
| prito | fry | State oil and doneness context where required. |
| pakuluan | boil or simmer | State whether the user should maintain a boil or lower the heat. |
| palambutin | cook until tender | Include a time or observable doneness cue when possible. |
| ihawin | grill | Avoid assuming a grill is available; offer pan or oven alternatives only with a clear change note. |
| timplahan | season to taste | Include the ingredient being adjusted and avoid hiding salt-heavy assumptions. |
| sangkutsa | pre-cook or brown before the next method | Pair with a direct action because household usage varies. |

## Dish patterns and initial coverage

### Adobo pattern

Typical pattern: aromatics plus meat, tofu, or vegetables, seasoned with soy sauce and vinegar, then simmered until the main ingredient is cooked and the sauce is reduced.

Domain rules:

- Chicken, pork, tofu, egg, and selected vegetables can produce distinct adobo variants.
- Replacing soy sauce with salt changes color, flavor, and allergen context; show the tradeoff.
- Replacing meat with tofu changes texture and requires a vegetarian label.
- Do not promise a fixed soy-to-vinegar ratio without validating the fixture.

### Sinigang pattern

Typical pattern: sour broth with aromatics, a protein or vegetable base, and vegetables added according to cooking time.

Domain rules:

- Sourness may come from sampalok, kamias, bayabas, or a packaged mix; preserve the source.
- Gabi, kangkong, labanos, sitaw, okra, and other vegetables vary by household and region.
- Calamansi is an acidic substitute with a different flavor and should not be presented as identical to sampalok.
- A meat or seafood variant must retain its cooking and safety context.

### Tortang talong pattern

Typical pattern: cook eggplant until soft, remove or keep the skin according to preparation, flatten, coat with egg, and pan-fry.

Domain rules:

- Eggplant alone is not enough to promise the classic egg-coated dish; show egg as missing.
- Tofu or flour alternatives change the dish identity and must be named as a variation.
- `Torta` is a dish family term, not a guarantee that the result contains a specific filling.

### Ginisang gulay pattern

Typical pattern: sauté aromatics, add vegetables in cooking-time order, season, and finish when tender but not overcooked.

Domain rules:

- Pechay, kangkong, sitaw, sayote, kalabasa, and tomato can combine, but cooking times differ.
- Do not treat leafy greens and firm vegetables as interchangeable without adjusting order and time.
- Fish sauce is not vegetarian; soy sauce may introduce soy and possibly gluten depending on the product.

### Sardines, egg, and pechay pattern

Typical pattern: warm canned sardines with aromatics, add vegetables, and finish with egg or serve as an omelet-style variation.

Domain rules:

- Canned sardines count as available fish protein but do not remove the need to check the can label.
- Egg-free suggestions must not use egg as a hidden binder or garnish.
- Pechay can be replaced with kangkong only with a texture and cooking-time note.

## Region and category coverage

The initial domain set uses familiar dish families without claiming that one version is the only authentic version.

| Category | Initial examples | Domain note |
|---|---|---|
| Breakfast | tortang talong, itlog na may kamatis, sinangag | Prefer quick, low-complexity suggestions. |
| Lunch or dinner | adobo, sinigang, ginisang gulay | Show rice pairing as optional context. |
| Merienda | turon-style banana snack, camote cue-style snack | Add a future fried-food safety review before enabling broadly. |
| Baon | omelet, adobo flakes-style leftovers, ginisang gulay | Include portability and reheating caveats later. |
| Budget meals | sardines with egg and pechay, tofu and vegetables | Use estimated ranges, not guaranteed totals. |
| Vegetarian | tofu adobo, ginisang gulay, tortang talong without meat | Exclude fish sauce, sardines, and meat. |
| Regional exploration | Bicol-style gata and sili dishes, sour soups, regional vinegar variants | Regional naming and authenticity need user research before ranking. |

MVP generation should prefer cooked, familiar dishes with clear steps. Raw or undercooked dishes, especially raw seafood preparations, should not be generated as ordinary defaults until a separate safety and review decision is made.

## Cost-estimate model

The cost model is an estimate engine, not a live price promise.

### Required price-reference fields

```text
ingredient
canonicalUnit
minPrice
maxPrice
location
source
updatedAt
confidence
```

The initial source contract follows the PSA Retail Price Survey categories and supports regional or city-level replacement later. Seed values used in fixtures are illustrative prototype bands only and must not be presented as current market prices.

### Prototype bands for fixture behavior

| Ingredient class | Example unit | Prototype band | Confidence |
|---|---|---:|---|
| Egg | per piece | P8–P15 | Low until location is selected. |
| Tomato, onion, garlic | per piece or clove | P3–P25 | Low; varies by size and season. |
| Leafy vegetables | per bundle | P15–P50 | Low; varies by market and bundle size. |
| Canned sardines | per can | P20–P50 | Medium for packaged retail; brand varies. |
| Tofu | per block | P25–P70 | Low; block size varies. |
| Rice | cooked-cup equivalent | P8–P20 | Low; depends on rice type and serving conversion. |
| Chicken or pork | per 500 g | P120–P350 | Low; cut and location vary substantially. |
| Pantry seasoning allowance | per recipe | P3–P20 | Very low; use only when the user did not provide staples. |

Cost rules:

- Show a range when source freshness or location confidence is low.
- Do not charge the user for the full package when only a portion is used unless the UI explicitly distinguishes `estimated used amount` from `buying cost`.
- Keep missing ingredients separate from available ingredients.
- Explain that actual purchase cost may exceed the recipe-use estimate.
- Use `Tantya lang ang presyo.` in the interface.

## Substitution matrix

| Original | Candidate substitute | Allowed context | Required disclosure |
|---|---|---|---|
| Pechay | Kangkong | Sautéed or soup dishes | Texture and cooking time change. |
| Chicken | Tofu | Adobo or sautéed dishes | Vegetarian variant; protein texture and flavor change. |
| Fish sauce | Soy sauce or salt | Non-vegetarian dishes | Fish flavor changes; soy and label checks may apply. |
| Sampalok | Kamias or calamansi | Sour soup or finishing acid | Sourness and aroma change; adjust gradually. |
| Soy sauce | Salt | When color and umami are not essential | Color, flavor, and soy context change. |
| Egg | Tofu or flour-based binder | Only when the recipe is explicitly reclassified | Binding and texture change; never present as the same dish. |
| Fresh tomato | Canned tomato | Sauces or stews | Acidity and sweetness vary; check added salt. |

Never suggest a substitution that introduces a known user allergy or contradicts a dietary exclusion. When the replacement is not method-preserving, show it as a separate variation rather than silently rewriting the recipe.

## Safety and quality rules

- Do not claim an allergy-safe result. Show ingredient-label and cross-contact verification language.
- Do not hide fish sauce, soy sauce, egg, dairy, peanuts, tree nuts, shellfish, or other known risk ingredients when present in a recipe or packaged product.
- Keep raw chicken, pork, fish, and egg handling steps explicit and separate from ready-to-eat steps.
- Avoid instructions that rely on appearance alone for safety-critical doneness.
- Leftover guidance should encourage prompt refrigeration, shallow containers, and reheating checks; do not infer that a leftover is safe merely because it looks or smells normal.
- Reject or flag impossible steps, missing quantities, missing cooking actions, and contradictory temperatures.
- Regional authenticity is contextual: use `style`, `variant`, or `inspired by` language when the fixture is not intended to represent a single authoritative version.

## Phase 3 exit gate

Phase 3 is complete when:

- The canonical vocabulary covers the Phase 1 and Phase 2 golden inputs.
- The initial dish families have positive, negative, and incomplete fixtures.
- Units and cooking terms have display and normalization rules.
- Substitutions disclose method, flavor, texture, time, or allergen changes.
- Cost assumptions have units, confidence, and a replacement path to reference data.
- Safety rules cover allergies, raw or undercooked ingredients, leftovers, and unverifiable claims.
- The recipe fixture set is ready to be consumed by the Phase 8 static UI and Phase 9 schema engine.

## Transition to Phase 4

Phase 4 should map these domain rules into routes, screen ownership, anonymous versus signed-in states, and the complete state matrix. Do not add new screens merely because a domain concept exists; the scope rule from Phase 2 still applies.

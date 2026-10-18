# Phase 18: UI/UX Enhancements

This phase reworks the main journey (Home → Ulam AI → Results → Recipe → Cooking Mode) based on a walkthrough of the app at 375px and desktop widths. Visual polish matters less here than reducing scroll and taps on the ingredient screen, making Cooking Mode usable with messy hands, and making sure results never look broken or irrelevant.

Phases run in order. 18.3, 18.4 and 18.5 depend only on 18.1 and can be built in parallel or in any order.

```text
18.0 Baseline ─► 18.1 Foundations ─┬─► 18.2 Ingredient flow ─┐
                                   ├─► 18.3 Results          ├─► 18.6 Desktop + QA
                                   ├─► 18.4 Recipe detail    │
                                   └─► 18.5 Cooking Mode ────┘
```

Size: S ≈ half a day, M ≈ 1–2 days, L ≈ 3+ days.

## Phase map

| Phase | Outcome | Size | Exit gate |
|---|---|---|---|
| 18.0 Baseline | Green checks and before screenshots | S | `typecheck`, `test`, `lint`, `build` all pass |
| 18.1 Foundations | Shared tokens and components for later phases | M | New components used in at least one screen; no visual regressions |
| 18.2 Ingredient flow | Input to "Let's Cook" without long scrolling | L | At 375px, selected ingredients and the cook button stay visible while adding |
| 18.3 Results | Results are relevant, honest, and scannable | M | No-AI mode returns catalog matches; no mismatched photos |
| 18.4 Recipe detail | Clear primary action; links survive reload | M | Refreshing `/recipes/:id` after generation still shows the recipe |
| 18.5 Cooking Mode | Full-screen, hands-friendly cooking | L | A full recipe can be cooked with no scrolling at 375px |
| 18.6 Desktop and QA | Wide layouts, accessibility, final review | M | QA matrix below passes |

---

## 18.0 Baseline

**Why:** On `main`, 10 of 82 tests and 12 lint checks fail. UI work on top of a red baseline hides real regressions.

- Fix or update the 10 failing tests. Several (`ui-enhancement`, `colors`, `foundation`) match regexes against the source code and fail because copy or tokens changed, not because behaviour broke. Update the expected strings, or replace them with checks on what the code actually does.
- Fix the 12 lint errors:
  - **Impure calls during render** in `ChefKalabaw.tsx` and `CookingPage.tsx`: move `Math.random` and `Date.now` calls into `useMemo`, `useState` initialisers, or effects.
  - **Synchronous `setState` in an effect** in `ProfilePage.tsx` and `IngredientAutocomplete.tsx`: derive the state, or reset it with a `key` instead.
  - **Empty `catch {}` blocks**: add a comment, or handle the error properly.
- Take before screenshots of every route at 375px and 1280px for comparison later.

**Exit:** all four npm checks pass.

**Status: done.**
- 9 tests were updated: they checked for exact text, comments or old colour names that later commits deliberately changed.
- The Phase 15 test was failing because of a real bug: `tomato` was allowed as the sour ingredient for Sinigang na Manok, so "pork, tomato, onion" suggested it. That rule is fixed in `dishMatchingRules.ts`.
- All 12 lint errors are fixed.
- Before screenshots are in `docs/screenshots/phase-18-baseline/`.

## 18.1 Foundations

**Why:** Later phases reuse the same building blocks. Build them once.

- **Brand colour decision (needs your input).** `index.css` deliberately maps `--color-ube` to Radix orange, while the README and `docs/06-color-system.md` still describe ube purple. Pick one:
  - (a) Restore ube for brand and navigation, keep orange or mango for primary actions, and use calamansi for "you have".
  - (b) Keep orange and update the docs.

  Either way, rename the tokens so the names match the colours.
- **New components** in `src/components/`:
  - `StickyActionBar`: a bottom-anchored primary action that sits above the nav, accounts for the phone's safe-area inset, and gets out of the way when the keyboard is open.
  - `BottomSheet`: an accessible dialog with focus trap, Esc to close, swipe-down to dismiss, and reduced-motion support.
  - `SegmentedControl`: a row of option buttons to replace `<select>` menus for servings, spice, budget and diet.
  - `IngredientChip` variants: `have` (green), `missing` (tomato red, for required items only), `staple` (neutral, "Probably in your kusina") and `substitute`.
- **Bottom nav (`AppShell.tsx`):** remove the boxed outline on each tab and show a single active highlight. Optionally make Ulam AI a raised centre button.
- **Header avatar:** show "Sign in" or a neutral icon when signed out, instead of the "U".

**Exit:** the components are used in at least one screen, and the colour tests are updated to match the decision.

**Status: done.** Option (a) was chosen: ube is the brand colour and orange is used only for primary actions.
- Primary buttons use `orange-11`. White text on the old `orange-9` was only 2.97:1.
- Fixed 19 references to `--teal-*` and `--slate-*`. Those palettes were no longer imported, so the styles that used them had been silently broken.
- Where the new components are used:
  - `IngredientChip`: results cards.
  - `SegmentedControl`: budget and spice on `/ulam`.
  - `StickyActionBar`: "Let's Cook!" on `/ulam`.
  - `BottomSheet`: built, but not yet used on any screen. Phase 18.2 is where it gets wired in, for preferences.

## 18.2 Ingredient flow (Home + `/ulam`)

**Why:** This is the screen that matters most. On a phone, the cook button currently sits about 4 screens below the input.

- **Home:** make the hero the ingredient input ("Ano'ng ulam?") with 3–4 example chips. Submitting goes straight to `/ulam` with the ingredients filled in. Move the long intro copy below the input.
- **`/ulam` layout:** input, then selected-ingredient chips directly under it, then the pantry picker. Preferences move into a `BottomSheet`, opened from a summary line ("3 servings · Mild · Any budget").
- **Cook bar:** a `StickyActionBar` reading "N sangkap · Let's Cook →". It is disabled with a hint when no ingredients are selected.
- **Autocomplete bug:** give `IngredientAutocomplete` a solid background, keep it above other content, and limit its height so it doesn't overlap the helper text and Add button.
- **Pantry picker (`KusinaShelf.tsx`):**
  - Category tabs show counts.
  - Chips get an icon or emoji.
  - A pinned **Staples** group (garlic, onion, oil, salt, soy sauce, vinegar) can be switched on in one tap and is remembered.

  Signed-out users' staples live in `localStorage`. Signed-in users' staples go to the existing `pantry_items` table, which also gives `persistenceService` its first pantry methods.
- **Display language:** chips follow the profile's Language setting, and default to "Manok (chicken)" for Taglish. Today, English input comes back as Tagalog chips.
- **Surprise me!** Pick a random high-scoring catalog dish for the current ingredients. With no ingredients, pick a random everyday ulam.
- **Allergy note:** one full-width line with an icon.

**Tests:** staples persistence, chip label formatting for each language, and the Surprise me selection logic.
**Exit:** at 375px, a user can add five ingredients and start generation without scrolling past the pantry.

**Status: done.**
- **Your decisions:**
  - Chips default to Taglish, e.g. "Manok (chicken)". They follow the Profile language setting for signed-in users. Signed-out users always see Taglish.
  - Signed-in users' staples sync to Supabase `pantry_items`. Signed-out users' staples are saved in the browser. On first sign-in, the browser's staples are copied to the account.
- **Home:** the hero is now an ingredient input with four example combos, "Surprise me!", and "Browse the pantry instead".
- **`/ulam` order:** input, selected ingredients, staples card ("Add my staples", with an Edit sheet), pantry (emoji, counts, stacked English name), preferences summary with a BottomSheet, one-line allergy note, then the sticky Cook bar.
- **Surprise me** is offered only while the list is empty. It fills the list with a random everyday dish's ingredients and explains what it did. Adding a dish's ingredients to a list you already started would mark things as available that you may not have.
- **BottomSheet** now restores focus to the button that opened it, because Safari doesn't focus buttons on click.
- **Autocomplete:** the dropdown gets its own stacking layer, so it stays above the form.
- **Tests:** the Phase 13 guard on legacy pantry code now allows `pantry_items` only inside the `*PantryStaple` methods.

## 18.3 Results

- **No-AI fallback:** when `hasRecipeGenerationConfig` is false, or the AI request fails, build results from `matchRecipeCatalog` instead of the sample recipes. Each catalog dish is turned into a full recipe card, labelled "Catalog match", with an empty "steps coming soon" state if needed. The edge function's grounding rules stay unchanged.
- **Card order:** a "You have 4 of 5" progress bar comes first, then cost and time, then the title. Ingredient chips use the new `IngredientChip` variants.
- **Staples vs missing:** add a small `isPantryStaple()` helper, shared by the cards and the detail page. Staples are never shown in red.
- **Feedback:** collapse the four feedback buttons to 👍/👎, with the detailed reasons in a menu. Reranking stays as it is.
- **Images (needs your input):** either (a) use real, correctly matched dish photos with credits, or (b) show a branded illustration or colour tile for each dish category. Never use an unrelated stock photo.
- **States:** the skeleton matches the new card layout, and the empty state suggests one missing ingredient that would unlock more dishes.

**Tests:** fallback returns catalog matches for an adobo set (chicken, soy sauce, vinegar, garlic), and `isPantryStaple()` is covered.
**Exit:** adobo ingredients with no `.env` return adobo-family dishes.

**Status: done.**
- **Your decision:** use real dish photos with credits.
  - `src/data/dishPhotos.ts` has 45 freely licensed photos from Wikimedia Commons (CC0, CC BY, CC BY-SA). Each was checked by eye to show the named dish. Rejected candidates included menudo that was sweet-and-sour pork, raw packaged noodles, and paksiw photographed with houseflies.
  - Every photo shows the author and licence, linked to its Commons page.
  - Photos match only on the exact dish name. "Adobong Manok sa Gata" and "Sarciadong Tilapia" get no photo rather than a near match.
  - Pancit Bihon and most other dishes have no photo yet and show a branded "No photo yet" tile.
  - The three sample recipes no longer use unrelated Unsplash stock photos.
- **Fallback:** when AI isn't set up or fails, results show catalog matches as "dish idea" cards with have/to-buy/staple chips, alongside any sample recipe that truly matches.
  - Sample recipes now need every ingredient they treat as on hand. Garlic alone no longer pulls in the sardines recipe.
  - Catalog matches have no steps or prices, so they aren't turned into full recipes.
- **Cards:**
  - Order is now a "You have X of Y" bar, then the title, then price, time and difficulty.
  - Ingredients are grouped as "To buy" and "Probably in your kusina". `isPantryStaple()` / `getIngredientStatus()` are shared with the detail page.
  - Feedback is 👍/👎, and 👎 opens the three reasons.
- **States:** the loading skeleton mirrors the new card. The empty state suggests the one pantry item that unlocks the most dishes, e.g. "Add Manok (chicken) to unlock 2 dishes".

## 18.4 Recipe detail

- **Action bar:** a `StickyActionBar` with **Start cooking** and a save ♥.
- **Section order:** summary stats, ingredients with the servings stepper, steps preview, substitutions, then "Why it works".
- **Shopping list:** missing items become a list with peso estimates, with Copy and Share buttons (`navigator.share` where available).
- **Links that survive reload:** keep the last generated results in `sessionStorage` and hydrate `recipeService`'s cache from it on load. A missing recipe shows a friendly state with "Back to results" and "Start over" options.

**Tests:** a cache round-trip through `sessionStorage`, and a corrupt-storage fallback.
**Exit:** generate, open a recipe, refresh, and the recipe still renders.

**Status: done.**
- **Sticky action bar:** compact Save (♥) and a wide "Start cooking". On desktop it's capped at 460px and right-aligned.
- **Section order:** summary stats, ingredients with the servings control, shopping list, steps, substitutions (hidden if there are none), then "Why it works". Cost and the safety note sit in the side column. The safety note says "AI-generated" only for AI recipes.
- **Shopping list:**
  - Lists only "to buy" items, with quantities scaled to the chosen servings.
  - Peso prices come from the recipe's own cost lines, matched by canonical name (e.g. "Eggs" matches "Itlog").
  - Staples can be included with a checkbox.
  - Copy, plus Share where `navigator.share` exists. When the browser blocks the clipboard, the list appears in a pre-selected text box.
- **Links that survive reload:**
  - AI recipes are saved to `sessionStorage` (newest 12) and re-validated against the recipe schema on load.
  - A missing recipe shows "We couldn't find that recipe" with "Start over" and "Back to results".
  - `/results` after a reload shows "No search yet" instead of an empty list.
- **Bugs fixed along the way:**
  - The sticky bar's keyboard check now requires a focused text field. Pinch-zoom and viewport differences had been hiding the bar.
  - The 18.1 rule that made a lone sticky button full width also overflowed two-button bars.
  - The 18.3 hero photo kept the browser's default `<figure>` margin and overflowed on phones.

## 18.5 Cooking Mode

- **Full-screen:** the `cooking` route hides the app header and bottom nav, and has its own slim top bar with ✕ (exit), the title and "2 / 4".
- **One step per screen:** large type, swipe left or right plus big Prev and Next buttons, and the step counter shown only once. The existing wake lock and voice readout stay as they are.
- **Ingredients for this step:** derive which ingredients a step uses by matching ingredient names in the step text, so the recipe schema doesn't change.
- **Timer:** −1m, the time and +1m on one row. While a timer is running it stays visible as a pill when you move to another step, and alerts through the existing `audioAlert`.
- **Finish screen:** "Luto na! 🎉" with mark-as-cooked (signed-in users), a 👍/👎 rating, and "Use the leftovers" (back to `/ulam` with the unused ingredients prefilled).

**Tests:** step-ingredient matching for the adobo and sinigang fixtures.
**Exit:** a full recipe can be cooked at 375px with no vertical scrolling, and the screen stays awake.

## 18.6 Desktop and QA

- **Desktop `/ulam`:** two columns. Pantry on the left; selected ingredients, preferences and the cook button in a pinned right column.
- **Desktop results:** a 3-column card grid. The recipe detail page shows ingredients and steps side by side.
- **Accessibility:** tap targets at least 44px, chips labelled for screen readers (e.g. "Remove manok"), visible focus on all new components, and the Chef Kalabaw and sheet animations respect `prefers-reduced-motion`.
- **Performance:** lazy-load images with fixed sizes so cards don't jump. Split the cooking route into its own bundle; the build currently warns that the main bundle is too large.

### QA matrix

| Check | 320 | 390 | 768 | 1280 |
|---|---|---|---|---|
| Home → Ulam → Results → Detail → Cook → Finish | ✓ | ✓ | ✓ | ✓ |
| Keyboard-only flow | | | | ✓ |
| Reduced motion | ✓ | | | ✓ |
| No-AI fallback and AI error state | ✓ | | | ✓ |
| Signed-in save, staples and cooked history | | ✓ | | ✓ |

**Exit:** the matrix passes, after screenshots are compared with the 18.0 baseline, and the README feature list is updated.

## Open decisions

1. **Brand colour:** restore ube purple, or keep orange (18.1).
2. **Recipe images:** real photos or category illustrations (18.3).
3. **Default display language** for ingredient chips (18.2).
4. **Staples for signed-in users:** sync to Supabase `pantry_items` now, or keep them in `localStorage` for this phase (18.2).

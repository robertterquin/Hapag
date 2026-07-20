# Phase 2: Scope and Success Criteria

**Status:** Implemented; ready for Phase 2 sign-off

This document converts the Phase 1 product definition into a prioritized MVP contract. It is the scope authority for the first Hapag release and should be used when deciding whether a feature belongs in the current implementation.

## MVP in one sentence

Hapag lets a Filipino home cook enter available ingredients, compare three practical recipe suggestions, adapt a chosen recipe, cook through guided steps, and save the result.

## Scope rule

A feature belongs in the first release only if it helps the user:

1. Decide what to cook.
2. Understand how to prepare it.
3. Adapt it to their household constraints.
4. Remember it for later.

If a feature does not support one of those outcomes, it is deferred or out of scope.

## Build now: core MVP

### 1. Ingredient discovery

Users can enter a non-empty ingredient list in English, Tagalog, or Taglish. The system displays normalized ingredients as editable chips before generation.

### 2. Constraint refinement

Users can adjust or remove ingredients and optionally provide servings, budget, dietary preferences, allergy information, and spice preference where relevant.

### 3. Recipe suggestions

The system returns three structured recipe suggestions containing a dish name, match reason, available and missing ingredients, servings, time, difficulty, estimated cost, and relevant dietary context.

### 4. Recipe understanding

Users can open a suggestion and view ingredients, quantities, cost breakdown, substitutions, cooking steps, and trust notes.

### 5. Recipe adaptation

Users can adjust servings and view substitutions without losing ingredient context, units, step order, or safety warnings.

### 6. Cooking mode

Users can follow one step at a time, see progress, use an optional timer, pause or resume, and finish the cooking session.

### 7. Remembering decisions

Anonymous users can explore and generate. Signed-in users can save, favorite, reopen, delete, and mark recipes as cooked.

### 8. Responsive and resilient experience

The primary flow works on a 320px-wide mobile viewport and larger screens. Empty, loading, no-result, error, retry, offline, rate-limit, authentication-required, and successful-save states are represented.

## Build next: after the core loop

These features are valuable but must not delay proof of the core journey:

- Pantry CRUD and pantry-based generation.
- Leftover transformations.
- Recent-ingredient shortcuts.
- Expanded personalization and regional preferences.
- More complete meal-mode browsing and recipe categories.

Pantry is a planned product area and may be added in Phase 13 after persistence and recipe controls are stable.

## Deferred from the first release

- Photo ingredient recognition.
- Voice input and transcript confirmation.
- Weekly meal planning.
- Recipe sharing and public profiles.
- PDF or image recipe cards.
- Grocery marketplace, shopping, or ordering.
- Real-time price guarantees.
- Guaranteed nutrition or medical advice.
- Autonomous web shopping.
- Public community recipe network.

## Screen contract

### Core screens

| Screen | Purpose | Required states |
|---|---|---|
| Home | Start ingredient discovery | Empty, filled, validation error, loading |
| Recipe results | Compare three suggestions | Loading, success, no results, error, retry |
| Recipe detail | Understand and adapt a recipe | Loading, success, missing data, save success |
| Cooking mode | Follow the recipe safely | Ready, active, paused, timer active, completed |
| Saved recipes | Reopen saved and cooked recipes | Authentication required, empty, populated, delete confirmation |
| Profile/preferences | Manage defaults and dietary context | Signed out, signed in, saved, validation error |

### Post-core screen

| Screen | Purpose | Required states |
|---|---|---|
| Pantry | Track ingredients and generate from them | Empty, populated, add, remove, stale item, error |

## MVP acceptance criteria

### AC-01: Ingredient input

- A user can submit ingredients in English, Tagalog, or Taglish.
- Empty input is rejected before any model or backend call.
- The original input remains available for correction.
- Normalized ingredients are visible and removable.
- Unclear ingredients are not silently invented.

### AC-02: Constraint handling

- Serving, budget, dietary, allergy, and spice constraints are visible when applied.
- Dietary and allergy exclusions are carried into the generation request.
- Allergy messaging does not claim clinical safety or eliminate cross-contact risk.
- A missing or conflicting constraint produces an understandable clarification or warning.

### AC-03: Suggestions

- A valid request returns three suggestions or a useful fallback.
- Every suggestion displays title, match reason, time, difficulty, servings, and estimated cost.
- Available and missing ingredients are visually distinct.
- Prices are labelled as estimates.
- An AI or network failure preserves the user's input and offers retry or curated fallback content.

### AC-04: Recipe detail

- A chosen recipe displays structured ingredients, quantities, units, steps, substitutions, and cost breakdown.
- Each step has an ordered action and enough amount or timing context to be understandable.
- AI-generated content and cost uncertainty remain visible.
- Invalid recipe data cannot render as a broken or misleading detail page.

### AC-05: Recipe controls

- Serving adjustment updates quantities consistently.
- Unit labels are not corrupted by scaling.
- Steps remain ordered and readable after adjustment.
- Substitutions explain taste, texture, or cooking-method tradeoffs.
- Dietary and allergy warnings remain visible after changes.

### AC-06: Cooking mode

- The user can move forward and backward through steps.
- Progress is visible.
- The user can pause and resume.
- A timer can be started, paused, and completed without blocking navigation.
- Finishing shows a clear completion state and offers save or cooked-history actions.

### AC-07: Authentication and saved data

- Anonymous users can complete exploration and generation.
- Saving requires authentication and explains why.
- Signed-in users can save, unsave, reopen, delete, favorite, and mark a recipe as cooked.
- User-owned data is protected by Supabase Row Level Security.
- A second user cannot read or modify the first user's saved data.

### AC-08: Accessibility and responsive behavior

- The primary flow works at 320px width without horizontal scrolling or overlapping actions.
- Interactive controls have visible focus states and at least 44px touch targets.
- Semantic labels, headings, buttons, landmarks, and image alternatives are present.
- Status is not communicated by color alone.
- Reduced-motion preferences are respected.

### AC-09: Safety and transparency

- The interface states that recipes are AI-generated suggestions.
- Estimated costs are labelled and caveated.
- Dietary labels are not presented as medical advice.
- Allergy warnings require ingredient and label verification.
- The product remains useful when OpenAI is unavailable.

## Success metrics

The first release should measure decision quality and recovery, not raw text volume.

### Primary metrics

- Time from opening the app to a readable recipe suggestion.
- Percentage of valid generation responses passing schema and constraint validation.
- Percentage of suggestion sessions that open a recipe.
- Percentage of opened recipes that are saved or marked cooked.
- Successful serving-adjustment rate without user correction.
- Successful substitution-view rate without loss of context.

### Reliability and safety metrics

- AI timeout, invalid-output, and rate-limit frequency.
- Fallback usage rate and fallback success rate.
- Percentage of requests blocked before model generation because input is empty or invalid.
- Critical accessibility issues in the primary journey.
- Mobile layout defects at 320px width.
- Cross-user data-isolation test results.

## Golden evaluation set

Phase 2 uses the Phase 1 input fixtures as the minimum scope set:

- Complete Taglish ingredients.
- Incomplete ingredient list.
- Leftover ingredients.
- Budget-constrained request.
- Serving-constrained request.
- Dietary preference.
- Allergy-sensitive request.
- Empty input.
- Unknown ingredient.

Recipe-quality fixtures for familiar dishes, including adobo, sinigang, tortang talong, ginisang gulay, and an incomplete pantry example, are added during Phase 3 domain research.

## Phase 2 exit gate

Phase 2 is complete when:

- Every proposed feature is classified as build now, build next, deferred, or out of scope.
- Every build-now feature has a measurable acceptance criterion.
- The first-release screen list and state coverage are explicit.
- Anonymous and signed-in behavior is explicit.
- Safety, accessibility, fallback, and privacy requirements are included in acceptance checks.
- Success metrics are defined for usability, reliability, safety, and data isolation.
- No core feature depends on Pantry, photo input, voice input, or meal planning.

## Transition to Phase 3

Phase 3 should define Filipino dish fixtures, ingredient aliases, measurements, regional terms, price assumptions, and substitution cautions. Those domain rules must be created before the frontend or AI output is judged against recipe quality.

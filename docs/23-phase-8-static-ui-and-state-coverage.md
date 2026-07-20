# Phase 8: Static UI and State Coverage

**Status:** Implemented; ready for Phase 8 sign-off

Phase 8 replaces the Phase 7 route placeholders with a complete fixture-driven Hapag journey. The UI now proves the product flow without OpenAI, Supabase, authentication, or persistent storage.

## Implemented journey

```text
Home
  -> ingredient input
Ulam AI
  -> ingredient chips and constraint review
Results
  -> three fixture suggestions
Recipe detail
  -> serving adjustment, cost, missing ingredients, substitutions
Cooking mode
  -> one step at a time, progress, timer, finish
Saved
  -> favorites and cooked history in local session state
Pantry
  -> add, remove, and generate from local ingredient state
Profile
  -> local preference preview and success state
Auth
  -> authentication-required preview without real sign-in
```

## Implemented components

- Ingredient chips with remove actions and uncertainty treatment.
- Recipe cards with match reason, metrics, available ingredients, missing ingredients, and save action.
- Results skeleton loading state.
- Recipe detail ingredient list and serving stepper.
- Unit-aware quantity scaling for numeric fixture quantities.
- Cost breakdown with estimate notes.
- Expandable substitutions with tradeoff copy.
- Cooking mode with step progress, previous/next controls, timer, pause behavior, and completion action.
- Saved favorites and cooked-history views.
- Pantry add, remove, empty, and generate states.
- Profile preference form and local save success state.
- Auth-required email preview state.

## State coverage

The static flow includes code paths for:

- Empty ingredient input.
- Ingredient review and low-confidence normalization.
- Loading recipe results.
- Successful recipe results.
- No-result recovery.
- Generation error and retry recovery.
- Recipe loading and unavailable-recipe recovery.
- Save and unsave state.
- Empty Saved state.
- Empty Pantry state.
- Pantry populated state.
- Profile save success.
- Authentication-required preview.
- Cooking progress, timer, pause, and completion.

## Data boundary

All visible recipe content comes from [`src/data/fixtures.ts`](../src/data/fixtures.ts) through the mock service boundary in [`src/services/recipeService.ts`](../src/services/recipeService.ts). The browser does not call OpenAI or Supabase in this phase.

## Verification

```text
npm run typecheck
npm run test
npm run build
npm run lint
```

## Phase 8 exit gate

- A user can complete the core ingredient-to-cooking journey with fixture data.
- Recipe suggestions, detail, cost, servings, substitutions, and cooking states are visible.
- Saved, cooked, Pantry, Profile, and Auth-required states are demonstrable.
- Loading, empty, error, retry, no-result, and success states have recovery actions.
- The flow works through the responsive app shell without backend services.
- Fixtures render through shared types and service boundaries rather than shape-specific UI hacks.

## Transition to Phase 9

Phase 9 should formalize the recipe schema and fixture engine. It should validate the same objects currently rendered by the mock service and reject malformed or incomplete recipe data before the UI receives it.

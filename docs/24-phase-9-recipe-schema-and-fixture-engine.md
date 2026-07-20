# Phase 9: Recipe Schema and Fixture Engine

**Status:** Implemented; ready for Phase 9 sign-off

Phase 9 establishes a runtime-validated `recipe.v1` contract. Fixtures and future AI responses now pass through the same schema boundary before the UI can render them.

## Implemented contract

- Versioned recipe schema: `recipe.v1`.
- Runtime validation using Zod.
- Ingredient quantity and unit validation.
- Ordered cooking-step validation.
- Cost range validation where minimum cannot exceed maximum.
- Required match reason, cost note, tags, ingredients, steps, and substitutions.
- Explicit source field for `fixture` or `ai`.
- Structured `RecipeValidationError` with field paths and messages.
- Fixture and service adapters that validate before returning UI data.
- Executable tests for valid fixtures, malformed cost data, and invalid step order.

## Data flow

```text
Raw fixture or future AI payload
  -> validateRecipe or validateRecipeList
  -> RecipeValidationError on failure
  -> stable Recipe object
  -> React renderer
```

The UI does not receive unvalidated model-shaped objects.

## Schema boundary files

- `src/schemas/recipeSchema.ts` — Zod schema, validation helpers, and errors.
- `src/schemas/recipeAdapter.ts` — service-facing adapters.
- `src/data/fixtures.ts` — Phase 3 fixtures validated at module load.
- `src/services/recipeService.ts` — mock service revalidates returned payloads.
- `scripts/recipe-schema.test.ts` — runtime validation tests.

## Phase 9 exit gate

- Fixtures render through the validated schema.
- Malformed cost ranges are rejected.
- Invalid or non-consecutive steps are rejected.
- Schema version is explicit.
- Future AI payloads have a clear adapter boundary.
- Validation errors can be logged without exposing raw model output to the user.

## Transition to Phase 10

Phase 10 can now add the server-side OpenAI generation service. It must return payloads through `adaptRecipeListPayload`, preserve `recipe.v1`, and provide a curated fixture fallback when generation or validation fails.

# Phase 7: Frontend Foundation and Workflow

**Status:** Implemented; ready for Phase 7 sign-off

This phase turns the Phase 4 information architecture and Phase 6 visual system into a maintainable React and TypeScript foundation. AI and Supabase remain behind interfaces and are intentionally not connected yet.

## Implemented foundation

- Route-aware app shell without coupling the UI to a backend.
- Desktop sidebar and mobile bottom navigation.
- Route map for Home, Ulam AI, Results, Recipe Detail, Cooking, Saved, Pantry, Profile, Auth, and not-found states.
- Domain types for ingredients, constraints, recipe suggestions, recipe details, costs, substitutions, and cooking steps.
- Phase 3-aligned recipe fixtures.
- Mock recipe service with normalization, fixture generation, and recipe lookup interfaces.
- Environment configuration boundary for future Supabase values.
- Hapag color, typography, spacing, shape, focus, and reduced-motion tokens.
- Initial ingredient prompt component and route-level foundation states.

## Files

- `src/app/router.ts` — browser history route parser and navigation helper.
- `src/app/App.tsx` — application composition and route view selection.
- `src/components/AppShell.tsx` — responsive navigation shell.
- `src/components/IngredientPrompt.tsx` — reusable ingredient entry foundation.
- `src/components/RoutePlaceholder.tsx` — explicit route and phase placeholder state.
- `src/types/domain.ts` — shared domain contracts.
- `src/data/fixtures.ts` — static recipe fixtures for later UI phases.
- `src/services/recipeService.ts` — mock service boundary and input normalization.
- `src/config/env.ts` — public runtime configuration boundary.
- `src/index.css` and `src/App.css` — Hapag visual foundation.

## Phase 7 boundary

This phase does not include:

- OpenAI calls.
- Supabase client initialization.
- Authentication implementation.
- Persistent saved or pantry data.
- Final recipe results, detail, or cooking interactions.
- Photo or voice input.

Those capabilities are added only after the static frontend workflow and schema contract phases.

## Verification

The foundation is verified with:

```text
npm run typecheck
npm run test
npm run build
npm run lint
```

## Phase 7 exit gate

- A new developer can install, run, typecheck, lint, and build the project.
- Routes exist for every screen in the Phase 4 map.
- Domain types and mock service interfaces exist before real services.
- The app shell responds at mobile and desktop widths.
- The Hapag visual tokens are represented in the frontend foundation.
- The core input boundary preserves a path toward the Phase 8 static journey.

## Transition to Phase 8

Phase 8 should render the complete ingredient-to-recipe journey with controlled fixtures, including loading, empty, error, retry, no-result, saved, and cooking states. It should use the mock service and shared types before any backend integration.

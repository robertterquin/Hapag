# Phase 12 — Recipe controls

Phase 12 completes the interactive recipe controls while preserving the existing discovery, AI, Supabase, and routing behavior.

## Implemented behavior

- Serving values are clamped to 1–20 and stepper buttons disable at the limits.
- Recipe detail scaling starts from the recipe’s actual serving count.
- Numeric ingredient quantities are scaled and rounded consistently.
- Estimated totals and individual cost-breakdown lines scale with servings.
- Discovery constraints normalize servings, budget values, dietary preference, spice level, and duplicate allergies before generation.
- Applied spice level is visible on Results alongside the other active constraints.
- Existing substitution expansion and tradeoff copy remain preserved.

The shared rules live in `src/lib/recipeControls.ts`, so discovery and recipe detail use the same validation and scaling behavior.

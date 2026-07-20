# Phase 1: Product Definition and Trust Boundary

**Status:** Implemented; ready for Phase 1 sign-off

This document is the canonical Phase 1 decision record for Hapag. It turns the product principles, user journeys, screen inventory, domain rules, implementation plan, and project-flow PDF into a stable product contract before frontend implementation begins.

## Product promise

Hapag helps Filipino home cooks turn the ingredients they already have into affordable, practical meals they can understand and cook.

**Positioning:** May sahog ka? Luto tayo.

## Primary user

The primary user is a Filipino home cook, student, or busy household member who has some ingredients available and wants a realistic ulam, merienda, baon, or dessert idea without planning from scratch.

The user may:

- Describe ingredients in English, Tagalog, or Taglish.
- Have an incomplete or loosely described ingredient list.
- Need a meal that fits a budget, time limit, serving size, or dietary preference.
- Need substitutions because an ingredient is unavailable.
- Want to remember useful recipes and ingredients for later.

## Core job to be done

When a user has ingredients but does not know what to cook, Hapag should help them choose a practical Filipino meal, understand why it fits, and start cooking with confidence.

## Core value loop

```text
Ingredients in
  -> useful choices
  -> confidence to cook
  -> saved learning for next time
```

## Product workflow

The first release follows one visible sequence:

1. Enter ingredients.
2. Refine ingredients and constraints.
3. Generate three structured recipe suggestions.
4. Compare recipes and understand what is available or missing.
5. Open a recipe, adapt it, and cook through guided steps.
6. Save, favorite, or mark the recipe as cooked.

The browser renders validated recipe objects. It does not render unstructured model text directly.

## Scope lock

### Build in the first release

- Text ingredient input.
- Tagalog, Taglish, and English ingredient understanding.
- Ingredient chips that users can correct or remove.
- Three recipe suggestions with match reason, cost, time, difficulty, and servings.
- Structured recipe detail with available and missing ingredients.
- Serving adjustment, substitutions, dietary filters, and budget context.
- Guided cooking mode with progress and optional timer.
- Anonymous exploration and generation.
- Signed-in saved recipes, favorites, cooked history, and preferences.
- Responsive mobile-first interface.
- Loading, empty, error, retry, offline, rate-limit, and authentication-required states.
- Server-side OpenAI generation with schema validation and a deterministic fallback.

### Build after the core recipe loop

- Pantry CRUD and pantry-based generation.
- Leftover transformations and recent-ingredient shortcuts.
- Photo ingredient recognition.
- Voice input and transcript confirmation.
- Weekly meal planning, recipe sharing, and recipe cards.

Pantry remains part of the product roadmap and navigation model, but it is not a dependency for proving the first ingredient-to-recipe loop. This resolves the difference between the screen inventory and the implementation phase map.

### Explicitly out of scope for the first release

- Grocery marketplace or ordering.
- Real-time market-price accuracy.
- Guaranteed nutrition or medical advice.
- Autonomous shopping or web ordering.
- Public social network or community recipe feed.
- Unreviewed AI content without validation and fallback.

## Trust boundary

Hapag can:

- Suggest practical meal ideas from available ingredients.
- Explain why a recipe matches the user's ingredients and constraints.
- Provide estimated costs using reference ranges.
- Offer substitutions with taste, texture, or method tradeoffs.
- Help the user follow structured cooking steps.

Hapag cannot promise:

- Exact prices, calories, nutrition, or availability.
- Medical, clinical, or allergy safety.
- That an AI-generated recipe has been professionally tested.
- That a substitution will produce the same taste or texture.
- That an ingredient is safe when cross-contact or an unlisted component is possible.

## Required trust language

Use these concepts consistently in the interface:

- **AI suggestions:** “Recipe suggestions are AI-generated. Check the ingredients and cooking steps before you begin.”
- **Cost:** “Estimated price only. Actual cost varies by location, season, and store.”
- **Dietary guidance:** “Dietary labels are guidance, not medical advice.”
- **Allergies:** “If you have an allergy, verify every ingredient and label. Hapag cannot guarantee against cross-contact.”
- **Substitutions:** “Substitutions may change taste, texture, or cooking time.”
- **Uncertainty:** “Tantya lang ang presyo.” and “Paki-check ang ingredients bago magluto.”

## Language and content rules

- Accept English, Tagalog, and Taglish input without requiring a language toggle.
- Use familiar Filipino dishes, ingredients, measurements, and cooking terms where natural.
- Use Philippine pesos and label every price as an estimate.
- Keep copy direct, warm, playful, and scannable.
- Never use color alone to communicate dietary or allergy status.

## Phase 1 exit gate

Phase 1 is complete when:

- The product promise fits in one sentence.
- The primary audience and core cooking problem are explicit.
- MVP, later-phase, and out-of-scope features are separated.
- AI, cost, dietary, allergy, and substitution limitations are visible and honest.
- Complete, incomplete, Taglish, budget, dietary, allergy, and empty inputs are represented in the golden fixtures.
- A first-time user can understand what Hapag does and what to do next within one minute.

The fixture set is defined in [`16-phase-1-golden-fixtures.md`](./16-phase-1-golden-fixtures.md).

## Transition to Phase 2

Phase 2 should convert this contract into measurable MVP acceptance criteria and a now/next/deferred feature list. Do not connect OpenAI or Supabase until the static workflow and its states are understood at the screen level.

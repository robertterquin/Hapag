# Hapag - Filipino AI Cooking Assistant

## Introduction

Hapag is a playful, budget-aware web application that helps Filipino households decide what to cook using the ingredients they already have. Users can enter ingredients in English, Tagalog, or Taglish and receive Filipino meal suggestions with structured ingredients, cooking instructions, estimated costs, serving sizes, difficulty levels, and substitutions.

Hapag is designed around the everyday question:

> **“Ano'ng ulam?”**

The system turns available ingredients into practical meal ideas such as adobo, sinigang, tortang talong, ginisang gulay, sardine omelets, and other familiar Filipino dishes.

## What Hapag Does

- Accepts ingredient input through typing, with voice and photo input planned for later phases
- Suggests Filipino dishes based on available or incomplete ingredients
- Explains why each dish is recommended
- Provides step-by-step cooking instructions using Filipino cooking terms and measurements
- Estimates preparation time, difficulty, serving size, and cost in Philippine pesos
- Recommends ingredient substitutions when an ingredient is unavailable
- Adjusts ingredient quantities based on serving size
- Supports budget modes such as meals under P100 or P200
- Helps users reuse leftover ingredients to reduce food waste
- Allows users to save, favorite, and mark recipes as cooked

## Core Features

### Ingredient-to-Recipe Assistant

- Enter ingredients such as `itlog`, `kamatis`, `sardinas`, and `pechay`
- Accept English, Tagalog, and Taglish prompts
- Handle incomplete ingredient lists
- Normalize common ingredient names and aliases
- Generate multiple recipe suggestions instead of only one result
- Provide a “Surprise me!” option for random recipe ideas

### Structured Recipe Results

Each recipe suggestion can include:

- Filipino and English dish names
- Short recipe description
- Explanation of why the recipe matches the available ingredients
- Available and missing ingredients
- Ingredient quantities and Filipino measurements
- Step-by-step cooking instructions
- Preparation and cooking time
- Difficulty level
- Serving size
- Estimated total cost
- Cost breakdown per ingredient
- Ingredient substitutions
- Dietary and allergy notes
- Region, meal category, and spiciness information
- Rice pairing recommendations when appropriate

### Filipino Cooking Support

- Familiar Filipino dishes and cooking methods
- Filipino measurements such as tasa, kutsara, kutsarita, pakurot, and piraso
- Filipino cooking terms such as gisa, haluin, pakuluin, ihawin, and prituhin
- Meal categories for breakfast, lunch, dinner, merienda, dessert, and baon
- Regional recipe suggestions
- “Ulam for the whole family” recommendations
- Spiciness selector for dishes that use sili

### Budget and Practicality Tools

- Budget filters for meals under P100 or P200
- Palengke-style estimated pricing
- Missing-ingredient suggestions
- Cost breakdown per ingredient
- Budget-friendly substitutions
- Recent ingredient tracking
- Leftover-to-new-meal suggestions

### Dietary and Preference Options

- Vegetarian recipes
- Low-sodium options
- Diabetic-friendly guidance
- Allergy-aware filtering
- User-defined dietary preferences
- Default serving size
- Favorite dishes and saved recipe history

Dietary and allergy information is provided as general guidance and is not a replacement for professional medical advice.

### Saved Recipes and Pantry

- Save recipes and mark them as cooked (signed-in users)
- Reopen previously saved recipes
- Remember your kusina staples (garlic, onion, oil, and more) and add them in one tap; staples sync to your account when signed in
- Turn missing ingredients into a shopping list with peso estimates, then copy or share it
- Reuse leftovers: after cooking, start a new search with the ingredients the recipe didn't use

### Cooking Mode

- Full-screen, one step at a time, with swipe, arrow keys, or large Previous/Next buttons
- Each step lists the ingredients it uses
- A step timer that keeps running when you move between steps, with a floating pill to jump back
- Read-aloud steps and a screen that stays awake
- A "Luto na!" finish screen with feedback, mark as cooked, and "Use the leftovers"

### When AI is unavailable

If AI generation isn't configured or fails, Hapag still shows matching dishes from its 150-dish Filipino catalog, clearly labelled as catalog matches. Dish photos are freely licensed Wikimedia Commons images, credited on each photo and shown only for exact dish matches.

## Main User Flow

1. The user opens Hapag and sees **"Ano'ng ulam?"** with an ingredient box and example combos.
2. The user enters available ingredients in English, Tagalog, or Taglish, or taps **"Surprise me!"**
3. Hapag shows the ingredient chips (Taglish by default, e.g. "Manok (chicken)") and the kusina pantry.
4. The user may adjust servings, budget, diet, or spice in the preferences sheet.
5. The user taps **"Let's Cook!"**
6. Hapag suggests three recipes, plus catalog matches when AI is unavailable.
7. The user compares what they have, what to buy, cost, and time.
8. The user opens a recipe, adjusts servings, and checks the shopping list.
9. The user starts Cooking Mode and follows the steps.
10. The user marks the dish as cooked or uses the leftovers for the next meal.

## Example Input and Output

### User input

```text
May itlog, kamatis, sardinas, at pechay ako.
```

### Possible suggestions

- Sardines with egg and pechay
- Ginisang pechay with egg
- Sardine omelet with tomatoes

Each suggestion should explain how the available ingredients are used and identify anything the user may still need.

## AI System Behavior

Hapag uses the OpenAI API to generate and explain recipe suggestions, but AI output is not rendered directly as unstructured text.

The intended request flow is:

1. Normalize the user's ingredient input.
2. Apply budget, serving, dietary, allergy, region, and meal constraints.
3. Request a structured recipe response from the server-side AI function.
4. Validate the response against the Hapag recipe schema.
5. Render only validated recipe data in the React interface.
6. Show a retry or fallback state if the AI request fails.

The OpenAI API key must remain inside a Supabase Edge Function or another secure server-side boundary. It must never be exposed in the browser.

Recipe generation is rate-limited by the `generate-recipes` Edge Function. Authenticated users are not subject to the anonymous AI quota, while anonymous users receive 3 generations per hour per IP. The function also limits requests to 20 ingredients and 2,000 characters of raw ingredient input. Production rate limiting requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` configured as Supabase Edge Function secrets.

## Production checklist

Before deployment:

- Run `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run lint`, and `npm.cmd run build`.
- Configure `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_REASONING_EFFORT`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` as Supabase Edge Function secrets only.
- Confirm `verify_jwt = true` for `generate-recipes` and verify authenticated requests use a Supabase session token.
- Confirm anonymous requests remain limited to 3 generations per hour per IP.
- Review Supabase RLS policies for profiles, preferences, saved recipes, and cooking history.
- Deploy with `npx supabase functions deploy generate-recipes`, then run one anonymous and one authenticated smoke test.
- Deploy the frontend to Vercel with only `VITE_*` public variables and verify Home, Ulam AI, Results, Saved, Profile, Auth, recipe detail, and cooking routes.
- Test 320px, 390px, 768px, and 1280px layouts, keyboard focus, reduced motion, AI errors, and empty results.

## User Data and Security

- Supabase Auth manages signed-in user access.
- Row Level Security protects user-owned recipes, favorites, pantry items, preferences, and cooking history.
- Anonymous users may explore recipes without permanently saving personal data.
- Uploaded photos should use private storage and require clear consent before retention.
- Users should be able to delete saved recipes and personal data.
- Estimated prices, dietary notes, and AI-generated recipes should be clearly labelled.

## Technology Stack

- **Frontend:** React, TypeScript, and Vite
- **Backend services:** Supabase Edge Functions
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **File storage:** Supabase Storage
- **AI:** OpenAI API
- **Styling:** Custom responsive CSS using the Hapag design tokens

## Visual Design System

Hapag uses the Palayok palette, drawn from a Filipino kitchen:

- Terracotta (brand and primary buttons): `#B5442A`
- Dark clay: `#8A3220`
- Mango: `#F4B33D`
- Banana-leaf green (ingredients you have): `#276B43`
- Gata cream (page background): `#FFF8EE`
- Kape ink (text): `#2B1D16`

The interface uses rounded cards, colorful ingredient chips, friendly food illustrations, large readable headings, and direct Taglish microcopy.

## MVP Scope

### Included in the first release

- Text-based ingredient input
- Filipino recipe suggestions
- Structured recipe details
- Estimated costs
- Serving adjustment
- Ingredient substitutions
- Dietary and budget filters
- Saved and favorite recipes
- Responsive mobile-first interface
- Server-side OpenAI integration
- Supabase authentication and private persistence

### Planned after the core release

- Photo ingredient recognition
- Voice input
- Weekly meal planning
- Weather-based recommendations
- Advanced pantry tracking
- Shareable recipe cards
- PDF and image recipe export
- More regional recipe coverage

## Project Documentation

The Phase 18 UI/UX rework is documented in [`docs/32-phase-18-ui-ux-enhancements.md`](./docs/32-phase-18-ui-ux-enhancements.md), with before and after screenshots in [`docs/screenshots/`](./docs/screenshots/).

Phase 19 removes repeated labels and visual noise across every page while keeping the minimal look; see [`docs/33-phase-19-cleanup-and-design-polish.md`](./docs/33-phase-19-cleanup-and-design-polish.md) and [`docs/screenshots/phase-19-after/`](./docs/screenshots/phase-19-after/).

Detailed product, UX, visual, architecture, scope, and quality-gate documents are available in [`docs/`](./docs/).

The complete product-flow document is available at [`output/pdf/hapag-project-flow-scope.pdf`](./output/pdf/hapag-project-flow-scope.pdf).

Recommended reading order:

1. [`docs/01-product-principles.md`](./docs/01-product-principles.md)
2. [`docs/03-user-journeys.md`](./docs/03-user-journeys.md)
3. [`docs/04-screen-inventory.md`](./docs/04-screen-inventory.md)
4. [`docs/06-color-system.md`](./docs/06-color-system.md)
5. [`docs/13-implementation-plan.md`](./docs/13-implementation-plan.md)

## Product Statement

> **Hapag helps Filipino households turn the ingredients they have into affordable, practical, and delicious meals.**

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

- Save and favorite recipes
- Mark recipes as cooked
- Reopen previously saved recipes
- Track pantry ingredients
- Generate recipes from pantry items
- Remove used or unavailable ingredients
- Suggest ways to use leftover ingredients

### Cooking Mode

- View one cooking step at a time
- Track cooking progress
- Start an optional cooking timer
- Review the current recipe while cooking
- Finish with a clear completion state

## Main User Flow

1. The user opens Hapag and sees **“Ano'ng ulam?”**
2. The user enters available ingredients in English, Tagalog, or Taglish.
3. Hapag displays the interpreted ingredient chips for confirmation.
4. The user may choose servings, budget, meal type, diet, allergy, region, or spiciness filters.
5. The user taps **“Lutuin natin!”** or **“Surprise me!”**
6. Hapag generates three recipe suggestions.
7. The user compares the dish, cost, time, difficulty, and missing ingredients.
8. The user opens one recipe and reviews the instructions and substitutions.
9. The user adjusts servings or starts Cooking Mode.
10. The user saves the recipe or taps **“I cooked this.”**

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

Recipe generation is rate-limited by the `generate-recipes` Edge Function. Authenticated users receive 10 AI generations per hour, while anonymous users receive 3 per hour per IP. The function also limits requests to 20 ingredients and 2,000 characters of raw ingredient input. Production rate limiting requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` configured as Supabase Edge Function secrets.

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

Hapag uses a playful modern Filipino kitchen identity:

- Ube: `#7651A9`
- Dark ube: `#57347F`
- Mango: `#F6B544`
- Calamansi: `#A8C64A`
- Tomato: `#E96A4A`
- Cream: `#FFF8E7`
- Ink: `#30252B`

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

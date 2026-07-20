# Phase 10: AI Generation Service

**Status:** Implemented; ready for Phase 10 sign-off

Phase 10 adds the server-side OpenAI generation boundary while keeping the Phase 9 `recipe.v1` contract and the Phase 8 fixture journey usable when AI is unavailable or not configured.

## Scope delivered

- Added the `supabase/functions/generate-recipes` Edge Function.
- Added a structured Responses API request with a recipe-list JSON schema.
- Added the Hapag prompt for Filipino, English, and Taglish recipe generation.
- Added request validation for non-empty ingredient submissions.
- Added `source: 'ai'` and `schemaVersion: 'recipe.v1'` requirements to generated output.
- Added frontend validation through the existing `adaptRecipeListPayload` boundary.
- Added an in-memory recipe cache so generated recipes can open in detail and cooking mode during the current session.
- Added fixture fallback when Supabase is not configured, the function is unavailable, OpenAI fails, or the response fails schema validation.
- Kept the OpenAI key inside the server-side function environment.
- Added local and production secret/configuration examples.

## Runtime flow

```text
React request
  -> Supabase Edge Function
  -> OpenAI Responses API
  -> structured recipe JSON
  -> recipe.v1 validation in the browser service boundary
  -> recipe cards and detail flow
```

When the remote path fails, the service returns the curated Phase 3 fixtures instead of showing a broken results page.

## Local setup

1. Copy `.env.example` to `.env.local` and add the Supabase project base URL and anon key. If you start with a REST URL ending in `/rest/v1/`, remove that suffix; Hapag derives the Edge Function URL from the project base URL.
2. Copy `supabase/functions/.env.example` to `supabase/functions/.env`.
3. Add a development OpenAI key and a supported model to the function environment.
4. Start Supabase and serve the function:

```powershell
supabase start
supabase functions serve generate-recipes --env-file ./supabase/functions/.env
```

5. Start the Vite app:

```powershell
npm run dev
```

If `.env.local` does not contain both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, Hapag intentionally uses the fixture fallback. This keeps UI development independent from external services. The anon key is a browser-safe Supabase key only when database and storage access are protected by RLS policies.

## Production setup

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project environment. Set `OPENAI_API_KEY`, `OPENAI_MODEL`, and `OPENAI_REASONING_EFFORT` as Supabase Edge Function secrets. The OpenAI key must not use a `VITE_` prefix or appear in the React bundle.

Phase 10 does not add Auth, database persistence, favorites, or Row Level Security tables. Those remain Phase 11.

## Exit gate

- The function has a server-side OpenAI boundary.
- AI output is constrained to the versioned recipe shape.
- Invalid or unavailable AI responses return curated fixtures.
- No OpenAI secret is present in browser configuration.
- Existing typecheck, lint, tests, and production build remain green.

## Transition to Phase 11

Phase 11 can add Supabase Auth, PostgreSQL persistence, favorites, cooked history, preferences, and RLS without changing the AI generation contract.

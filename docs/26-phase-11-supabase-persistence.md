# Phase 11 — Supabase persistence

Phase 11 adds passwordless authentication and private account data without changing the anonymous discovery flow.

## Master query

The complete, repeatable schema is [supabase/migrations/0001_hapag_master.sql](../supabase/migrations/0001_hapag_master.sql). It creates the required tables, indexes, timestamps, auth bootstrap trigger, grants, and Row Level Security policies. If the original query was already run, apply [supabase/migrations/0002_grant_authenticated_table_access.sql](../supabase/migrations/0002_grant_authenticated_table_access.sql) to add the missing grants.

Apply it from the Supabase SQL Editor, or after linking the project:

```powershell
npx supabase db push
```

The migration is intentionally not applied to the hosted project by the app implementation. Applying a migration is a deployment action and should be run after reviewing it in the Supabase dashboard.

## Required tables

- `profiles` — account-level display information.
- `user_preferences` — language, servings, dietary preference, allergies, and spice level.
- `saved_recipes` — a private saved recipe plus a validated `recipe_snapshot`. Snapshots support AI-generated recipes that do not exist in a public catalog.
- `cooked_events` — private cooking history events.
- `pantry_items` — the durable pantry model needed by the full system; the current UI remains local until the planned Pantry/leftover phase wires it to this table.

Favorites are represented by `saved_recipes.is_favorite`; a separate favorites table would duplicate the same user-to-recipe relationship and create unnecessary synchronization risk.

## Application behavior

- Anonymous users can still explore, review ingredients, and generate recipes.
- Saving and cooking history require an authenticated Supabase session.
- Sign-in uses a Supabase magic link.
- Saved and cooked recipe snapshots are validated before entering the client cache.
- Every user-owned table has RLS policies keyed to `auth.uid()`, so a second user cannot read or modify the first user’s rows.

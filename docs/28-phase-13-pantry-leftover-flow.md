# Phase 13 — Pantry and leftover flow

Phase 13 connects the Pantry screen to the existing Phase 11 `pantry_items` table and keeps pantry ingredients useful as a discovery input.

## Implemented behavior

- Signed-in users load pantry items from Supabase and save/remove them with RLS protection.
- Signed-out users can still try the pantry locally; the UI explains that sign-in enables syncing.
- Duplicate ingredients are prevented by normalized display name and the database unique constraint.
- Pantry loading and error states are visible.
- Generate from Pantry creates a discovery session from the current pantry items and uses the normal recipe-generation flow.
- The existing Phase 11 `pantry_items` schema, indexes, and policies are reused; no new migration is required.

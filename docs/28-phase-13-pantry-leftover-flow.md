# Phase 13 — My Ingredients flow

Phase 13 connects the My Ingredients screen to the existing Phase 11 `pantry_items` table and keeps saved ingredient names useful as a discovery input.

## Implemented behavior

- Signed-in users load ingredient names from Supabase and save/remove them with RLS protection.
- Signed-out users can still try My Ingredients locally; sign-in enables syncing across devices.
- Duplicate canonical ingredients are prevented.
- Ingredient names can be edited on blur and removed.
- Loading, empty, error, and recovery states are visible.
- Ulam AI can start with all saved ingredients selected, then users can deselect items before generating.
- Users can add temporary Ulam ingredients without saving them to My Ingredients.

## Data compatibility

- The existing `pantry_items` table, indexes, and policies are reused.
- Quantity and unit columns remain for backward compatibility with the existing schema.
- The application writes and reads My Ingredients entries as `1 piece`; it does not expose or track inventory quantities.

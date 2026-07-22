# My Ingredients and Ulam flow

My Ingredients stores reusable ingredient names such as `sardines`, `eggs`, or `bell pepper`.

## Behavior

- Users add one ingredient name at a time.
- Names are normalized to prevent duplicate canonical ingredients.
- Ingredient rows can be edited on blur or removed.
- Signed-in data uses the existing `pantry_items` table and authenticated-user RLS.
- Signed-out users can use a local preview and are prompted to sign in for syncing.
- No quantity tracking, unit selection, stock limits, or inventory deduction is exposed.

## Ulam AI handoff

- Opening Ulam AI with saved ingredients selects all My Ingredients entries by default.
- Users can deselect ingredients before applying the selection.
- Selected My Ingredients are included in the final ingredient review.
- Manual Ulam additions remain temporary and are not written back to My Ingredients.
- Internally, saved names use `quantity: 1` and `unit: 'piece'` only to satisfy the shared recipe-generation contract.
- The AI is instructed to treat My Ingredients as available food names, not measured inventory.

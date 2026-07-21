# Pantry quantities and Pantry-to-Ulam flow

The Pantry flow now accepts natural-language inventory entries such as `2 cans sardines, 10 eggs, 2 bell peppers`.

## Behavior

- Entries are parsed into ingredient name, canonical name, quantity, unit, confidence, and source.
- Missing quantities default to `1 piece` and are marked for review.
- Pantry rows can be edited, saved, and removed.
- Matching ingredients with the same unit add their quantities together.
- Different units are not automatically converted.
- Pantry data uses the existing `pantry_items` table and authenticated-user RLS.
- Migration `0003_pantry_quantities.sql` backfills legacy null quantity/unit values and adds validation.

## Ulam AI handoff

`Use pantry in Ulam AI` seeds the Ulam review with pantry ingredients and their quantities. The Ulam input then adds temporary ingredients without saving them back to the Pantry. All ingredient quantity and unit context is included in the normal recipe-generation request.

# Hapag Color System

Tokens live in `src/index.css`. Components use the semantic tokens below, never raw Radix steps or hex values.

## Palayok palette
Hapag's colours come from a Filipino kitchen: clay pot (*palayok*) terracotta, banana-leaf green, mango, and coconut-cream (*gata*) backgrounds. There is one warm brand colour, used for both identity and the primary button.

## Brand: Terracotta
- `--color-brand: #B5442A`: eyebrows and kickers, links, selected tabs, active navigation, progress, focus rings, primary buttons
- `--color-brand-strong: #8A3220`: text on soft brand surfaces, secondary-button text, pressed and hover states
- `--color-brand-soft: #F8E6DF`: soft brand panels, hover backgrounds, active nav indicator
- `--color-brand-border: #E9BFB2`: brand-tinted borders
- `--color-brand-a`: translucent brand for focus rings and card focus

## Action
- `--color-action: var(--color-brand)` and `--color-action-strong: var(--color-brand-strong)`: primary buttons. These are separate tokens so the action colour can be changed later without touching every selected state.

Use one primary button per screen. Everything else uses secondary or neutral styles.

## Supporting colors
- `--color-mango: #F4B33D`: highlights and badges. Prices use the amber family (`--amber-11` on `--amber-2`).
- `--color-calamansi: #276B43` (banana-leaf green): "you have" ingredients and success accents (with `--color-success-bg` / `--color-success-border`)
- `--color-tomato: var(--tomato-9)`: warnings. Missing ingredients use `--tomato-11` on `--color-error-bg`.
- `--color-ink: #2B1D16`: primary text. `--color-muted: #523E36`: secondary text.
- `--color-cream: #FFF8EE`: page background. `--color-surface: #FFFFFF`: cards and inputs.

## Ingredient chips (`IngredientChip`)
| Variant | Meaning | Colors |
|---|---|---|
| `have` | Provided by the user | calamansi on success-bg |
| `missing` | Required and not provided | tomato-11 on error-bg |
| `staple` | Common pantry item, probably on hand | muted on sand-2, dashed border |
| `substitute` | Swapped-in ingredient | amber-11 on amber-2 |

## Contrast
Checked by `scripts/phase-18-foundations.test.mjs`:
- White on `--color-action` is at least 4.5:1 (5.5:1 for terracotta).
- `--color-brand` on white is at least 4.5:1.
- `--color-brand-strong` on `--color-brand-soft` is at least 4.5:1.

The same test fails if CSS references a Radix palette that `index.css` does not import.

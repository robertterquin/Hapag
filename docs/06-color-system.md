# Hapag Color System

Tokens live in `src/index.css`. Components use the semantic tokens below, never raw Radix steps or hex values.

## Brand: Ube
- `--color-brand: #7651A9`: identity, eyebrows and kickers, links, selected tabs, active navigation, progress, focus rings
- `--color-brand-strong: #57347F`: text on soft brand surfaces, secondary-button text, pressed states
- `--color-brand-soft: #F3EEF9`: soft brand panels, hover backgrounds, active nav indicator
- `--color-brand-border: #CDBCE6`: brand-tinted borders
- `--color-brand-a`: translucent brand for focus rings and card focus

## Action: Orange
- `--color-action: var(--orange-11)` (#CC4E00): primary buttons only
- `--color-action-strong: #A93F00`: primary hover and the button's bottom shadow

Orange is reserved for the one main action on a screen. If something is not the primary button, it uses brand or neutral tokens.

## Supporting colors
- `--color-mango: var(--amber-9)`: highlights and badges. Prices use the amber family (`--amber-11` on `--amber-2`).
- `--color-calamansi: #1B6B38`: "you have" ingredients and success accents (with `--color-success-bg` / `--color-success-border`)
- `--color-tomato: var(--tomato-9)`: warnings. Missing ingredients use `--tomato-11` on `--color-error-bg`.
- `--color-ink: #20130E`: primary text. `--color-muted: #523E36`: secondary text.
- `--color-cream: var(--sand-1)`: page background. `--color-surface: #FFFFFF`: cards and inputs.

## Ingredient chips (`IngredientChip`)
| Variant | Meaning | Colors |
|---|---|---|
| `have` | Provided by the user | calamansi on success-bg |
| `missing` | Required and not provided | tomato-11 on error-bg |
| `staple` | Common pantry item, probably on hand | muted on sand-2, dashed border |
| `substitute` | Swapped-in ingredient | amber-11 on amber-2 |

## Contrast
Checked by `scripts/phase-18-foundations.test.mjs`:
- White on `--color-action` is at least 4.5:1.
- `--color-brand` on white is at least 4.5:1.
- `--color-brand-strong` on `--color-brand-soft` is at least 4.5:1.

The same test fails if CSS references a Radix palette that `index.css` does not import.

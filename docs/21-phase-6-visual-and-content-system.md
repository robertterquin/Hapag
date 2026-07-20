# Phase 6: Visual and Content System

**Status:** Implemented; ready for Phase 6 sign-off

This document is the visual, content, and component contract for Hapag. It applies the product principles, Phase 5 wireframes, and Ube and Mango visual direction into reusable tokens and rules before the React implementation begins.

## Visual direction

Hapag should feel like a cheerful Filipino kitchen: warm, colorful, rounded, resourceful, and practical.

The interface should communicate:

- **Warmth** through cream surfaces, friendly Taglish copy, and natural food imagery.
- **Confidence** through clear structure, visible match reasons, and direct next actions.
- **Resourcefulness** through ingredient chips, substitutions, budget context, and missing-item labels.
- **Trust** through visible estimates, AI notes, warnings, and honest recovery states.

Avoid a generic AI-chat appearance. Hapag is an ingredient-to-meal tool with structured recipe cards and cooking guidance.

## Design tokens

### Color tokens

```css
:root {
  --color-cream: #fff8e7;
  --color-surface: #ffffff;
  --color-ube: #7651a9;
  --color-ube-dark: #57347f;
  --color-mango: #f6b544;
  --color-calamansi: #a8c64a;
  --color-tomato: #e96a4a;
  --color-ink: #30252b;
  --color-muted: #766b70;
  --color-lavender: #eee5f7;

  --color-border: #e7ded1;
  --color-border-strong: #cfc0b2;
  --color-focus: #2d6cdf;
  --color-overlay: rgb(48 37 43 / 48%);

  --color-success-bg: #edf5d9;
  --color-warning-bg: #fff0cf;
  --color-error-bg: #fbe0d8;
  --color-info-bg: #eee5f7;
}
```

### Color usage rules

| Use | Token | Rule |
|---|---|---|
| Page background | Cream | Use as the default product canvas. |
| Cards and inputs | Surface | Use for readable content areas. |
| Primary action | Ube | Use for main buttons, active navigation, and brand emphasis. |
| Pressed or strong heading | Ube dark | Use for pressed states and selected emphasis. |
| Attention or featured badge | Mango | Use sparingly for budget, highlights, or discovery. |
| Ingredient-related accent | Calamansi | Use for chips, available status, and success-adjacent context. |
| Warning or destructive action | Tomato | Use for warnings and destructive actions, not decoration. |
| Primary text | Ink | Use for headings and body text. |
| Secondary text | Muted | Use for supporting information, never essential instructions. |
| Soft panel | Lavender | Use for AI notes, filters, and secondary grouping. |

Do not place ink text directly on saturated Ube without checking contrast. Use white text on Ube buttons only when the contrast check passes. Use ink rather than white on Mango and Tomato surfaces when needed for readability.

Hapag uses a light, cream-first theme in the first release. Do not inherit the Vite starter's automatic dark-mode palette.

### Typography tokens

```css
:root {
  --font-display: "Plus Jakarta Sans", "Nunito", system-ui, sans-serif;
  --font-body: Inter, "Nunito Sans", system-ui, sans-serif;
  --font-accent: "Comic Sans MS", "Bradley Hand", cursive;

  --text-display: 40px;
  --text-display-line: 48px;
  --text-h1: 32px;
  --text-h1-line: 40px;
  --text-h2: 24px;
  --text-h2-line: 32px;
  --text-h3: 18px;
  --text-h3-line: 26px;
  --text-body: 16px;
  --text-body-line: 24px;
  --text-small: 14px;
  --text-small-line: 20px;
  --text-label: 12px;
  --text-label-line: 16px;
}
```

Typography rules:

- Display and headings use a rounded, confident display face.
- Body text uses a clean, readable sans-serif.
- The handwritten accent is optional and limited to small labels or illustrations.
- Never use the handwritten style for instructions, warnings, prices, or paragraphs.
- Use sentence case for most UI labels.
- Use bold selectively to establish hierarchy, not to make every card loud.

### Spacing tokens

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
}
```

Use the 4px base grid consistently. Prefer 16px or 24px for component padding and 32px or 48px for section separation.

### Shape tokens

```css
:root {
  --radius-control: 14px;
  --radius-control-large: 18px;
  --radius-card: 20px;
  --radius-card-large: 24px;
  --radius-pill: 999px;

  --shadow-card: 0 8px 24px rgb(48 37 43 / 8%);
  --shadow-floating: 0 16px 40px rgb(48 37 43 / 14%);
  --shadow-focus: 0 0 0 3px rgb(45 108 223 / 28%);
}
```

Use rounded controls and cards to create warmth, but avoid nesting cards inside cards without a clear information hierarchy.

## Component system

### Buttons

Variants:

- **Primary:** Ube background, white label, strong action.
- **Secondary:** Surface background, Ube border or text.
- **Soft:** Lavender or Mango-tinted background for contextual actions.
- **Destructive:** Tomato background or Tomato text with confirmation.
- **Text:** Low-emphasis navigation or cancellation.

States:

- Default
- Hover
- Focus-visible
- Pressed
- Disabled
- Loading
- Error or retry

Rules:

- Minimum 44px height.
- Verb-first labels such as `Lutuin natin!`, `Simulan ang pagluluto`, or `Subukan ulit`.
- Loading buttons retain the action context and expose a status label.
- Do not use icon-only buttons for primary actions.

### Ingredient input

Parts:

- Label and helper text.
- Text field.
- Optional voice or photo controls when enabled by their phase.
- Normalized ingredient chips.
- Add and clear actions.
- Validation and uncertainty message.

Rules:

- Input remains readable when chips wrap to multiple lines.
- Chips use Calamansi-related styling for recognized available ingredients.
- Unknown items use a warning treatment and an explicit review action.
- Every remove control has an accessible name such as `Remove itlog`.

### Filter and preference controls

Use pill chips for quick, lightweight choices such as budget, meal mode, spice level, and dietary preferences. Use a drawer or grouped panel for longer settings.

Rules:

- Selected state uses shape, text, and icon or indicator in addition to color.
- Applied constraints remain visible on Results.
- Allergy controls are visually stronger than ordinary preferences.
- Destructive or safety-relevant changes require clear confirmation where appropriate.

### Recipe card

Every recipe card exposes:

- Dish title.
- Match reason.
- Time.
- Difficulty.
- Servings.
- Estimated cost.
- Available ingredients.
- Missing ingredients.
- Save or favorite action.

Card variants:

- Standard suggestion.
- Featured or best-match suggestion.
- Saved recipe.
- Cooked recipe.
- Loading skeleton.
- No-result or fallback card.

Do not hide the match reason or estimated cost below an interaction that users must discover.

### Recipe detail

Use a stable order:

1. Title and summary.
2. Time, difficulty, servings, and estimated cost.
3. Match reason.
4. Available and missing ingredients.
5. Serving adjustment.
6. Cost breakdown.
7. Substitutions.
8. Steps.
9. Trust and safety notes.
10. Start cooking and save actions.

### Cost breakdown

Visual rules:

- Use a clearly labelled `Estimated cost` heading.
- Show a range when confidence is low.
- Separate available ingredients from missing purchase items.
- Use `Tantya lang ang presyo.` near the total.
- Do not imply real-time market accuracy.

### Cooking step card

Parts:

- Step number and total progress.
- Direct action sentence.
- Quantity and unit context.
- Heat or timing context.
- Optional timer.
- Previous, Next, Pause, and Finish controls.

The current step is visually dominant. Completed steps may collapse but remain reviewable.

### Save, toast, modal, and empty states

- Toasts confirm short-lived success, such as `Naisave na ang recipe!`.
- Modals explain authentication or destructive actions before asking for confirmation.
- Empty states include a friendly illustration, explanation, and one clear next action.
- Error states explain what the user can do, not only what went wrong.

## State styling

| State | Visual treatment | Required copy behavior |
|---|---|---|
| Loading | Skeleton blocks and calm progress indicator | State what Hapag is doing. |
| Empty | Illustration, soft panel, clear action | Explain how to begin. |
| Success | Calamansi accent, confirmation text | Confirm the stored or completed action. |
| Warning | Mango background or Tomato accent | Explain uncertainty or review need. |
| Error | Tomato-tinted panel, retry action | Preserve input and offer recovery. |
| Offline | Muted banner, disabled network action | Explain what remains available. |
| Auth required | Lavender modal or panel | Explain why sign-in is needed. |
| AI uncertainty | Lavender or Mango note | Name the estimate or confidence limitation. |

Avoid flashing motion, dense alert stacks, and full-screen error replacements for recoverable failures.

## Motion system

```css
:root {
  --motion-fast: 150ms;
  --motion-standard: 220ms;
  --motion-entrance: 300ms;
  --motion-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

Use motion for:

- Chip add or remove.
- Filter selection.
- Card reveal.
- Save confirmation.
- Step transition.
- Drawer or modal entry.

Rules:

- Keep normal transitions between 150ms and 220ms.
- Use approximately 300ms for a gentle results entrance.
- Do not use bouncing motion for warnings, timers, or safety content.
- Respect `prefers-reduced-motion` by removing transforms and reducing transitions.

## Imagery and illustration

Food photography:

- Natural, home-cooked, and appetizing.
- Warm light and recognizable ingredients.
- Avoid over-stylized restaurant photography that makes the food feel unattainable.
- Use descriptive alt text when the image conveys recipe context.

Illustration language:

- Friendly pot, plate, rice, sili, egg, spoon, and calamansi motifs.
- Use sparingly in empty states, onboarding-like moments, and brand accents.
- Keep illustrations simple enough to remain clear at mobile sizes.
- Mark purely decorative illustrations as hidden from assistive technology.

Patterns such as banig, market labels, or checkered tablecloths may appear as subtle texture only. They must not compete with ingredient names, costs, warnings, or cooking steps.

## Content system

### Voice

Hapag sounds:

- Warm, not childish.
- Playful, not distracting.
- Filipino by default, without forcing Tagalog on users who type English.
- Direct, not overly conversational.
- Encouraging, not judgmental.

### Copy rules

- Use Taglish in high-level prompts and short UI labels where it feels natural.
- Mirror the user's input language in normalized ingredient explanations when possible.
- Use clear Filipino cooking terms with an English clarification when ambiguity is possible.
- Put the action first: `Ayusin ang ingredients`, `Simulan ang pagluluto`, `Subukan ulit`.
- Keep instructions scannable and avoid long AI-generated paragraphs.
- Explain uncertainty at the point where the user makes a decision.
- Never use `guaranteed`, `safe for allergies`, `exact price`, or `doctor-approved` language.

### Required labels

- `Available` or `Meron ka`
- `Missing` or `Kulang pa`
- `Estimated cost`
- `AI-generated suggestion`
- `Tantya lang ang presyo`
- `Dietary guidance, not medical advice`
- `Check labels and cross-contact for allergies`

### Price formatting

- Display Philippine peso values consistently.
- Prefer ranges when confidence is low, such as `₱50–₱85`.
- Use `estimated` in the label, not only in a tooltip.
- Distinguish recipe-use estimate from full package purchase cost when possible.

## Representative screen direction

### Home

- Cream canvas with a centered ingredient prompt.
- Ube primary action.
- Calamansi ingredient chips.
- Mango quick filters.
- Compact trust note below the primary actions.

### Results

- Generous white recipe cards on the cream background.
- Ube or Mango badge for best match or budget context.
- Calamansi treatment for available ingredients.
- Tomato used only for warnings or missing critical context.

### Recipe detail

- Clear title and summary at the top.
- Summary metadata in compact pills.
- Ingredients and cost grouped before long steps.
- Substitutions visually separated from required ingredients.
- Start-cooking action remains visible near the recipe summary.

### Cooking mode

- Calm, low-distraction surface.
- One dominant step card.
- Strong progress indicator.
- Large Next and Previous controls.
- Timer treated as a supporting tool, not the main visual focus.

## Accessibility guardrails

- Maintain keyboard-visible focus with the Focus token.
- Check text and control contrast for each token pairing used in implementation.
- Do not use Mango, Calamansi, or Tomato as the sole indicator of status.
- Preserve 44px minimum touch targets.
- Keep body text at the defined 16px/24px baseline unless a deliberate responsive exception is documented.
- Use semantic headings in the order defined by the wireframes.
- Make warnings, cost caveats, and allergy notes available to screen readers in the same reading order as the related control.
- Provide reduced-motion behavior for transitions, cards, drawers, and cooking-step changes.

## Phase 6 exit gate

Phase 6 is complete when:

- Color, typography, spacing, radius, shadow, and motion tokens are defined.
- Core components have variants and state rules.
- Representative Home, Results, Recipe Detail, and Cooking Mode screens have visual direction.
- Taglish content, trust notes, cost labels, warning copy, and recovery copy are consistent.
- Imagery and illustration rules are explicit.
- Responsive and accessibility guardrails are attached to the visual system.
- The Vite starter's unrelated visual defaults are no longer considered part of Hapag's design direction.

## Transition to Phase 7

Phase 7 should turn these tokens and component rules into the React and TypeScript foundation, routes, domain types, mock services, scripts, and app shell. The first implementation should use fixtures and static state before connecting OpenAI or Supabase.

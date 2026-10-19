# Phase 19: Cleanup and Design Polish

Phase 18 added a lot of useful pieces. This phase removes repetition and visual noise across every page, and tightens the visual system, while keeping Hapag minimal and warm (Palayok palette). No new features; every change either removes something, merges duplicates, or makes existing elements consistent.

Guiding rules for every page:

1. **Say it once.** If two elements carry the same information (a label and a heading, a count and a progress bar, an error and a note), keep the clearer one.
2. **One heading, no kicker.** Small uppercase "kicker" labels sit above almost every heading and repeat it ("Ingredients needed" above "Ingredients"). Headings stand on their own.
3. **Sentence case** for all buttons and labels ("Edit ingredients", not "Edit Ingredients").
4. **Decoration earns its place.** Doodles, dotted textures, heavy borders, and stacked shadows are removed unless they help the reader.

Phases run in order; each one ends with all checks passing.

| Phase | Outcome | Size |
|---|---|---|
| 19.0 Audit | Findings for every page (below) | S |
| 19.1 Copy and redundancy | Duplicate labels, counts, and messages removed; consistent casing | M |
| 19.2 Page simplification | Lighter results, detail, cooking, and auth layouts | M |
| 19.3 Visual system | One card style, quieter background, consistent type and chips | M |
| 19.4 QA | Screenshots at 320–1280px, accessibility re-check, tests | S |

---

## 19.0 Audit findings

Audited at 375px with the fallback (no AI) path, signed out.

### Everywhere
- **Kickers above headings** (e.g. "Your list" above "Selected ingredients", "Palengke run" above "Shopping list", "Budget check" above "Estimated cost"): 12 across the app, all repeating their heading.
- **Page eyebrows** repeat the navigation: "Ulam AI" above the Ulam page title, "Recipe suggestions" above "Dishes you can cook", "Profile and preferences", "Account".
- **Title Case buttons** mixed with sentence case: "Edit Ingredients", "Try Again", "Sign In", "Find Recipes", "Back to Home", "Let's Cook!".
- **Background decoration**: flow lines, orbs, doodles (bowl, leaf, garlic, chili, spark), and a dotted texture sit behind every page, competing with content.
- **Cards** mix 1px and 1.5px borders with large stacked shadows.

### Home
- Preview cards show the ingredient count twice: "You have all 3" and "You have (3)".

### Ulam AI
- "Ulam AI" eyebrow duplicates the active nav item; the intro repeats Home's subtitle.
- "Separate several with commas" helper repeats what the placeholder already shows.
- "Quick pick" kicker and "Tap to add or remove" hint on the pantry; the chips already show + and ✓.
- Ingredient count appears twice: the badge on "Selected ingredients" and the Cook bar ("3 sangkap ready").

### Results
- Two messages say the same thing when AI fails: the red banner ("AI recipes are unavailable right now…") and the catalog note ("AI recipes are unavailable right now, so here are matches…").
- Header stack: eyebrow, title, "4 ideas for: …", a full-width "Edit Ingredients" button, then servings/spice pills: five rows before the first card.
- Cards show the count twice ("You have all 2" and "You have (2)"), two badges ("Catalog match" and the cooking method), and a large "No photo yet" tile when there's no photo.
- "Try Again" at the bottom repeats the retry already implied by the banner; long trust note.

### Recipe detail
- Every section has a kicker ("Ingredients needed", "Palengke run", "Preparation", "Flexible cooking", "Why this dish", "Budget check").
- Each ingredient shows its status three ways: icon, colour, and a "You have" label.
- Cost breakdown labels a staple line "missing", contradicting the "Probably in your kusina" status above it.
- Shopping list's empty message re-explains staples.

### Cooking Mode
- Step number shown twice: "1 / 3" in the bar and a "Step 1" kicker on the card.
- Long footer note under the controls.

### Saved, Profile, Auth, Not found
- Auth shows "Sign in" three times at once: the header pill, the tab, and the submit button.
- Title Case on "Sign In", "Find Recipes", "Back to Home".

---

## 19.1 Copy and redundancy

- Remove all section kickers and the page eyebrows except Home's brand line.
- Sentence case for every button and label.
- Ulam: drop the intro line, the comma helper, the pantry hint, and the count badge (the Cook bar keeps the count).
- Results: one fallback message (the catalog note absorbs the error); header becomes title + one summary line with an "Edit" text button; servings/spice pills move into that line; remove the bottom "Try again" when there's nothing new to try; shorter trust note.
- Cards: "You have" label without a number (the progress bar carries it).
- Detail: visible status text only where it adds information ("To buy", "Staple"); "You have" becomes screen-reader text. Cost lines say "staple" or "to buy", never "missing".
- Cooking: drop the "Step N" kicker; shorter footer.
- Auth: hide the header "Sign in" pill on the sign-in page.

**Exit:** no heading has a kicker; no count, price, or error appears twice on one screen; all buttons in sentence case.

**Status: done.** 20 kickers and eyebrows removed (plus the "Cooking mode" label in the cooking bar). Ulam heading is now "Your ingredients" and the pantry is "Pantry"; Profile uses segmented controls instead of selects; pairing chips show the local name only.

## 19.2 Page simplification

- Results cards without a photo render compactly (no placeholder tile); one badge per card.
- Results header fits in two rows at 375px.
- Detail: substitutions and "Why it works" merge into one quieter section.
- Empty and error states share one component style with sentence-case actions.

**Exit:** the first result card is visible without scrolling at 375×812.

**Status: done.** Results header is the title plus one summary line (ingredients · servings · spice · Edit); the fallback note carries "Try again" inline. Cards show one badge and no placeholder tile. The first card is visible at 375×812.

## 19.3 Visual system

- **Background:** keep the soft warm gradient; remove doodles, orbs, flow lines, and the dotted texture (Home keeps one subtle accent).
- **Cards:** one surface style: 1px border, 20px radius, a single soft shadow.
- **Type:** fewer weight-800 labels; headings in Fraunces, everything else in Plus Jakarta Sans at consistent sizes.
- **Chips:** the selected-ingredient chips use the same shape and colours as the "have" chips on cards.
- **Spacing:** sections separated by one consistent gap.

**Exit:** every card and chip on every page uses the shared styles; no decorative SVG behind content pages.

**Status: done.** Shared surface tokens (`--surface-border`, 20px radius, one shadow) on every card; dotted texture off; doodles only on Home; selected chips match the "have" chips; card evidence no longer ends with a stray divider.

## 19.4 QA

- Screenshots of every page at 375px and 1280px in `docs/screenshots/phase-19-after/`.
- Re-run the 44px touch-target audit and the no-sideways-scroll check at 320, 390, 768, 1280px.
- Update tests that pinned removed copy; add a test that no heading has a kicker.

**Exit:** all checks pass; README and this doc updated.

**Status: done (2026-10-19).**

- Touch targets: fixed four misses found by the audit: two-line pantry chips (40px), the Results "Edit" and "Try again" text buttons (36px), the Auth mode tabs (40px), and the desktop nav and brand (36–38px). All are now at least 44px.
- No sideways scroll on any route at 320, 390, 768, or 1280px (the pantry tab row scrolls inside its own container by design).
- Screenshots: `docs/screenshots/phase-19-after/` (mobile at 390px, desktop at 1280px), captured with headless Chrome and reduced motion.
- Tests: `scripts/phase-19-cleanup.test.mjs` guards against kickers, Title Case labels, duplicate fallback messages, "missing" staple costs, placeholder tiles, and sub-44px controls. 132 tests pass; typecheck, lint, and build are clean.
- Not covered: signed-in screens (Saved list, Profile form, Account) and real AI recipe cards, which need a signed-in account and the Upstash fix.

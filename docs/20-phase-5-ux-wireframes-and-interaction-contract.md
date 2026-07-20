# Phase 5: UX Wireframes and Interaction Contract

**Status:** Implemented; ready for Phase 5 sign-off

This document translates the Phase 4 information architecture into screen-level wireframes, interaction behavior, content rules, and responsive requirements. It is intentionally visual and structural rather than a final color or component specification.

## UX goal

At every point in the primary journey, the user should understand:

1. Where they are.
2. What Hapag understood.
3. What action is available next.
4. What is estimated, missing, uncertain, or saved.

## Primary journey wireframe

```text
Home -> Ulam AI -> Results -> Recipe detail -> Cooking mode -> Remember
```

The core action should remain visible without making the user pass through marketing content.

## Wireframe 1: Home and ingredient prompt

### Mobile: 320px and up

```text
┌──────────────────────────────┐
│ Hapag                 [user] │
├──────────────────────────────┤
│                              │
│        Ano'ng ulam?          │
│  May sahog ka? Luto tayo.    │
│                              │
│  Anong ingredients meron ka? │
│  ┌────────────────────────┐  │
│  │ itlog, kamatis...      │  │
│  └────────────────────────┘  │
│  [photo] [voice]             │
│                              │
│  Quick ideas                 │
│  [Under P100] [Pang-baon]   │
│  [Vegetarian] [Mabilis]     │
│                              │
│  [ Lutuin natin! ]           │
│  [ Surprise me ]             │
│                              │
│  Tantya lang ang presyo.     │
│  AI-generated suggestions.   │
├──────────────────────────────┤
│ Home  Ulam AI  Saved Pantry  │
└──────────────────────────────┘
```

### Desktop

```text
┌──────────────┬───────────────────────────────────────────────┐
│ Hapag        │ Header: Saved  Pantry  Profile                 │
│              ├───────────────────────────────────────────────┤
│ Home         │                 Ano'ng ulam?                    │
│ Ulam AI      │           May sahog ka? Luto tayo.              │
│ Saved        │                                                   │
│ Pantry       │  ┌─────────────────────────────────────────┐    │
│              │  │ Anong ingredients meron ka?              │    │
│              │  └─────────────────────────────────────────┘    │
│              │  [quick filters]                                 │
│              │  [ Lutuin natin! ]  [ Surprise me ]              │
│              │  Trust note                                      │
└──────────────┴───────────────────────────────────────────────┘
```

### Interaction contract

- The text field accepts comma-separated phrases, Enter-separated items, and natural sentences.
- Submit is disabled for empty or whitespace-only input.
- Submit creates a discovery session and routes to `/ulam` for ingredient review when normalization is needed.
- A simple, high-confidence list may show chips immediately and continue to `/results` after confirmation.
- Quick filters add constraints without deleting ingredient input.
- `Surprise me` uses the current ingredients and constraints but varies ranking or dish direction; it does not bypass safety checks.
- Photo and voice controls are visible only when their phase is enabled. They must not be simulated as working before implementation.

## Wireframe 2: Ingredient review and constraints

```text
┌────────────────────────────────────────┐
│ ← Back          Ulam AI                 │
├────────────────────────────────────────┤
│ Ito ang nakita ko:                      │
│ [ itlog × ] [ kamatis × ] [ pechay × ] │
│                                        │
│ [ + Magdagdag ng ingredient ]           │
│                                        │
│ Optional na preferences                │
│ Serving size       [ − ] 4 [ + ]       │
│ Budget             [ Any ▾ ]           │
│ Dietary            [ None ▾ ]          │
│ Allergy            [ Add ]             │
│ Spice level        [ Mild ▾ ]          │
│                                        │
│ Missing or unclear items               │
│ [ Review needed ]                      │
│                                        │
│ [ Lutuin natin! ]                      │
└────────────────────────────────────────┘
```

### Interaction contract

- Every chip has a visible remove button with an accessible label.
- Adding an ingredient returns focus to the input and preserves existing chips.
- Unknown or low-confidence ingredients use a review row rather than silently becoming a canonical ingredient.
- Dietary and allergy constraints are represented as explicit selections, not decorative badges.
- The user can continue with incomplete ingredients when the missing context is not safety-critical.
- A safety-critical conflict blocks generation until the user resolves or removes the conflict.
- Back preserves all chips and constraints.

## Wireframe 3: Recipe results

```text
┌────────────────────────────────────────┐
│ ← Edit ingredients     3 ideas          │
├────────────────────────────────────────┤
│ May sahog ka: itlog · kamatis · pechay │
│ [filters] [sort: best match ▾]          │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │ Sardines with egg and pechay  ♡    │ │
│ │ Sakto sa meron mo                  │ │
│ │ Uses: itlog · sardinas · pechay    │ │
│ │ Missing: bawang                    │ │
│ │ 20 min · Easy · P50–P85 · 3 serv. │ │
│ │ [ View recipe ]                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Ginisang pechay with egg           │ │
│ │ ...                                │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Sardine omelet with tomato         │ │
│ │ ...                                │ │
│ └────────────────────────────────────┘ │
│                                        │
│ [ Try again ]  [ Edit ingredients ]    │
└────────────────────────────────────────┘
```

### Interaction contract

- Results show three suggestions first; detailed steps remain behind Recipe detail.
- Every card exposes title, match reason, time, difficulty, servings, cost estimate, available ingredients, and missing ingredients.
- The user can open the card by clicking the card or its explicit action, but the favorite control must not open the recipe accidentally.
- Retry reuses the current normalized request and constraints.
- Edit returns to the review screen with state preserved.
- Sorting changes presentation only; it must not silently change the generation request.
- No-result state explains whether the issue is missing ingredients, constraints, or service failure.

## Wireframe 4: Recipe detail

```text
┌────────────────────────────────────────┐
│ ← Results                 [ Save ]     │
├────────────────────────────────────────┤
│ [food image or illustration]           │
│ Sardines with egg and pechay           │
│ Sakto sa meron mo                      │
│ 20 min · Easy · P50–P85 · 3 servings   │
│                                        │
│ Why this fits                          │
│ Uses your sardines, egg, and pechay.   │
│                                        │
│ Servings       [ − ] 3 [ + ]           │
│                                        │
│ Ingredients                            │
│ ✓ sardines     1 can                   │
│ ✓ egg          2 pieces                │
│ ✓ pechay       1 bundle                │
│ + garlic       Missing                 │
│                                        │
│ Estimated cost                         │
│ Ingredients used       P50–P85         │
│ Actual purchase may vary.              │
│                                        │
│ Substitutions                          │
│ Pechay → kangkong                      │
│ Changes texture and cooking time.      │
│                                        │
│ [ Start cooking ]                      │
│ AI-generated suggestion. Check first.  │
└────────────────────────────────────────┘
```

### Interaction contract

- The serving stepper updates quantities and cost estimates while preserving units and step order.
- Quantity changes show the current serving count near the control.
- Missing ingredients remain visible after scaling.
- Cost breakdown distinguishes recipe-use estimate from purchase cost when the distinction is available.
- Substitution rows show the original ingredient, alternative, and tradeoff before applying.
- Save is available from the header and completion state.
- Start cooking creates a local cooking session and routes to `/recipes/:recipeId/cook`.
- The trust note remains visible near cost or recipe source information.

## Wireframe 5: Cooking mode

```text
┌────────────────────────────────────────┐
│ Cooking mode                [ Pause ]  │
│ Sardines with egg and pechay           │
├────────────────────────────────────────┤
│ Step 2 of 6                            │
│ ████████░░░░░░░░ 33%                   │
│                                        │
│ Igisa ang bawang at sibuyas hanggang   │
│ mabango.                               │
│                                        │
│ 2 kutsara oil                          │
│ Medium heat                            │
│ About 2 minutes                        │
│                                        │
│ [ Start 02:00 timer ]                  │
│                                        │
│ [ Previous ]              [ Next ]     │
├────────────────────────────────────────┤
│ [ Finish cooking ]                     │
└────────────────────────────────────────┘
```

### Interaction contract

- Only the current step is visually dominant.
- Previous and Next controls have disabled states at the boundaries.
- Timer state is independent from step navigation and is never silently reset.
- Pause preserves step and timer state.
- Leaving the screen with an active session offers Resume or Exit options.
- Finish opens a completion state with Save, Mark as cooked, and Back to recipe actions.
- Cooking instructions must use direct actions, amount context, and observable doneness cues where appropriate.

## Wireframe 6: Save and authentication prompt

```text
┌──────────────────────────────────────┐
│ Save this recipe?                    │
│ Sign in to keep it for next time.   │
│                                      │
│ [ Sign in ]   [ Not now ]            │
└──────────────────────────────────────┘
```

### Interaction contract

- The attempted save action and return route are preserved through authentication.
- `Not now` returns to the recipe without losing the current state.
- Successful save uses text confirmation such as `Naisave na ang recipe!`.
- Failed save preserves the recipe and offers retry.

## Wireframe 7: Saved and empty states

```text
┌────────────────────────────────────────┐
│ Saved                                  │
│ [ Favorites ] [ I cooked this ]        │
├────────────────────────────────────────┤
│ No saved recipes yet                   │
│ Mag-save ng recipe para mabalikan mo.  │
│                                        │
│ [ Find something to cook ]             │
└────────────────────────────────────────┘
```

An authenticated populated state uses compact recipe cards with title, time, cost estimate, saved date or cooked date, and explicit unsave/delete actions.

## Interaction state matrix

| Component | Default | Focus | Loading | Error | Success |
|---|---|---|---|---|---|
| Ingredient input | Empty prompt | Visible focus ring | Disabled with status | Inline correction message | Chips rendered |
| Ingredient chip | Removable | Focused remove control | N/A | Invalid chip warning | Normalized label |
| Generate button | Disabled or enabled by validity | Focus ring | Spinner and status | Retry label | Routes to Results |
| Filter control | Current selection | Keyboard-operable | Preserves current value | Explains conflict | Updated constraint |
| Recipe card | Readable summary | Card action focus | Skeleton | Fallback or retry | Opens detail |
| Save button | Save | Focus ring | Saving label | Retry save | Saved label and toast |
| Serving stepper | Current count | Keyboard-operable | Recalculation state | Validation message | Updated quantities |
| Substitution row | Collapsed tradeoff | Expandable | Applying state | Revert or retry | Updated recipe context |
| Timer | Idle | Button focus | Active countdown | Timer recovery | Completed state |
| Cooking step | Current step | Navigation focus | Step transition | Resume or restart | Progress updated |

## Copy deck

### Core copy

| Context | Copy |
|---|---|
| Home headline | `Ano'ng ulam?` |
| Home subhead | `May sahog ka? Luto tayo.` |
| Ingredient label | `Anong ingredients meron ka?` |
| Ingredient placeholder | `Hal. itlog, kamatis, sardinas...` |
| Primary action | `Lutuin natin!` |
| Secondary action | `Surprise me` |
| Review heading | `Ito ang nakita ko:` |
| Results heading | `Mga puwedeng lutuin` |
| Match label | `Sakto sa meron mo` |
| Missing label | `Kulang pa` |
| Loading | `Naghahanap ng ulam...` |
| Retry | `Subukan ulit` |
| Edit | `Ayusin ang ingredients` |
| Start cooking | `Simulan ang pagluluto` |
| Finish | `Nakaluto ka na!` |
| Save success | `Naisave na ang recipe!` |
| Delete success | `Na-delete na.` |
| Cost note | `Tantya lang ang presyo.` |
| AI note | `AI-generated suggestion. Check the ingredients before cooking.` |
| Allergy note | `May allergy? I-check ang labels at cross-contact bago magluto.` |

### Recovery copy

| State | Copy |
|---|---|
| Empty input | `Maglagay muna ng kahit isang ingredient.` |
| Unclear ingredient | `Hindi ko sure kung anong ingredient ito. Paki-check o palitan.` |
| No results | `Wala akong makitang magandang match. Bawasan ang filters o magdagdag ng ingredient.` |
| Generation error | `Hindi muna ako nakahanap ng ulam. Nandito pa rin ang ingredients mo.` |
| Offline | `Mukhang offline ka. Maaari mong basahin ang nabuksan na recipe, pero hindi muna makakapaghanap.` |
| Rate limited | `Sandali muna bago sumubok ulit. Naka-save ang request mo.` |
| Auth required | `Mag-sign in para ma-save at mabalikan ang recipe na ito.` |
| Delete confirmation | `Sigurado ka bang burahin ito? Hindi na ito lalabas sa Saved.` |
| Sign-out confirmation | `Mag-sign out? Mananatili ang saved data sa account mo.` |

## Responsive contract

### 320px mobile

- Single-column layout.
- No horizontal scrolling.
- Ingredient chips wrap naturally and remain removable.
- Primary action remains reachable above bottom navigation.
- Recipe cards stack vertically.
- Recipe detail keeps cost, servings, and start-cooking action visible without forcing a wide table.
- Cooking mode uses one step per viewport with large navigation controls.

### 768px tablet

- Two-column results may be used when cards remain readable.
- Ingredient review can place constraints in a secondary column.
- Recipe detail may use a summary column and an ingredient/steps column.
- Bottom navigation may remain if it improves reachability.

### 1024px and larger desktop

- Use the left-sidebar shell.
- Results may use two or three cards per row.
- Recipe detail may use a sticky summary panel and a readable steps column.
- Cooking mode remains centered at a comfortable reading width.
- Avoid full-width paragraphs or steps that require long eye travel.

## Accessibility contract

- Use semantic landmarks, headings, labels, buttons, and lists.
- Every icon-only control has an accessible name.
- All chips expose a labelled remove action.
- Keyboard users can complete ingredient entry, generation, recipe opening, saving, and cooking navigation.
- Focus is moved intentionally after route changes and modal opening.
- Status and warnings use text and iconography, not color alone.
- Minimum interactive target is 44px.
- Images have useful alt text or are marked decorative.
- Motion uses short transitions and respects `prefers-reduced-motion`.
- Timer updates do not trap focus or create excessive screen-reader announcements.

## Phase 5 exit gate

Phase 5 is complete when:

- The primary journey has a wireframe for ingredient input, review, results, detail, cooking, and save.
- Serving adjustment, substitutions, missing ingredients, cost, and trust notes have defined interactions.
- Mobile, tablet, and desktop behavior is explicit.
- Loading, empty, error, retry, offline, rate-limit, auth, save, delete, and sign-out states have copy and recovery actions.
- The user can identify the current screen, primary action, and next step without explanation.
- Accessibility requirements are attached to the interaction contract.

## Transition to Phase 6

Phase 6 should apply the Ube and Mango visual system to these structures, finalize typography, shape, component variants, trust-note treatment, and content styling. Do not redesign the flow while applying visual polish unless a usability issue is documented.

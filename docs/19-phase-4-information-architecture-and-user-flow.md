# Phase 4: Information Architecture and User Flow

**Status:** Implemented; ready for Phase 4 sign-off

This document is the canonical route, screen, ownership, navigation, and state contract for Hapag. It maps the product promise and Phase 2 MVP scope onto a complete experience from opening the app to cooking, saving, deleting, or recovering from failure.

## Information architecture

Hapag is organized around five user intents:

1. **Discover** — What can I cook with what I have?
2. **Understand** — Why does this recipe fit, and what is missing?
3. **Adapt** — Can I change servings, budget, dietary context, or substitutions?
4. **Cook** — Can I follow the steps without losing my place?
5. **Remember** — Can I save, revisit, or learn from what I cooked?

## Site map

```text
Hapag
├── Home /
│   ├── Ingredient prompt
│   ├── Recent ingredients
│   ├── Quick filters
│   └── Popular or recent recipes
├── Ulam AI /ulam
│   ├── Ingredient input
│   ├── Ingredient review
│   ├── Constraints
│   └── Generate actions
├── Recipe results /results
│   ├── Three suggestion cards
│   ├── Sort or filter controls
│   ├── Retry generation
│   └── Start another search
├── Recipe detail /recipes/:recipeId
│   ├── Recipe summary
│   ├── Ingredients and availability
│   ├── Cost breakdown
│   ├── Serving control
│   ├── Substitutions
│   ├── Dietary and allergy notes
│   └── Start cooking or save
├── Cooking mode /recipes/:recipeId/cook
│   ├── One step at a time
│   ├── Progress
│   ├── Timer
│   ├── Pause or resume
│   └── Finish and remember
├── Saved /saved
│   ├── Favorites
│   ├── Cooked history
│   ├── Recipe reopen
│   └── Delete or unsave
├── Pantry /pantry
│   ├── Ingredient list
│   ├── Add or remove
│   ├── Stale or expiring context
│   └── Generate from pantry
└── Preferences /profile
    ├── Language preference
    ├── Default servings
    ├── Dietary preferences
    ├── Allergy context
    ├── Regional preference
    ├── Sign out
    └── Delete account data
```

Pantry is mapped in the architecture but remains a post-core implementation area according to the Phase 2 scope contract.

## Route contract

| Route | Primary purpose | Access | State owner |
|---|---|---|---|
| `/` | Start or resume ingredient discovery | Anonymous and signed in | Discovery session |
| `/ulam` | Enter, refine, and review ingredients | Anonymous and signed in | Discovery session |
| `/results` | Compare generated suggestions | Anonymous and signed in | Generation session |
| `/recipes/:recipeId` | Read and adapt a recipe | Anonymous and signed in | Recipe session plus optional saved state |
| `/recipes/:recipeId/cook` | Follow cooking steps | Anonymous and signed in | Cooking session |
| `/saved` | Reopen favorites and cooked recipes | Signed in; anonymous sign-in prompt | User account |
| `/pantry` | Manage ingredients and generate from them | Signed in; post-core | User account |
| `/profile` | Manage preferences and account actions | Signed in; anonymous sign-in prompt | User account |
| `/auth` | Sign in or create an account | Anonymous and signed in redirect | Auth session |

## Navigation model

### Mobile

Use a persistent bottom navigation bar:

```text
Home · Ulam AI · Saved · Pantry
```

The active destination must be visible without relying on color alone. The primary action on Home and Ulam AI remains reachable above the bottom navigation and does not hide behind it.

### Desktop

Use a left sidebar with the same destinations. Profile and preferences remain at the bottom of the sidebar. The primary content area has a comfortable reading width rather than stretching recipe steps across the full viewport.

### Global navigation rules

- The Hapag mark returns to Home.
- Back from Results returns to Ulam AI with the ingredient input and constraints preserved.
- Back from Recipe Detail returns to the same Results list and scroll position when possible.
- Back from Cooking returns to Recipe Detail without losing the current cooking step.
- A new generation must not silently discard an active cooking session; show confirmation when destructive.
- Auth redirects return the user to the action they attempted after successful sign-in.
- Delete and sign-out actions require confirmation when they can cause data loss.

## Primary journey: ingredient to cooked meal

### J01 — What can I cook?

```text
Home
  -> enter ingredients
Ulam AI
  -> review and refine chips
  -> apply constraints
  -> generate
Results
  -> compare three suggestions
Recipe detail
  -> review cost, missing ingredients, and substitutions
  -> adjust servings
Cooking mode
  -> follow steps and timer
  -> finish
Remember
  -> save, favorite, or mark cooked
```

Exit conditions:

- The user understands what ingredients were recognized.
- The user can explain why a suggestion fits.
- The user can identify missing ingredients and estimated cost.
- The user can start cooking without an unstructured AI response.
- The user understands what was saved after completion.

## Secondary journeys

### J02 — Browse by context

```text
Home
  -> select meal, budget, dietary, regional, or spice context
  -> view recipe suggestions
  -> open detail
```

The context filter must remain visible on Results so the user can understand why results changed.

### J03 — Save and reopen

```text
Recipe detail
  -> tap Save
  -> sign in if required
  -> return to recipe detail
Saved
  -> open recipe
  -> unsave or delete
```

The saved state must be confirmed with a short message and must not require the user to infer success from an icon color change.

### J04 — Pantry generation

```text
Pantry
  -> add, edit, or remove ingredients
  -> generate from pantry
Results
  -> inspect available and missing ingredients
```

This journey is mapped for the product architecture but is implemented after the core recipe loop.

### J05 — Recover from generation failure

```text
Ulam AI
  -> submit valid ingredients
  -> loading or failure
  -> preserve input
  -> retry or use curated fallback
Results or Ulam AI
```

The user must never be forced to retype ingredients after a timeout, rate limit, invalid model response, or offline transition.

### J06 — Delete private data

```text
Saved or Profile
  -> choose delete or remove
  -> explain consequence
  -> confirm
  -> show success or retry
  -> return to an empty or remaining-list state
```

## Access and ownership matrix

| Capability | Anonymous | Signed in | Owner |
|---|---|---|---|
| Enter ingredients | Yes | Yes | Discovery session |
| Generate suggestions | Yes, rate-limited | Yes, rate-limited | Generation service |
| View recipe detail | Yes | Yes | Recipe snapshot or fixture |
| Adjust servings | Yes | Yes | Local recipe state |
| View substitutions | Yes | Yes | Validated recipe object |
| Start cooking | Yes | Yes | Local cooking session |
| Save recipe | Sign-in prompt | Yes | User account |
| Favorite recipe | Sign-in prompt | Yes | User account |
| Mark cooked | Sign-in prompt | Yes | User account |
| View Saved | Sign-in prompt | Yes | User account with RLS |
| Manage Pantry | Sign-in prompt | Yes, post-core | User account with RLS |
| Manage preferences | Sign-in prompt | Yes | User account with RLS |
| Sign out | No | Yes | Auth session |
| Delete user data | No | Yes | User account with RLS and deletion path |

Anonymous discovery state may be kept in memory or local browser storage, but it must not be presented as durable account data.

## Screen ownership and required content

| Screen | Must answer | Primary action | Secondary action |
|---|---|---|---|
| Home | What can I cook? | Enter ingredients | Browse context |
| Ulam AI | What ingredients and constraints should be used? | Lutuin natin! | Surprise me |
| Results | Which suggestion fits best? | Open recipe | Retry or refine |
| Recipe detail | How do I make and adapt it? | Start cooking | Save or substitute |
| Cooking mode | What do I do now? | Next step | Pause, timer, previous |
| Saved | What did I keep or cook before? | Reopen recipe | Unsave or delete |
| Pantry | What ingredients do I have available? | Generate from pantry | Add or remove |
| Profile | What defaults and safety context apply? | Save preferences | Sign out or delete data |

## State matrix

| Screen | Empty | Loading | Success | Error or recovery | Auth-required |
|---|---|---|---|---|---|
| Home | Pot illustration and input prompt | Restore session skeleton | Recent or popular content | Preserve input and retry | Not required |
| Ulam AI | Explain what to enter | `Naghahanap ng ulam...` | Ingredient chips and constraints | Validation, timeout, offline, or retry | Not required |
| Results | No results with edit or retry action | Skeleton suggestion cards | Three structured cards | Retry, fallback, or refine input | Not required |
| Recipe detail | Recipe unavailable with return action | Recipe skeleton | Complete recipe contract | Invalid data, deleted recipe, or retry | Save action only |
| Cooking mode | No active session with return action | Step transition or timer state | Current step and progress | Resume, restart, or return to detail | Not required |
| Saved | Sign-in prompt or friendly empty state | List skeleton | Favorites and cooked history | Load error, delete retry | Yes for account data |
| Pantry | Sign-in prompt or empty pantry | Ingredient-list skeleton | Pantry items and generate action | Add/remove retry or stale item | Yes; post-core |
| Profile | Sign-in prompt | Preferences skeleton | Saved preferences | Validation or save retry | Yes for account data |

## State behavior rules

### Empty

- Explain what the user can do next.
- Include one primary recovery action.
- Avoid empty states that only say `No data`.

### Loading

- Keep the triggering context visible where possible.
- Use skeletons for cards and a direct status message for generation.
- Do not show a finished-looking recipe before validation completes.

### Error

- Explain the failure in plain language.
- Preserve user-entered ingredients and constraints.
- Offer retry, edit, fallback, or return actions.
- Never expose raw model errors, API keys, or internal stack traces.

### Offline

- Allow the user to continue reading already-loaded recipe content.
- Disable generation and persistence actions with an explanation.
- Allow retry when connectivity returns.

### Rate limited

- Explain that Hapag needs a short pause before another attempt.
- Preserve the current request.
- Offer a curated fixture or previously loaded recipe when available.

### Authentication required

- Explain why sign-in is needed for the attempted action.
- Preserve the recipe and return destination.
- Return the user to the original action after successful authentication.

### Save, delete, and sign-out

- Confirm success with text, not color alone.
- Make deletion consequences clear before confirmation.
- Return to a recoverable empty or remaining-list state.
- Clear private state after sign-out while retaining only explicitly anonymous session data.

## State ownership boundaries

| State | Owner | Persistence |
|---|---|---|
| Raw ingredient text | Discovery session | Temporary |
| Normalized ingredient chips | Discovery session | Temporary; optional local restore |
| Generation request and constraints | Generation session | Temporary |
| Recipe suggestions | Generation session | Temporary until saved or captured |
| Open recipe and serving adjustment | Recipe session | Local until saved |
| Current cooking step and timer | Cooking session | Local; optional resume later |
| Saved recipe | Supabase user data | Durable and RLS-protected |
| Favorite relationship | Supabase user data | Durable and RLS-protected |
| Cooked event | Supabase user data | Durable and RLS-protected |
| Pantry item | Supabase user data | Durable and RLS-protected; post-core |
| Preferences | Supabase user data | Durable and RLS-protected |

## Phase 4 exit gate

Phase 4 is complete when:

- Home, Ulam AI, Results, Recipe Detail, Cooking, Saved, Pantry, Preferences, and Auth are mapped.
- Every core journey has a defined next action and recovery path.
- Empty, loading, error, retry, save, delete, sign-out, offline, rate-limit, and auth-required states are listed.
- Anonymous versus signed-in access is explicit.
- State ownership and persistence boundaries are explicit.
- Navigation preserves ingredient input, recipe context, and cooking progress where required.
- No core screen depends on an undefined state.

## Transition to Phase 5

Phase 5 should turn this contract into wireframes and interaction notes. Wireframes should be created for the primary journey and its highest-risk states before visual polish or backend integration.

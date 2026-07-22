# Hapag Implementation Plan

This is a deliberate, quality-first roadmap for building Hapag from zero to a portfolio-ready release. Each phase has a concrete outcome, deliverables, dependencies, and an exit gate. Do not begin the next phase until the exit gate is met or the open risk is documented.

## Phase map

| Phase | Outcome | Exit gate |
|---|---|---|
| 1. Product definition | Stable promise, audience, and trust boundary | MVP fits in one sentence and non-goals are written |
| 2. Scope and success criteria | Prioritized MVP and measurable acceptance criteria | Every proposed feature is now, next, or deferred |
| 3. Filipino recipe domain research | Dish, ingredient, language, and pricing assumptions | Initial recipe fixtures and rules are documented |
| 4. Information architecture | Complete route, content, and state map | No core journey has an undefined state |
| 5. UX flow and wireframes | Usable ingredient-to-recipe flow before styling | A user can explain the next action without help |
| 6. Visual and content system | Cohesive Ube and Mango interface system | Contrast, copy, and component review passes |
| 7. Technical foundation | Maintainable React and TypeScript base | Install, typecheck, lint, and build pass |
| 8. Static frontend journey | Full flow works with fixtures and no backend | Mobile and desktop happy/error paths are demoable |
| 9. Recipe schema and fixture engine | Stable structured recipe contract | Fixtures render without shape-specific hacks |
| 10. AI generation service | Safe server-side recipe generation | Invalid or unavailable AI falls back cleanly |
| 11. Supabase persistence | Auth, favorites, and private user data | Second user cannot access first user's data |
| 12. Recipe controls | Serving adjustment, substitutions, filters, and costs | Controls update the visible recipe correctly |
| 14. Photo and voice input | Additional input modes without weakening text flow | Uncertain extraction is reviewable before generation |
| 15. Safety, accessibility, and performance | Responsible, usable, resilient product | No critical issues remain |
| 16. Deployment and portfolio proof | Live, tested, documented project | Fresh reviewer completes the core flow |

## Working cadence

Complete the phase deliverables, run the exit gate, record open issues, and only then start the next phase. Keep a small golden fixture set so improvements do not quietly break familiar Filipino meals.

## Definition of done for every phase

- The intended outcome is visible in the product or documentation.
- Main, empty, loading, error, and recovery states are considered.
- Decisions and assumptions are recorded.
- Relevant tests or review evidence exist.
- Known limitations are not hidden from the user or future developer.

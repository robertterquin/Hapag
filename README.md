# Hapag

Hapag is a playful Filipino cooking assistant that helps users turn the ingredients they already have into affordable, practical meals.

> **May sahog ka? Luto tayo.**

## Product flow

**Enter ingredients -> refine constraints -> get suggestions -> choose a recipe -> cook -> save**

The core release supports English, Tagalog, and Taglish ingredient input, familiar Filipino dishes, estimated costs, substitutions, serving adjustment, dietary filters, cooking mode, and saved recipes.

## Tech stack

- React + TypeScript + Vite
- Supabase Auth, PostgreSQL, Storage, Edge Functions, and Row Level Security
- OpenAI API through a server-side Supabase Edge Function

## Project documentation

The detailed product plan, UX rules, visual system, scope boundaries, and quality gates are in [`docs/`](./docs/).

The full 18-page project flow and scope PDF is at [`output/pdf/hapag-project-flow-scope.pdf`](./output/pdf/hapag-project-flow-scope.pdf).

Start with:

1. [`docs/01-product-principles.md`](./docs/01-product-principles.md)
2. [`docs/03-user-journeys.md`](./docs/03-user-journeys.md)
3. [`docs/13-implementation-plan.md`](./docs/13-implementation-plan.md)
4. [`docs/16-phase-1-product-definition.md`](./docs/16-phase-1-product-definition.md)
5. [`docs/17-phase-2-scope-and-success-criteria.md`](./docs/17-phase-2-scope-and-success-criteria.md)
6. [`docs/18-phase-3-filipino-recipe-domain-research.md`](./docs/18-phase-3-filipino-recipe-domain-research.md)
7. [`docs/18-phase-3-recipe-fixtures.md`](./docs/18-phase-3-recipe-fixtures.md)
8. [`docs/19-phase-4-information-architecture-and-user-flow.md`](./docs/19-phase-4-information-architecture-and-user-flow.md)
9. [`docs/20-phase-5-ux-wireframes-and-interaction-contract.md`](./docs/20-phase-5-ux-wireframes-and-interaction-contract.md)
10. [`docs/21-phase-6-visual-and-content-system.md`](./docs/21-phase-6-visual-and-content-system.md)
11. [`docs/22-phase-7-frontend-foundation-and-workflow.md`](./docs/22-phase-7-frontend-foundation-and-workflow.md)
12. [`docs/23-phase-8-static-ui-and-state-coverage.md`](./docs/23-phase-8-static-ui-and-state-coverage.md)
13. [`docs/24-phase-9-recipe-schema-and-fixture-engine.md`](./docs/24-phase-9-recipe-schema-and-fixture-engine.md)
14. [`docs/25-phase-10-ai-generation-service.md`](./docs/25-phase-10-ai-generation-service.md)

## Security boundary

Never expose the OpenAI API key in the React client. Keep AI requests, validation, rate limits, and secrets inside the server-side function boundary.

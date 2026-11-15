# Constitution

Non-negotiable principles. Any exception needs a written reason in the relevant spec and in the
README.

## 1. Scope

The product is exactly the five assessment requirements:

1. A users list with search by name.
2. Selecting a user shows their posts and allows creating a post through a validated form
   (title and body required). The new post appears in the list. The API does not persist it.
3. Visible loading and error states.
4. Tests with Vitest and Testing Library.
5. A README covering how to run, decisions, future work and AI usage.

Anything else goes to "What I would do with more time" in the README. Scope discipline beats
feature count. The time box is 3 hours. If quality is at risk, cut scope and document it.

## 2. Stack

- Node 26 (Active LTS), React 19, TypeScript 6 in `strict` mode with `noUncheckedIndexedAccess`
  and `noImplicitOverride`, Vite 8.
- Tailwind CSS v4, CSS-first (`@theme` tokens). No UI kit; only a small icon library if needed.
- TanStack Query v5 for server state, React Hook Form with Zod for forms, Zod at the API boundary.
- Vitest, Testing Library, MSW, Playwright and axe for tests.
- Versions are pinned exactly. Peer-dependency conflicts are resolved with the newest compatible
  versions, never with `--force` or `overrides`.

## 3. Code quality

- No `any`, no non-null assertions, no `// @ts-ignore`. `unknown` is narrowed with Zod or type
  guards.
- Components never call `fetch`. All HTTP goes through the shared API client.
- Derive state instead of syncing it. `useEffect` only for real synchronization with external
  systems.
- Lint (zero warnings), typecheck and format must pass on every commit.

## 4. Testing

- TDD: a failing test exists before the code that makes it pass.
- Tests assert user-visible behavior: queries by role and label, `userEvent`, MSW for the network.
- Coverage thresholds are 100% for lines, branches, functions and statements. Coverage is a floor,
  not a goal. Unreachable code is removed or its exclusion is documented. Tests are never written
  just to execute lines.
- No live network in tests. Unit and integration tests use MSW; e2e uses Playwright `page.route`.
  Fixtures come from real API responses ([api-contract](api-contract.md#test-fixtures)).
- No flaky tests: no sleeps, no order dependence, state reset between tests.

## 5. Accessibility

- Semantic HTML and landmarks, a correct heading hierarchy, labels for every control.
- Fully usable with the keyboard, with visible focus.
- Async status is announced through `aria-live`. Errors are linked with `aria-describedby`.
- WCAG 2.2 AA color contrast in light and dark mode. Motion respects `prefers-reduced-motion`.
- axe reports no violations on the main screens.

## 6. Process

- Spec, then test, then code, then commit ([specs/README.md](README.md#workflow)).
- Conventional Commits, atomic, buildable. History is never rewritten.
- AI usage is logged truthfully in `docs/ai-usage-log.md`, including mistakes and corrections.

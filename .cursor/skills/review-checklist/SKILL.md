---
name: review-checklist
description: >-
  Pre-commit self-review checklist covering accessibility, types, tests, spec traceability and
  scope for this repo. Use before committing a feat/refactor, before merging a branch, or when
  the user asks for a review of local changes.
---

# Review checklist

Run through `git diff --staged` (or the branch diff) with this list. Fix the issues before
committing. Don't just note them.

## Scope

- [ ] Every change maps to a requirement ID in `specs/`. No extra features, props or endpoints.
- [ ] No new dependency unless a spec needs it (and its version and peer dependencies were
      checked).

## Spec traceability

- [ ] Tests are named with the requirement IDs they prove.
- [ ] Traceability tables and `specs/tasks.md` are updated.
- [ ] Specs were changed first if behavior differs from them.

## Types and code

- [ ] No `any`, `!`, `@ts-ignore` or unchecked casts. `unknown` is narrowed with Zod or guards.
- [ ] No `fetch` outside `shared/api/httpClient`. API data is parsed with Zod.
- [ ] State is derived, not synced. No unnecessary `useEffect`, `useMemo` or `useCallback`.
- [ ] Stable namespaced keys. No index keys.
- [ ] TSDoc on exported items where it adds meaning. No noise comments.

## Tests

- [ ] They fail without the change (red was observed) and pass with it.
- [ ] Role and label queries, `userEvent`, MSW. No implementation-detail or snapshot assertions.
- [ ] Loading, error with retry, and empty paths are covered where relevant.
- [ ] No sleeps and no order dependence. Handlers and URL reset.
- [ ] `npm run test:coverage` shows 100% without new exclusions (or the exclusion is documented).

## Accessibility and design

- [ ] Semantic elements, landmarks, heading order.
- [ ] Labels, `aria-invalid` and `aria-describedby` on fields. `aria-live`/`role="alert"` for async
      status.
- [ ] Keyboard operable, visible focus, no focus traps.
- [ ] Tokens only (no raw hex), dark mode OK, `motion-safe:` for animation, works at 360 px.

## Commit

- [ ] Lint and typecheck pass. One logical change. Conventional message, at most 72 chars, with a
      body if the _why_ isn't obvious.
- [ ] Notable AI interactions appended to `docs/ai-usage-log.md`.

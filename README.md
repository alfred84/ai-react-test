# Users and Posts

A small React + TypeScript app on top of [JSONPlaceholder](https://jsonplaceholder.typicode.com):
browse users, search them by name, read their posts and create new ones.

- Users list with a debounced, case- and accent-insensitive search by name (`?q=`).
- Selecting a user (`?user=`) shows their posts next to the list (separate views on mobile).
- A validated "New post" form. The API does not persist posts, so new ones are kept for the
  session and shown first with a "New" badge.
- Visible loading (skeletons), empty and error states, each with a "Try again" action.
- 71 unit/integration tests (Vitest, Testing Library, MSW) at 100% coverage, and 6 Playwright
  e2e tests including an axe accessibility scan.

## Tech stack and versions

All versions were checked with `npm view` on 2026-11-15 and are pinned exactly (`.npmrc`
`save-exact=true`).

### Runtime and tooling baseline

- **Node 26 (Active LTS), npm 11.** Node 26 is the current Active LTS line, so it gets the longest
  support window and is what CI uses (`.nvmrc`, `engines.node: ">=26"`, `node-version: 26`).
  Every dependency below was checked with `npm view <pkg> engines` and accepts Node 26.

| Area       | Package                                               | Version                           |
| ---------- | ----------------------------------------------------- | --------------------------------- |
| UI         | react, react-dom                                      | 19.3.1                            |
| Language   | typescript                                            | 6.0.3                             |
| Build      | vite / @vitejs/plugin-react                           | 8.3.8 / 6.3.0                     |
| Styling    | tailwindcss, @tailwindcss/vite                        | 4.3.5                             |
| Font       | @fontsource-variable/inter                            | 5.3.0                             |
| Unit tests | vitest, @vitest/coverage-v8                           | 5.1.0                             |
| DOM        | jsdom                                                 | 31.0.1                            |
| Testing    | @testing-library/react / dom / user-event / jest-dom  | 16.3.3 / 10.4.2 / 14.6.10 / 7.0.1 |
| Mocking    | msw                                                   | 3.0.6                             |
| E2E        | @playwright/test / @axe-core/playwright               | 1.65.1 / 4.14.0                   |
| Lint       | eslint, @eslint/js                                    | 9.39.5                            |
| Lint       | typescript-eslint                                     | 8.72.2                            |
| Lint       | eslint-plugin-react-hooks / react-refresh / jsx-a11y  | 7.1.1 / 0.5.8 / 6.10.2            |
| Lint       | eslint-plugin-testing-library / @vitest/eslint-plugin | 7.16.2 / 1.6.28                   |
| Lint       | @tanstack/eslint-plugin-query                         | 5.107.1                           |
| Format     | prettier / prettier-plugin-tailwindcss                | 3.10.1 / 0.8.1                    |
| Git hooks  | husky / lint-staged                                   | 9.1.7 / 17.6.0                    |
| Commits    | @commitlint/cli, @commitlint/config-conventional      | 21.2.4                            |
| Server     | @tanstack/react-query                                 | 5.107.1                           |
| Forms      | react-hook-form / @hookform/resolvers                 | 7.92.0 / 7.0.6                    |
| Validation | zod                                                   | 4.6.7                             |
| Icons      | lucide-react                                          | 1.73.0                            |

### Compatibility notes

- **TypeScript 6.0.3 instead of 7.0.x.** `typescript-eslint@8.72.2` declares
  `typescript >=4.8.4 <6.1.0` as a peer dependency. Type-aware linting matters more here than the
  faster native compiler, so the project stays on the 6.0 line.
- **ESLint 9.39.5 instead of 10.x.** `eslint-plugin-jsx-a11y@6.10.2` (latest) declares
  `eslint <=9` as a peer. Rather than forcing it with `overrides`, the project uses the newest
  ESLint that every plugin officially supports.
- `npm audit` reports moderate `minimatch` advisories inside the dev-only ESLint toolchain. The only
  automatic fix downgrades `typescript-eslint`, and none of that code ships to the browser.

## Getting started

```bash
nvm use            # Node 26
npm ci
npm run dev        # http://localhost:5173
```

| Script                  | What it does                                                              |
| ----------------------- | ------------------------------------------------------------------------- |
| `npm run dev`           | Vite dev server                                                           |
| `npm run build`         | Typecheck and production build                                            |
| `npm run preview`       | Serve the production build                                                |
| `npm run lint`          | ESLint (zero warnings allowed)                                            |
| `npm run format`        | Prettier write (`format:check` to verify only)                            |
| `npm run typecheck`     | `tsc -b` over app and tooling configs                                     |
| `npm test`              | Unit/integration tests once                                               |
| `npm run test:watch`    | Vitest in watch mode                                                      |
| `npm run test:coverage` | Tests with v8 coverage (100% thresholds)                                  |
| `npm run test:e2e`      | Playwright e2e on Chromium (first run: `npx playwright install chromium`) |

## Project structure

```text
src/
  app/                 App shell, providers, query client, error boundary, master-detail wiring
  features/
    users/             api, hooks, schemas, components, __tests__
    posts/             api, hooks, schemas, components, state (created posts), __tests__
  shared/
    api/               httpClient, ApiError, getErrorMessage, API_BASE_URL
    lib/               normalizeText, useDebouncedValue, useSearchParam, useSelectedUserId
    ui/                Button, ErrorState, EmptyState, Skeleton, Avatar
  test/                setup, MSW server and handlers, render helper, real API fixtures
e2e/                   Playwright specs and page.route mocks
specs/                 Constitution, architecture, API contract, feature specs, plan, tasks
docs/ai-usage-log.md   How AI was used, step by step
.cursor/               Project rules and skills for the AI agent (AGENTS.md at the root)
```

Features never import each other's internals: `src/app` composes them. Components never call
`fetch`. They use hooks, which call `api/` functions, which use the shared `httpClient`.

## Architecture and key decisions

The full reasoning is in [specs/architecture.md](specs/architecture.md) and the API facts in
[specs/api-contract.md](specs/api-contract.md). The short version:

- **API contract verified first.** Every endpoint was probed with `curl` before writing specs.
  Only three endpoints are used: `GET /users`, `GET /posts?userId=:id` and `POST /posts`, over
  https. The fixtures in `src/test/fixtures/` are the real responses, and both MSW and the e2e
  mocks serve them.
- **Validated boundary.** `httpClient` turns every failure into a typed `ApiError` (`network`,
  `http` with status, `parse`) and validates every payload with Zod. Aborts are rethrown untouched
  so TanStack Query treats them as cancellations.
- **Server state in TanStack Query.** `staleTime` is 5 minutes, so reselecting a user shows cached
  posts instantly. No retries for 4xx or invalid payloads, at most 2 for network errors and 5xx,
  and never for mutations. Switching users aborts the previous posts request through the query
  `AbortSignal`.
- **URL state without a router.** Search (`?q=`) and selection (`?user=`) live in the URL through
  a small `useSyncExternalStore` hook using `replaceState`. They survive reloads and can be
  shared, without adding a routing dependency for a single screen.
- **Created posts are client-only data.** `POST /posts` always answers `id: 101` and persists
  nothing. New posts are kept per user in a `CreatedPostsProvider` (context and `useReducer`)
  instead of the query cache, so refetches or cache garbage collection can't drop them. They get
  `local-<uuid>` keys (server posts use `server-<id>`), so ids never collide. They belong to the
  user they were submitted for, even if the selection changes mid-request.
- **Forms.** React Hook Form with the Zod resolver. Values are trimmed, title is limited to 100
  characters and body to 1000. Errors show on blur and on submit, are linked with
  `aria-describedby`, and focus moves to the first invalid field.
- **Accessibility and design.** Semantic landmarks and headings, labeled regions with `aria-busy`
  while loading, polite live regions for result counts and "Post published", `role="alert"` for
  failures, visible focus rings, and decorative icons hidden from assistive tech. Design tokens in
  Tailwind v4 `@theme` with a dark mode via `prefers-color-scheme`, and `motion-safe:` animations.
  The layout is responsive from 360 px.

## Testing strategy

- **Unit and integration (Vitest, Testing Library, MSW).** Tests render real components with
  providers and a real `QueryClient`, and the network is mocked by MSW serving the real fixtures.
  Unhandled requests fail the test. Queries are by role and accessible name, and interactions go
  through `userEvent`. Each test name starts with the requirement ID it proves.
- **Coverage gate.** v8 coverage at 100% for lines, branches, functions and statements, enforced
  in CI. Uncovered code was either tested as a behavior or deleted.
- **E2E (Playwright, Chromium).** Runs against the production build. A fixture fails any API
  request that a spec does not mock (`page.route`), so the suite never depends on the live API.
  It covers search and select, error and retry, mobile back navigation, validation and publishing,
  and an axe scan with zero violations.
- **Traceability.** Each feature spec ends with a table mapping every requirement ID to its tests.

## Spec-driven development workflow

1. Verify the API and write the contract (`specs/api-contract.md`).
2. Write the constitution, architecture and one spec per feature with requirement IDs and
   Given/When/Then acceptance criteria. Review gate: I approved the specs before any feature code.
3. For each feature: a red commit with failing tests derived from the acceptance criteria, then
   green commits with the minimum code, then the traceability table updated to "Done".
4. If the implementation shows that a spec is wrong, the spec changes first, in its own
   `docs(spec)` commit (for example the "Reload page" link in AS-11).

The rules the agent followed are in `AGENTS.md` and `.cursor/rules/`. The repeatable procedures
(write a spec, a TDD cycle, an atomic commit, a review checklist) are in `.cursor/skills/`.

## Git workflow

- Conventional Commits (enforced by commitlint, subject at most 72 characters), small and atomic.
- Short-lived branches per phase or feature (`chore/tooling`, `docs/specs`, `chore/ai-rules`,
  `feat/async-states`, `feat/users-list`, `feat/user-posts`, `feat/create-post`, `test/e2e`,
  `docs/hardening`), merged into `main` with
  `--no-ff` so each feature stays visible in the history.
- Husky hooks: pre-commit runs lint-staged and typecheck, commit-msg runs commitlint, pre-push
  runs the tests. CI runs lint, format check, typecheck, coverage, build and e2e on Node 26.
- History is never rewritten after a commit. The one exception happened before any push and is
  documented in the AI usage log.

## How I used AI

I used the Cursor agent as a pair programmer, with me as the reviewer and decision-maker. The full,
dated record is in [docs/ai-usage-log.md](docs/ai-usage-log.md). In summary:

- **What I asked for:** version and peer-dependency research before installing anything, probing
  the real API before writing specs, the specs, rules and skills (with a review stop), strict TDD
  per feature, and atomic commits I could review.
- **What I accepted:** the stack choices backed by `npm view` evidence (TypeScript 6.0.3 and
  ESLint 9 because of peer ranges), the created-posts design (client-only store with `local-<uuid>`
  keys), URL state without a router, and the retry policy. `TODO(me)`: add my own review notes.
- **What I corrected or redirected:** I moved the baseline to Node 26 and required an `engines`
  check of every package. I limited the API scope to three endpoints with https only and a
  versioned contract. I chose to soft-reset one broken commit (empty message) and recommit it.
  `TODO(me)`: add anything else I changed during review.
- **Where AI corrected itself:** its own mistakes were caught by the toolchain, not by luck.
  Typecheck caught the MSW 3 option rename and the `nodenext` extensions. Lint caught a deprecated
  TanStack Query API. The coverage gate caught dead code and an untested branch. A test bug was
  found when an always-mounted live region resolved too early. Each case is in the log.
- **Trade-off I accepted to fit the time box:** each feature's acceptance tests were written in one
  red commit instead of one cycle per task, and the small-screen focus move was cut.

## What I would do with more time

- Move focus to the posts heading when a user is selected on small screens (deferred UP-08
  non-functional requirement).
- Visual regression tests for the light and dark themes, and an axe scan of the error and empty
  states too.
- Move to ESLint 10 once `eslint-plugin-jsx-a11y` declares support for it, and to TypeScript 7 once
  `typescript-eslint` supports it.
- Edit and delete posts (`PUT`/`PATCH`/`DELETE /posts/:id`) and post comments
  (`/posts/:id/comments`). These are intentionally out of scope; see `specs/api-contract.md`.

## Known limitations

- Created posts live only for the session and are lost on reload, matching the API, which persists
  nothing.
- If loading posts fails, posts created in this session are hidden until "Try again" succeeds.
- Only the three in-scope endpoints are used; the users list is not paginated (the API has 10).
- E2E runs on Chromium only.

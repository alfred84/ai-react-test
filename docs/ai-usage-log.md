# AI usage log

Append-only record of how AI (Cursor agent) was used in this project. Entries are written during
the work and reviewed by me before submission. "I" is the candidate. "AI" is the agent.
Anything I have not yet confirmed is marked `TODO(me)`.

Each entry: **date/step**, **prompt summary**, **what AI produced**, **what I accepted**,
**what I corrected or rejected and why**.

---

## 2026-11-15 10:26 · Kickoff and version research (plan mode)

- **Prompt summary:** Full assessment brief and working agreement: phases, stack, TDD, specs,
  rules, skills, git rules. Verify the latest stable versions and peer compatibility before
  installing anything, and stop for review after Phase 1.
- **What AI produced:** A Phase 0-1 plan. `npm view` checks of about 45 packages, including their
  peer-dependency ranges, and the active Node LTS from nodejs.org. First probes of the real API.
  Two conflicts found and resolved:
  - TypeScript 7.0.2 is latest, but `typescript-eslint@8.72.2` requires `<6.1.0`, so it proposed
    **TypeScript 6.0.3**.
  - ESLint 10.15.0 is latest, but `eslint-plugin-jsx-a11y@6.10.2` declares `eslint <=9`, so it
    proposed **ESLint 9.39.5** without `overrides`.
- **What I accepted:** The plan (I switched the agent to implementation mode) and both downgrades.
  `TODO(me)`: confirm the wording.
- **What I corrected or rejected:** None at this step. A late result showed `@types/node` 26.6.6
  exists. AI updated the plan from 24.19.2 to 26.6.6 on its own.

## 2026-11-15 10:41 · Node 26 baseline

- **Prompt summary:** I upgraded my machine from Node 24 to Node 26 (Active LTS) and asked AI to
  confirm `node -v`/`npm -v`, to set Node 26 in `.nvmrc`, `engines` and CI, to verify that every
  package's `engines` supports Node 26, and to tell me before installing if one didn't.
- **What AI produced:** It confirmed v26.13.1 and npm 11.20.0, and checked the `engines` of all 42
  pinned packages. All allow Node 26, so no alternatives were needed. It set `.nvmrc` to `26`,
  `engines.node` to `">=26"` and the CI `node-version` to `26`, and added the reason to the README.
- **What I accepted:** All of it. `TODO(me)`
- **What I corrected or rejected:** The original plan only said "Node 26 in `.nvmrc` and CI". I
  added the explicit `engines` field and the engines verification requirement.

## 2026-11-15 ~10:45-11:28 · Phase 0 scaffolding and tooling

- **Prompt summary:** Execute Phase 0 as planned.
- **What AI produced:** Twelve commits on `chore/tooling` covering the Vite scaffold, strict
  TypeScript with the `@/` alias, Tailwind v4, ESLint and Prettier, Vitest with Testing Library and
  MSW (100% thresholds), Playwright, Husky, lint-staged and commitlint, CI, and a README skeleton.
  It merged them with `--no-ff`.
- **What I accepted:** The structure and commit split. `TODO(me)`
- **Mistakes and corrections during this step (all real):**
  - The current `create-vite` template defaults to TypeScript 7 and **oxlint**. AI kept the
    agreed TypeScript 6.0.3 and ESLint and dropped `.oxlintrc.json`, noted in the commit body.
  - **Bad commit message (AI mistake).** AI wrote the commit message with a PowerShell cmdlet
    option that Windows PowerShell 5 doesn't support (`utf8NoBOM`). The file was never created,
    and `git commit -F` still produced a commit whose message was only the Cursor
    `Co-authored-by` trailer. AI stopped and asked me how to proceed. **I chose to soft-reset and
    recommit** with the correct message. That was the only history change, done before any
    push. AI then switched to writing message files with a file tool, and recorded the pitfall
    in the `atomic-commit` skill.
  - AI tried a PowerShell helper function that does not persist between tool calls. Nothing was
    committed, and it retried with the file approach.
  - The strict lint rules flagged the template's non-null assertion on `#root`. AI replaced it
    with an explicit guard.
  - **MSW 3 API change.** AI first wrote the MSW 2 option `onUnhandledRequest`. Typecheck failed,
    and AI found in the MSW 3 type definitions that it is now `onUnhandledFrame`. It then proved
    with a throwaway test that unmocked requests really fail the test, since the live API would
    have answered 200.
  - `nodenext` requires explicit file extensions in `vitest.config.ts` and `e2e/` imports. Both
    were caught by typecheck and fixed.
  - The Playwright browser download stalled at 0 bytes. AI noticed, killed it and retried with
    debug output, which succeeded.
  - The Cursor auto-review blocked merges into `main` until I approved them in the approval card.

## 2026-11-15 11:30 · Verify the real API before writing specs

- **Prompt summary:** I asked AI to inspect the API with `curl` and the official guide before
  writing specs: the user shape and count, user posts (pick an endpoint and explain), `POST /posts`
  behavior and persistence, headers and CORS, unknown ids. Then to document the contract and derive
  the Zod schemas and fixtures from the real responses.
- **What AI produced:** Probes of every endpoint and `specs/api-contract.md`. Real fixtures saved
  verbatim in `src/test/fixtures/` and excluded from Prettier. Findings:
  - 10 users with 10 posts each, and every body contains `\n`.
  - `/posts?userId` and `/users/:id/posts` are byte-identical (same ETag). It chose the query form.
  - Unknown or invalid ids return `200 []`.
  - `POST` always returns `201` with `id: 101`, persists nothing (`/posts/101` is 404 afterwards)
    and does no validation (empty strings are accepted).
  - The open CORS preflight was confirmed.
- **What I accepted:** `TODO(me)`
- **What I corrected or rejected:** None. One AI slip turned into a finding: its first POST probes
  sent malformed JSON (PowerShell quoting), and the API answered `500` with an HTML stack trace.
  AI redid the probe with a body file and documented that error bodies can't be assumed to be
  JSON.

## 2026-11-15 11:46 · Official reference and scope

- **Prompt summary:** I pasted the official JSONPlaceholder reference and asked AI to use it as an
  input but still verify with `curl` (the docs don't show `GET /users`). I limited scope to the
  three endpoints, asked for edit, delete and comments to go under "with more time", for the
  contract to be versioned, and for https only.
- **What AI produced:** Contract v1.0.1: the guide cited as a source, an https-only rule, an
  out-of-scope routes section, `body` as the text field, the client-id merge rule, and a changelog.
  The README future-work entries.
- **What I accepted:** `TODO(me)`
- **What I corrected or rejected:** AI corrected itself before committing. Its draft listed
  `_page`/`_limit`/`_sort` as out-of-scope API features, which implied they exist, although
  neither the guide nor the probes covered them. It reworded this to "any query parameter other
  than `userId`".

## 2026-11-15 11:49 · Specs, rules and skills

- **Prompt summary:** "Please continue": the rest of Phase 1.
- **What AI produced:** The specs README (template, IDs, lifecycle), constitution, architecture,
  four feature specs (AS, UL, UP, CP) with G/W/T and traceability tables, plan with a time budget
  and cut list, tasks, `AGENTS.md`, eight Cursor rules and four skills.
- **Key decisions proposed by AI, pending my review:**
  - Locally created posts live in a React context (`CreatedPostsProvider`), not in the TanStack
    Query cache, because they are client-only data and refetches must not drop them.
  - Created posts get `local-<uuid>` keys, and server posts get `server-<id>` keys.
  - URL state uses a small `useSyncExternalStore` hook instead of a router dependency.
  - Form limits: title 100 and body 1000 characters (observed maximums are 79 and 225).
  - Retry: none for 4xx or parse errors, at most 2 for network errors and 5xx, none for mutations.
- **What I accepted:** `TODO(me)` (review gate at the end of Phase 1).
- **What I corrected or rejected:** `TODO(me)`

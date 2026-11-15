# AGENTS.md

Guidance for AI agents working in this repository. Humans: see `README.md`.

## Project

Users and Posts: a React 19 + TypeScript app on JSONPlaceholder. It has a users list with search,
the selected user's posts, and a validated create-post form (the API does not persist posts).
The project is a time-boxed (3 h) technical assessment. **Scope is fixed by
`specs/constitution.md`; do not add features.**

All code, comments, commits, specs and docs are in English.

## Commands

| Task        | Command                       |
| ----------- | ----------------------------- |
| Install     | `npm ci` (Node 26, `nvm use`) |
| Dev server  | `npm run dev`                 |
| Lint        | `npm run lint`                |
| Format      | `npm run format`              |
| Typecheck   | `npm run typecheck`           |
| Unit tests  | `npm test`                    |
| Single file | `npx vitest run <path>`       |
| Coverage    | `npm run test:coverage`       |
| E2E         | `npm run test:e2e`            |
| Build       | `npm run build`               |

## Where things are

- `specs/`: the source of truth. Read `specs/README.md`, then the relevant `features/*.md`.
- `specs/api-contract.md`: the verified API behavior. Never assume API behavior that isn't there.
- `src/features/{users,posts}`, `src/shared/{api,lib,ui}`, `src/app`: see
  `specs/architecture.md`.
- `src/test/`: test setup, MSW server and handlers, real API fixtures.
- `.cursor/rules/`: coding rules. `.cursor/skills/`: step-by-step workflows.
- `docs/ai-usage-log.md`: append-only log of AI assistance.

## Workflow

1. **Spec**: find or update the requirement (stable ID such as `UL-03`) in `specs/features/`.
   A behavior change gets its own `docs(spec):` commit first.
2. **Test (red)**: write failing tests named after the ID. Run them and confirm they fail for
   the right reason. Commit `test(<scope>): ...`.
3. **Code (green)**: the minimum to pass. Commit `feat(<scope>): ...`.
4. **Refactor**: only if it is a real improvement, with tests green. Commit `refactor(<scope>): ...`.
5. **Trace**: update the spec's traceability table and `specs/tasks.md`. Log notable AI
   interactions in `docs/ai-usage-log.md`.

## Definition of done

- The requirement is traceable: spec ID, then a test named with the ID, then passing code.
- `npm run lint`, `npm run typecheck`, `npm run test:coverage` (100% thresholds) and
  `npm run build` pass. E2E passes for journey changes.
- Accessible: roles and labels, keyboard, focus, live regions (see the
  `accessibility-and-design` rule).
- Atomic Conventional Commit(s), staged deliberately, never `git add .`.
- No scope creep. Ideas go to the README "With more time" section.

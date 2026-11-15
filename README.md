# Users and Posts

A small React + TypeScript app on top of [JSONPlaceholder](https://jsonplaceholder.typicode.com):
browse users, search them by name, read their posts and create new ones.

> This README is completed in the final documentation phase. Sections marked _TBD_ are filled
> in once the corresponding work is done.

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

Data-layer libraries (TanStack Query, React Hook Form, Zod) are added with the features that need
them.

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

_TBD_

## Architecture and key decisions

_TBD_

## Testing strategy

_TBD_

## Spec-driven development workflow

_TBD_

## Git workflow

_TBD_

## How I used AI

_TBD_

## What I would do with more time

- Move to ESLint 10 once `eslint-plugin-jsx-a11y` declares support for it.
- Edit and delete posts (`PUT`/`PATCH`/`DELETE /posts/:id`) and post comments
  (`/posts/:id/comments`). These are intentionally out of scope; see `specs/api-contract.md`.

## Known limitations

_TBD_

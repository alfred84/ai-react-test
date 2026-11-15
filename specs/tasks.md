# Tasks

Atomic tasks in execution order. Each one maps to requirement IDs and to the commit(s) it
produces. A task is done when its commits exist and lint, typecheck and the relevant tests pass
(red commits excepted for tests).

Status values: `todo`, `doing`, `done`, `cut`.

## Phase 0 and 1 (done)

| Task | Description                                             | Commit(s)                                                                                       | Status |
| ---- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------ |
| T-00 | Tooling, hooks, CI                                      | `chore/tooling` branch, merged                                                                  | done   |
| T-01 | API contract and real fixtures                          | `test: add fixtures...`, `docs: add api contract...`                                            | done   |
| T-02 | Specs README, constitution, architecture, feature specs | `docs: ...`                                                                                     | done   |
| T-03 | Plan and tasks                                          | `docs: add implementation plan and tasks`                                                       | done   |
| T-04 | AGENTS.md, Cursor rules and skills, AI usage log        | `chore: add agents.md and cursor rules`, `chore: add cursor skills`, `docs: start ai usage log` | doing  |

## Step 1-2: async states (`feat/async-states`)

| Task | IDs       | Description                                      | Commits                                                                            | Status |
| ---- | --------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- | ------ |
| T-10 | AS-01..05 | `httpClient` and `ApiError`                      | `test(api): ...http client error mapping`, then `feat(api): add typed http client` | todo   |
| T-11 | AS-06     | `getErrorMessage`                                | `test(api): ...`, then `feat(api): map api errors to user messages`                | todo   |
| T-12 | AS-07     | `createQueryClient` with the retry policy        | `test(app): ...`, then `feat(app): add query client with retry policy`             | todo   |
| T-13 | -         | Design tokens (`@theme`, light and dark)         | `feat(ui): add design tokens and base styles`                                      | todo   |
| T-14 | AS-08..10 | `Skeleton`, `ErrorState`, `EmptyState`, `Button` | `test(ui): ...`, then `feat(ui): add async state primitives`                       | todo   |
| T-15 | AS-11     | `AppErrorBoundary` and the providers             | `test(app): ...`, then `feat(app): add error boundary and providers`               | todo   |

## Step 3-4: users list (`feat/users-list`)

| Task | IDs          | Description                                | Commits                                                                             | Status |
| ---- | ------------ | ------------------------------------------ | ----------------------------------------------------------------------------------- | ------ |
| T-20 | UL-03        | `normalizeText`                            | `test(shared): ...`, then `feat(shared): add accent-insensitive text normalization` | todo   |
| T-21 | UL-04        | `useDebouncedValue`                        | `test(shared): ...`, then `feat(shared): add debounced value hook`                  | todo   |
| T-22 | UL-05, UL-08 | `useSearchParam` (URL state)               | `test(shared): ...`, then `feat(shared): add url search param hook`                 | todo   |
| T-23 | UL-01, UL-09 | Users schema, API, `useUsers`, list render | `test(users): ...`, then `feat(users): load and render users`                       | todo   |
| T-24 | UL-02..07    | Search, empty results, live count          | `test(users): ...`, then `feat(users): add debounced name search`                   | todo   |
| T-25 | UL-08        | Selection                                  | `test(users): ...`, then `feat(users): select a user`                               | todo   |

## Step 5-6: user posts (`feat/user-posts`)

| Task | IDs                 | Description                                       | Commits                                                                 | Status |
| ---- | ------------------- | ------------------------------------------------- | ----------------------------------------------------------------------- | ------ |
| T-30 | UP-01..05           | Posts schema, API, `usePosts`, `PostsPanel`       | `test(posts): ...`, then `feat(posts): show posts of the selected user` | todo   |
| T-31 | UP-06, UP-07, UP-09 | App integration: cancellation, URL restore, cache | `test(app): ...`, then `feat(app): compose master-detail layout`        | todo   |
| T-32 | UP-08               | Responsive layout and back to users               | `test(app): ...`, then `feat(app): add mobile back navigation`          | todo   |

## Step 7-8: create post (`feat/create-post`)

| Task | IDs                   | Description                                    | Commits                                                                | Status |
| ---- | --------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- | ------ |
| T-40 | CP-02, CP-03          | `createPostFormSchema`                         | `test(posts): ...`, then `feat(posts): add create post form schema`    | todo   |
| T-41 | CP-08, CP-09          | `CreatedPostsProvider` and merge in `usePosts` | `test(posts): ...`, then `feat(posts): store created posts per user`   | todo   |
| T-42 | CP-01, 04..07, 10, 11 | `useCreatePost`, `CreatePostForm`              | `test(posts): ...`, then `feat(posts): add validated create post form` | todo   |

## Step 9: e2e (`test/e2e`)

| Task | IDs                 | Description                            | Commits                                    | Status |
| ---- | ------------------- | -------------------------------------- | ------------------------------------------ | ------ |
| T-50 | UL-02, UL-08, UP-08 | Search and select, mobile back         | `test(e2e): add search and select journey` | todo   |
| T-51 | CP-02, CP-07        | Validation blocks submit, post appears | `test(e2e): add create post journey`       | todo   |
| T-52 | AS-09               | Error state with retry                 | `test(e2e): add error and retry journey`   | todo   |
| T-53 | NFR                 | axe on main screens                    | `test(e2e): add axe accessibility checks`  | todo   |

## Step 10: hardening and docs (`docs/final`)

| Task | Description                                  | Commits                            | Status |
| ---- | -------------------------------------------- | ---------------------------------- | ------ |
| T-60 | Full pipeline, bundle size, quick a11y fixes | `fix: ...` / `perf: ...` as needed | todo   |
| T-61 | TSDoc on exported APIs                       | `docs: add tsdoc to exported apis` | todo   |
| T-62 | README                                       | `docs: complete readme`            | todo   |
| T-63 | AI usage log final pass, tag `v1.0.0`        | `docs: finalize ai usage log`      | todo   |

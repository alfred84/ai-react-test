# Async states

- **Status:** Approved
- **Shared by:** [users-list](users-list.md), [user-posts](user-posts.md),
  [create-post](create-post.md)

## Context

Every remote operation can be slow, fail or return unexpected data. This spec defines the shared
primitives (API client, error model, loading, error and empty UI, retry policy) so the features
only reference them.

## User stories

- As a user, I want to see that content is loading, so that I know the app is working.
- As a user, I want a clear message and a way to retry when something fails, so that I'm not
  stuck.
- As a developer, I want one typed error model, so that every failure is handled the same way.

## Functional requirements

| ID    | Requirement                                                                                                                                                                     |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AS-01 | The API client requests `API_BASE_URL + path` with `Accept: application/json`. With a body, it sends JSON with `Content-Type: application/json; charset=UTF-8`.                 |
| AS-02 | A rejected `fetch` (not an abort) becomes `ApiError` of kind `network`.                                                                                                         |
| AS-03 | A non-2xx response becomes `ApiError` of kind `http` with its `status`. The body is not parsed.                                                                                 |
| AS-04 | Invalid JSON, or a payload that fails Zod validation, becomes `ApiError` of kind `parse`.                                                                                       |
| AS-05 | An aborted request re-throws the original `AbortError` so queries treat it as a cancellation.                                                                                   |
| AS-06 | `getErrorMessage` maps each error kind, and unknown errors, to the user messages in [architecture](../architecture.md#error-taxonomy).                                          |
| AS-07 | Query retry policy: no retry for 4xx or `parse`. At most 2 retries for `network` and 5xx. Mutations do not retry.                                                               |
| AS-08 | Loading UI: skeleton placeholders shaped like the content, the region marked `aria-busy="true"`, and a visually hidden status text.                                             |
| AS-09 | Error UI: an `ErrorState` with a heading, the mapped message (`role="alert"`) and a "Try again" button that re-runs the failed operation.                                       |
| AS-10 | Empty UI: an `EmptyState` with an icon, a short title and guidance text.                                                                                                        |
| AS-11 | An app-level error boundary renders a fallback with a "Reload page" link (to the current URL) for unexpected render errors. A plain link works even when React state is broken. |

## Acceptance criteria

- **AS-01** Given a GET request to `/users`, when it is sent, then the URL is
  `https://jsonplaceholder.typicode.com/users` and the `Accept` header is `application/json`.
- **AS-01** Given a POST with a body, when it is sent, then the body is JSON and the `Content-Type`
  header is `application/json; charset=UTF-8`.
- **AS-02** Given the network fails, when a request is made, then it rejects with
  `ApiError { kind: 'network' }`.
- **AS-03** Given the server answers 500 with an HTML body, when a request is made, then it
  rejects with `ApiError { kind: 'http', status: 500 }`.
- **AS-04** Given the server answers 200 with `[{ "id": "x" }]` for users, when a request is made,
  then it rejects with `ApiError { kind: 'parse' }`.
- **AS-05** Given a request in flight, when its signal aborts, then the promise rejects with an
  error named `AbortError`, not an `ApiError`.
- **AS-07** Given a query whose request answers 404, when it fails, then it is attempted once only.
- **AS-07** Given a query whose request answers 503 every time, when it fails, then it is
  attempted 3 times in total before showing the error.
- **AS-08, AS-09** Given any feature query, when it is pending, then a skeleton is shown, and
  when it fails, then an alert with the mapped message and a "Try again" button is shown.
- **AS-09** Given an error state, when the user activates "Try again" and the request now
  succeeds, then the content replaces the error.
- **AS-11** Given a component throws during render, when the app renders, then the fallback with
  "Something went wrong" and a "Reload page" link to the current URL is shown instead of a blank
  page.

## Edge cases

- The error body is HTML (observed for malformed JSON on POST). It is never parsed.
- The payload has extra unknown fields. They are stripped, not rejected.
- An empty array is valid data, not an error.

## Non-functional requirements

- The error message is announced (`role="alert"`). Loading status is announced politely.
- Skeleton pulse animation is disabled under `prefers-reduced-motion: reduce`.
- "Try again" is a real `<button>`, reachable by keyboard, with visible focus.

## Out of scope

- Offline detection, global toasts, error reporting services, request deduplication beyond
  TanStack Query defaults.

## Traceability

| ID    | Test file                                          | Test name                                                                                                                                                                                                                             | Status |
| ----- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| AS-01 | `src/shared/api/httpClient.test.ts`                | `AS-01 requests base URL with JSON headers`, `AS-01 sends a JSON body with the JSON content type`                                                                                                                                     | Done   |
| AS-02 | `src/shared/api/httpClient.test.ts`                | `AS-02 maps network failures to network errors`                                                                                                                                                                                       | Done   |
| AS-03 | `src/shared/api/httpClient.test.ts`                | `AS-03 maps non-2xx responses to http errors without parsing the body`                                                                                                                                                                | Done   |
| AS-04 | `src/shared/api/httpClient.test.ts`                | `AS-04 maps a payload that fails validation to a parse error`, `AS-04 maps an invalid JSON body to a parse error`                                                                                                                     | Done   |
| AS-05 | `src/shared/api/httpClient.test.ts`                | `AS-05 rethrows aborts untouched`                                                                                                                                                                                                     | Done   |
| AS-06 | `src/shared/api/errorMessage.test.ts`              | `AS-06 maps each error kind to a user message (%#)`                                                                                                                                                                                   | Done   |
| AS-07 | `src/app/queryClient.test.ts`                      | `AS-07 does not retry 4xx responses`, `... invalid payloads`, `... retries 5xx responses at most twice`, `... network failures at most twice`, `... recovers when a retry succeeds`, `... does not retry unknown errors or mutations` | Done   |
| AS-08 | `src/features/users/__tests__/UsersPanel.test.tsx` | `AS-08 shows a skeleton while loading`                                                                                                                                                                                                | Done   |
| AS-09 | `src/shared/ui/ErrorState.test.tsx`                | `AS-09 shows the title, the mapped message and calls retry`                                                                                                                                                                           | Done   |
| AS-10 | `src/shared/ui/EmptyState.test.tsx`                | `AS-10 renders title, guidance and an optional action`, `AS-10 renders without an action`                                                                                                                                             | Done   |
| AS-11 | `src/app/AppErrorBoundary.test.tsx`                | `AS-11 renders a fallback for render errors`, `AS-11 renders children when nothing throws`                                                                                                                                            | Done   |
| AS-09 | `e2e/users.spec.ts`                                | `users error state recovers on retry`                                                                                                                                                                                                 | Done   |
| NFR   | `e2e/users.spec.ts`                                | `has no detectable accessibility violations`                                                                                                                                                                                          | Done   |

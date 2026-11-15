# User posts

- **Status:** Approved
- **Depends on:** [async-states](async-states.md), [users-list](users-list.md),
  [API-02](../api-contract.md#api-02-get-postsuseridid)

## Context

The detail side of the master-detail layout. When a user is selected, their posts are loaded and
shown, together with any posts created locally in this session
([create-post](create-post.md)).

## User stories

- As a user, I want to see the posts of the selected user, so that I can read what they wrote.
- As a user, I want switching users to be fast and never show the wrong user's posts, so that I
  can trust what I see.
- As a mobile user, I want a clear way back to the list, so that the detail view doesn't trap me.

## Functional requirements

| ID    | Requirement                                                                                                                                     |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| UP-01 | With no user selected, the posts panel shows an empty state: "Select a user to see their posts".                                                |
| UP-02 | With a user selected, the panel heading is "Posts by <name>" and the posts are fetched with `GET /posts?userId=<id>` (API-02).                  |
| UP-03 | Each post is an `<article>` with the title as a heading and the body with its line breaks preserved.                                            |
| UP-04 | If the user has no posts (`[]`), an empty state says "<name> hasn't posted yet" and points to the create form.                                  |
| UP-05 | Loading, error and retry follow AS-08 and AS-09, scoped to the posts panel. The users panel remains usable.                                     |
| UP-06 | Switching users while posts are loading cancels the previous request (the query `AbortSignal`). Only the newly selected user's posts render.    |
| UP-07 | On load, `?user=<id>` selects that user. A non-numeric value is ignored. An id not in the users list shows "User not found" with a back action. |
| UP-08 | Below the `md` breakpoint, the list and the detail are separate views. A "Back to users" button clears the selection.                           |
| UP-09 | Re-selecting a user whose posts are cached and fresh (staleTime) shows them immediately, without a loading state.                               |

## Acceptance criteria

- **UP-01** Given no `user` parameter, when the app loads, then the posts panel shows "Select a
  user to see their posts".
- **UP-02, UP-03** Given I select "Leanne Graham", when her posts load, then the heading "Posts by
  Leanne Graham" and 10 articles are shown. The first is titled "sunt aut facere repellat provident
  occaecati excepturi optio reprehenderit", and its body keeps its line breaks.
- **UP-04** Given the posts request returns `[]`, when the user is selected, then "Leanne Graham
  hasn't posted yet" is shown.
- **UP-05** Given the posts request fails with 500, when I select a user, then the posts panel
  shows the error state while the users list stays interactive, and "Try again" loads the posts.
- **UP-06** Given user 1's posts respond slowly, when I select user 1 and then user 2 before the
  response arrives, then the request for user 1 is aborted, user 2's posts are shown, and user 1's
  posts never appear.
- **UP-07** Given the URL `/?user=2`, when the app loads, then "Posts by Ervin Howell" is shown.
  Given `/?user=abc`, then nothing is selected. Given `/?user=999`, then "User not found" is shown.
- **UP-08** Given a 360 px viewport and a selected user, when I activate "Back to users", then the
  list is shown and `user` is removed from the URL.
- **UP-09** Given I viewed user 1, then user 2, when I select user 1 again, then the posts appear
  without a skeleton and no new request is made.

## Edge cases

- Selecting the already selected user does nothing.
- The users request fails but `?user=` is set: the posts panel waits for users (the name is needed
  for the heading) and the users panel shows the error.
- The same post content for different users: keys are namespaced ids, never content.

## Non-functional requirements

- The panel is a labeled region (`<section aria-labelledby>`). Post titles are `h3` under the
  panel's `h2`.
- When a user is selected on small screens, focus moves to the panel heading.
- The body uses `white-space: pre-line`. The text stays readable at 200% zoom.

## Out of scope

- Post detail pages, comments, editing or deleting posts, pagination.

## Traceability

| ID    | Test file                                          | Test name                                                                                                             | Status   |
| ----- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- |
| UP-01 | `src/features/posts/__tests__/PostsPanel.test.tsx` | `UP-01 asks to select a user`                                                                                         | Done     |
| UP-02 | `src/features/posts/__tests__/PostsPanel.test.tsx` | `UP-02 loads posts for the selected user`                                                                             | Done     |
| UP-03 | `src/features/posts/__tests__/PostsPanel.test.tsx` | `UP-03 renders posts as articles with line breaks`                                                                    | Done     |
| UP-04 | `src/features/posts/__tests__/PostsPanel.test.tsx` | `UP-04 shows an empty state when there are no posts`                                                                  | Done     |
| UP-05 | `src/features/posts/__tests__/PostsPanel.test.tsx` | `UP-05 shows an error and recovers on retry`                                                                          | Done     |
| UP-06 | `src/app/__tests__/App.test.tsx`                   | `UP-06 cancels stale requests when switching users`                                                                   | Done     |
| UP-07 | `src/app/__tests__/App.test.tsx`                   | `UP-07 restores the selection from the URL`, `... ignores a non-numeric user parameter`, `... shows "User not found"` | Done     |
| UP-08 | `src/app/__tests__/App.test.tsx`                   | `UP-08 "Back to users" clears the selection`                                                                          | Done     |
| UP-08 | `e2e/users.spec.ts`                                | `mobile back to users`                                                                                                | Done     |
| UP-08 | (none)                                             | Moving focus to the panel heading on small screens (non-functional requirement)                                       | Deferred |
| UP-09 | `src/app/__tests__/App.test.tsx`                   | `UP-09 reuses cached posts when reselecting`                                                                          | Done     |

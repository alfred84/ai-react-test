# Users list

- **Status:** Approved
- **Depends on:** [async-states](async-states.md), [API-01](../api-contract.md#api-01-get-users)

## Context

The entry point of the app. It loads the 10 users from the API, lets the user narrow them down by
name, and lets them pick one to see their posts.

## User stories

- As a user, I want to see all users, so that I can choose whose posts to read.
- As a user, I want to search users by name, ignoring case and accents, so that I find someone
  quickly even if I type imprecisely.
- As a user, I want the search in the URL, so that I can reload or share the filtered view.

## Functional requirements

| ID    | Requirement                                                                                                                                     |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| UL-01 | On load, users are fetched once (API-01). Each one shows an initials avatar, `name`, and `email` as secondary text.                             |
| UL-02 | A search field labeled "Search users by name" filters the list client-side by `name` substring, case-insensitively.                             |
| UL-03 | Matching is accent-insensitive: both sides are normalized (NFD, diacritics removed, lowercase, whitespace trimmed and collapsed).               |
| UL-04 | Filtering and the URL update are debounced by 250 ms. The input itself updates immediately.                                                     |
| UL-05 | The applied search is stored in `?q=`. On load the field and filter are initialized from it. An empty search removes the parameter.             |
| UL-06 | With no matches, an empty state says "No users match "<query>"" and offers a "Clear search" button that empties the field and the filter.       |
| UL-07 | The number of results is announced in a polite live region, for example "3 users".                                                              |
| UL-08 | Each user is a button. Activating it selects the user (`?user=<id>`). The selected one is marked with `aria-current="true"` and a visual state. |
| UL-09 | Loading, error and retry follow AS-08 and AS-09, scoped to the users panel.                                                                     |

## Acceptance criteria

- **UL-01** Given the API returns the 10 real users, when the app loads, then 10 user buttons are
  shown, including "Leanne Graham" with the initials "LG" and "Sincere@april.biz".
- **UL-02** Given the users are loaded, when I type "CLEMENT", then only "Clementine Bauch" and
  "Clementina DuBuque" remain.
- **UL-03** Given a user named "José Núñez", when I type "jose nunez", then that user is shown,
  and when I type "Núñez", then the same user is shown.
- **UL-04** Given I type "leanne" quickly, when less than 250 ms has passed, then the list is not
  yet filtered, and after 250 ms it is.
- **UL-05** Given the URL `/?q=ervin`, when the app loads, then the field contains "ervin" and only
  "Ervin Howell" is listed. When I clear the field, then `q` is removed from the URL.
- **UL-06** Given I search "zzz", when the debounce settles, then the empty state is shown, and
  when I activate "Clear search", then all 10 users are listed and the field is empty and focused.
- **UL-07** Given I search "clement", when the debounce settles, then the live region reads
  "2 users".
- **UL-08** Given the list, when I activate "Ervin Howell", then the URL contains `user=2` and that
  button has `aria-current="true"`.
- **UL-09** Given the users request fails with 500, when the app loads, then the users panel shows
  the error state, and "Try again" reloads the list.

## Edge cases

- A whitespace-only search behaves as an empty search.
- Search text with leading or trailing spaces matches as if trimmed. The URL stores the trimmed
  value.
- `q` present but the users still loading: the filter applies as soon as data arrives.
- The selected user is filtered out by the search: the selection and the posts panel remain.
- "Mrs." and suffixes like " V" are part of the name and are matched like any other text.

## Non-functional requirements

- The search is an `<input type="search">` with a visible label, inside a `role="search"`
  landmark.
- The list is a `<ul>` of buttons, fully keyboard operable with visible focus.
- Initials avatars are decorative (`aria-hidden`). The button's name is the user's name.
- Filtering 10 items needs no memoization. The debounce exists to limit URL churn.

## Out of scope

- Searching by username, email or any field other than `name`. Server-side search. Pagination.
- Sorting. Keyboard shortcuts. Highlighting the matched substring.

## Traceability

| ID           | Test file                                          | Test name                                             | Status  |
| ------------ | -------------------------------------------------- | ----------------------------------------------------- | ------- |
| UL-01        | `src/features/users/__tests__/UsersPanel.test.tsx` | `UL-01 renders users with avatar initials and email`  | Planned |
| UL-02        | `src/features/users/__tests__/UsersPanel.test.tsx` | `UL-02 filters by name ignoring case`                 | Planned |
| UL-03        | `src/shared/lib/normalizeText.test.ts`             | `UL-03 removes diacritics, case and extra whitespace` | Planned |
| UL-03        | `src/features/users/__tests__/UsersPanel.test.tsx` | `UL-03 matches names regardless of accents`           | Planned |
| UL-04        | `src/shared/lib/useDebouncedValue.test.ts`         | `UL-04 updates only after the delay`                  | Planned |
| UL-05        | `src/features/users/__tests__/UsersPanel.test.tsx` | `UL-05 syncs the search with the q parameter`         | Planned |
| UL-06        | `src/features/users/__tests__/UsersPanel.test.tsx` | `UL-06 shows an empty state with clear search`        | Planned |
| UL-07        | `src/features/users/__tests__/UsersPanel.test.tsx` | `UL-07 announces the result count`                    | Planned |
| UL-08        | `src/features/users/__tests__/UsersPanel.test.tsx` | `UL-08 selects a user and marks it current`           | Planned |
| UL-09        | `src/features/users/__tests__/UsersPanel.test.tsx` | `UL-09 shows an error and recovers on retry`          | Planned |
| UL-02, UL-08 | `e2e/users.spec.ts`                                | `search and select a user`                            | Planned |

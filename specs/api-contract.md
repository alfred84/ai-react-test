# API contract: JSONPlaceholder

- **Contract version:** 1.0.1 (see [Changelog](#changelog))
- **Status:** Approved
- **Base URL:** `https://jsonplaceholder.typicode.com` (**https only**; the client never builds
  `http://` URLs)
- **Verified:** 2026-11-15 with `curl` against the live API.

## Sources

1. **Official guide** ([jsonplaceholder.typicode.com/guide](https://jsonplaceholder.typicode.com/guide/)):
   input for the create, filter and nested-route behavior. It documents that
   `POST /posts` with `{ title, body, userId }` returns the same payload plus `id: 101`, that
   "the resource is not really created on the server", that `/posts?userId=1` filters by user,
   and that `/users/1/posts` is an available nested route.
2. **Live probes with `curl`**: the source of truth. Every endpoint in scope was requested,
   including **`GET /users`, whose shape the guide does not show**. Where the guide and the API
   agree, both are cited. Where the guide is silent (user shape, headers, CORS, unknown ids,
   error bodies), only observed behavior is documented.

If the API changes, re-run the probes in [Re-verification](#re-verification), update this file
first, and bump the contract version.

## Endpoints in scope

| ID     | Method | Path                | Purpose                       |
| ------ | ------ | ------------------- | ----------------------------- |
| API-01 | GET    | `/users`            | Load the users list           |
| API-02 | GET    | `/posts?userId=:id` | Load the posts of one user    |
| API-03 | POST   | `/posts`            | Create a post (not persisted) |

## Out of scope

The guide lists more routes. They are reference only and **must not be implemented**:

- `GET /posts/:id`, `GET /posts` (unfiltered), `PUT`/`PATCH`/`DELETE /posts/:id` (edit and delete
  posts)
- `/comments`, `/posts/:id/comments`, `/albums`, `/photos`, `/todos` and the other nested routes
- Any query parameter other than `userId`, such as pagination or sorting. Neither the guide nor
  our probes cover them, so the app does not rely on them.

Edit, delete and comments are listed under "What I would do with more time" in the README.

## API-01 `GET /users`

- `200 OK`, `Content-Type: application/json; charset=utf-8`
- **Exactly 10 users**, ids `1..10`, all with the same keys.
- `Cache-Control: max-age=43200` (12 h). Weak `ETag` present.

Response element (real, user 1):

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": { "lat": "-37.3159", "lng": "81.1496" }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}
```

Observed names: Leanne Graham, Ervin Howell, Clementine Bauch, Patricia Lebsack, Chelsey Dietrich,
Mrs. Dennis Schulist, Kurtis Weissnat, Nicholas Runolfsdottir V, Glenna Reichert, Clementina
DuBuque.

- **No real name contains diacritics.** Accent-insensitive search is still required, so tests use
  a derived fixture (for example a user renamed to "José Núñez") on top of the real data.
- "Clementine Bauch" and "Clementina DuBuque" share the prefix "Clement", which is a useful real
  case for multi-match search tests.
- Prefixes and suffixes such as "Mrs." and " V" are part of `name`.

## API-02 `GET /posts?userId=:id`

- `200 OK`, JSON, `Cache-Control: max-age=43200`.
- **10 posts per user** for every user 1..10, 100 posts in total, ids `1..100`.
- Shape: `{ userId: number, id: number, title: string, body: string }`. The post text field is
  **`body`**, not `content` or `text`. The guide's example for `GET /posts/1` matches the observed
  shape and values exactly.
- Observed lengths across all 100 posts: `title` 12-79 chars, `body` 102-225 chars.
- **Every `body` contains `\n` line breaks**, so the UI must preserve them, for example with
  `white-space: pre-line`.

Response element (real, post 1):

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
```

### Why `/posts?userId=:id` and not `/users/:id/posts`

Both were requested for user 1. They return **byte-identical bodies with the same ETag**, so
they are aliases. We use the query form for three reasons:

1. The guide presents query parameters as the filtering mechanism. The nested route is described
   as a convenience ("one level of nested route is available").
2. Reads and writes target the same collection, `/posts`. GET filters it and POST appends to it,
   which keeps the API module and the query keys symmetrical (`['posts', { userId }]`).
3. `userId` stays a typed parameter built with `URLSearchParams` instead of string
   interpolation inside a path.

### Unknown or invalid user id

| Request             | Status | Body |
| ------------------- | ------ | ---- |
| `/posts?userId=999` | 200    | `[]` |
| `/posts?userId=abc` | 200    | `[]` |
| `/users/999/posts`  | 200    | `[]` |
| `/users/abc/posts`  | 200    | `[]` |
| `/users/0/posts`    | 200    | `[]` |
| `/users/999`        | 404    | `{}` |
| `/posts/999`        | 404    | `{}` |
| `/nope`             | 404    | `{}` |

Consequences:

- An **empty list is a success state, not an error**. The UI must render an empty state for `[]`.
- Collection routes never return 404 for unknown ids. HTTP errors (4xx/5xx) can still happen in
  practice from rate limiting, outages or proxies. They are simulated in tests with MSW and
  Playwright, never assumed from the live API.

## API-03 `POST /posts`

Request (as in the guide):

```http
POST /posts
Content-Type: application/json; charset=UTF-8

{"title":"Probe title with spaces","body":"Probe body\nsecond line","userId":1}
```

Response, observed identically on two consecutive requests:

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: https://jsonplaceholder.typicode.com/posts/101
Cache-Control: no-cache
```

```json
{
  "title": "Probe title with spaces",
  "body": "Probe body\nsecond line",
  "userId": 1,
  "id": 101
}
```

Findings:

- **`id` is always `101`**: across repeated requests, and with `userId: 5`.
- **Nothing is persisted.** After the POSTs, `GET /posts/101` returns `404` and
  `GET /posts?userId=1` still returns the same 10 posts. The guide confirms this: "The resource is
  not really created on the server, but the response is faked as if."
- **No server-side validation.** `{"title":"","body":""}` is accepted with `201`. All validation
  is client-side, see [create-post](features/create-post.md).
- **The header matters.** Without `Content-Type: application/json` the server echoes the raw body
  as a single key (`{"{\"title\":...}": "", "id": 101}`). The client must always send the header.
- **Malformed JSON returns `500` with a `text/html` body** containing a stack trace. The client
  must not assume error bodies are JSON.

Consequence for the app: the server `id` (101) cannot be used as a list key or identity. Every
locally created post gets a **unique client-generated id** that cannot collide with server ids
(numbers 1-100) or with other created posts. Created posts are then **merged into the user's
list without collisions**. The id format and merge strategy are defined in
[architecture](architecture.md#created-posts).

## Headers and CORS

- With an `Origin` header, responses include `Access-Control-Allow-Origin: <origin>` and
  `Access-Control-Allow-Credentials: true`.
- A preflight (`OPTIONS /posts` with `Access-Control-Request-Method: POST` and
  `Access-Control-Request-Headers: content-type`) returns `204` with
  `Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE` and
  `Access-Control-Allow-Headers: content-type`.
- POST responses expose `Location` via `Access-Control-Expose-Headers`.
- `x-ratelimit-limit: 3600000`. Rate limits exist but are far above what this app needs.

No proxy, credentials or API key are needed. The browser calls the API directly.

## Client-side validation schemas (Zod)

Derived from the real responses above. Schemas validate only the fields the app uses, and Zod's
default object parsing strips unknown keys. This keeps the boundary strict where it matters and
tolerant of extra fields the API might add.

| Schema              | Fields validated                                                                      | Notes                                            |
| ------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `userSchema`        | `id` (positive int), `name` (non-empty string), `username` (string), `email` (string) | `address`, `phone`, `website`, `company` ignored |
| `usersSchema`       | `array(userSchema)`                                                                   |                                                  |
| `postSchema`        | `id` (positive int), `userId` (positive int), `title` (string), `body` (string)       |                                                  |
| `postsSchema`       | `array(postSchema)`                                                                   | `[]` is valid                                    |
| `createdPostSchema` | same as `postSchema`                                                                  | `id` is parsed but not used as identity          |

`email` is validated as a string, not as an email. Display data from the server is not the place
to enforce email syntax, and a stricter check would turn harmless upstream changes into errors.

## Test fixtures

Real responses are captured verbatim in `src/test/fixtures/`:

| File                        | Source                           |
| --------------------------- | -------------------------------- |
| `users.json`                | `GET /users`                     |
| `posts-user-1.json`         | `GET /posts?userId=1`            |
| `posts-user-2.json`         | `GET /posts?userId=2`            |
| `create-post-response.json` | `POST /posts` (body shown above) |

MSW handlers and Playwright `page.route` mocks serve these files. Edge-case data (accented
names, malformed payloads, error statuses) is derived in test code from these fixtures so the
deviation from real data is explicit at the call site.

## Re-verification

```bash
curl -s https://jsonplaceholder.typicode.com/users | jq 'length'                 # 10
curl -s "https://jsonplaceholder.typicode.com/posts?userId=1" | jq 'length'      # 10
curl -s "https://jsonplaceholder.typicode.com/posts?userId=999"                  # []
curl -s -i -X POST https://jsonplaceholder.typicode.com/posts \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{"title":"t","body":"b","userId":1}'                                       # 201, id 101
curl -s -o /dev/null -w '%{http_code}\n' https://jsonplaceholder.typicode.com/posts/101  # 404
```

## Changelog

The contract is versioned with the code. Any change to endpoints, shapes or schemas bumps the
version: major for breaking shape changes, minor for new fields or endpoints, patch for
clarifications.

| Version | Date       | Change                                                                                                                                                |
| ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-11-15 | Initial contract for API-01..03, verified with `curl`.                                                                                                |
| 1.0.1   | 2026-11-15 | Clarifications only: official guide cited as a source, https-only rule, explicit out-of-scope routes, `body` as the text field, client-id merge rule. |

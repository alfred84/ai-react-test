# Create post

- **Status:** Approved
- **Depends on:** [async-states](async-states.md), [user-posts](user-posts.md),
  [API-03](../api-contract.md#api-03-post-posts), [created posts](../architecture.md#created-posts)

## Context

The selected user's panel includes a form to publish a new post. The API validates nothing and
persists nothing, and it always answers `id: 101`. So validation is fully client-side, and the
new post is kept locally and merged into the list with a client-generated id.

## User stories

- As a user, I want to write a post with a title and a body, so that I can add content for the
  selected user.
- As a user, I want clear, accessible errors before submitting invalid data, so that I can fix
  them.
- As a user, I want to see my post in the list right away, and still see it if I switch users and
  come back.

## Functional requirements

| ID    | Requirement                                                                                                                                                  |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CP-01 | With a user selected, a "New post" form shows a "Title" text input, a "Body" textarea and a "Publish" submit button.                                         |
| CP-02 | Both fields are required after trimming. Whitespace-only is invalid: "Title is required" and "Body is required".                                             |
| CP-03 | Max lengths after trimming: title 100 ("Title must be 100 characters or fewer"), body 1000 ("Body must be 1000 characters or fewer").                        |
| CP-04 | Errors show on blur of a touched field and on submit. They clear as soon as the value is valid. On a failed submit, focus moves to the first invalid field.  |
| CP-05 | A valid submit sends `POST /posts` with the trimmed `{ title, body, userId }` and the JSON content type (API-03).                                            |
| CP-06 | While pending, "Publish" is disabled, reads "Publishing…", and the form has `aria-busy="true"`.                                                              |
| CP-07 | On success, the post appears first in the list with a "New" badge, the form resets, and a polite status says "Post published".                               |
| CP-08 | Created posts get unique client ids (`local-<uuid>`). They never collide with server posts or with each other, even though the API always returns `id: 101`. |
| CP-09 | Created posts are stored per user for the session. They remain after switching to another user and back, and after a posts refetch.                          |
| CP-10 | On failure, an alert says "We couldn't publish your post. Please try again.", the entered values are kept, and submitting again retries.                     |
| CP-11 | The create mutation never retries automatically (AS-07).                                                                                                     |

## Validation schema

```ts
createPostFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or fewer'),
  body: z
    .string()
    .trim()
    .min(1, 'Body is required')
    .max(1000, 'Body must be 1000 characters or fewer'),
})
```

The limits are well above the observed data (titles up to 79 characters, bodies up to 225) and
small enough to keep cards readable.

## Acceptance criteria

- **CP-01** Given a selected user, when the panel renders, then the "Title" and "Body" fields and
  the "Publish" button are shown.
- **CP-02, CP-04** Given an empty form, when I activate "Publish", then both errors are shown,
  each field has `aria-invalid="true"` and is described by its error, focus is on "Title", and no
  request is sent.
- **CP-02** Given "Title" contains only spaces, when I leave the field, then "Title is required"
  is shown.
- **CP-03** Given a 101-character title, when I submit, then the max-length error is shown.
- **CP-04** Given the title error is shown, when I type a valid title, then the error disappears.
- **CP-05, CP-06, CP-07** Given valid values " Hello " and "World", when I submit, then the
  request body is `{"title":"Hello","body":"World","userId":1}`, the button shows "Publishing…"
  while pending, and afterwards "Hello" is the first article, marked "New", the fields are empty,
  and "Post published" is announced.
- **CP-08** Given I publish two posts for the same user (both answered with `id: 101`), when the
  list renders, then both are shown as distinct articles, with no React key warnings.
- **CP-09** Given I published a post for Leanne Graham, when I select Ervin Howell and then Leanne
  Graham again, then my post is still first in her list and absent from Ervin's.
- **CP-10** Given the create request fails with 500, when I submit, then the alert is shown and my
  values remain. When I submit again and it succeeds, then the post appears.
- **CP-11** Given the create request fails, when it fails, then exactly one request was sent.

## Edge cases

- Switching users while a create is pending: the post belongs to the user it was submitted for
  ([architecture](../architecture.md#created-posts)), and the form of the newly selected user
  starts empty.
- Double-clicking "Publish" sends only one request, because the button is disabled while pending.
- A body with line breaks keeps them when displayed.
- Created posts are lost on full reload (a known limitation, matching the API).

## Non-functional requirements

- Visible `<label>` for each field. Errors are linked through `aria-describedby`, and the inputs
  carry `aria-invalid`.
- The success status uses a polite live region. The failure uses `role="alert"`.
- The form is keyboard operable, and Enter in the title submits.

## Out of scope

- Editing or deleting posts, drafts, rich text, optimistic insertion before the server answers,
  persistence across reloads, character counters.

## Traceability

| ID           | Test file                                                 | Test name                                            | Status  |
| ------------ | --------------------------------------------------------- | ---------------------------------------------------- | ------- |
| CP-01        | `src/features/posts/__tests__/CreatePostForm.test.tsx`    | `CP-01 renders title, body and publish`              | Planned |
| CP-02        | `src/features/posts/schemas/createPostFormSchema.test.ts` | `CP-02 rejects empty and whitespace-only values`     | Planned |
| CP-03        | `src/features/posts/schemas/createPostFormSchema.test.ts` | `CP-03 enforces max lengths after trimming`          | Planned |
| CP-04        | `src/features/posts/__tests__/CreatePostForm.test.tsx`    | `CP-04 shows accessible errors on blur and submit`   | Planned |
| CP-05        | `src/features/posts/__tests__/CreatePostForm.test.tsx`    | `CP-05 sends trimmed values with the user id`        | Planned |
| CP-06        | `src/features/posts/__tests__/CreatePostForm.test.tsx`    | `CP-06 disables publish while pending`               | Planned |
| CP-07        | `src/features/posts/__tests__/PostsPanel.test.tsx`        | `CP-07 shows the new post first with a badge`        | Planned |
| CP-08        | `src/features/posts/__tests__/PostsPanel.test.tsx`        | `CP-08 keeps posts with the same server id distinct` | Planned |
| CP-09        | `src/app/__tests__/App.test.tsx`                          | `CP-09 keeps created posts per user across switches` | Planned |
| CP-10        | `src/features/posts/__tests__/CreatePostForm.test.tsx`    | `CP-10 shows an alert and keeps values on failure`   | Planned |
| CP-11        | `src/features/posts/__tests__/CreatePostForm.test.tsx`    | `CP-11 does not retry a failed create`               | Planned |
| CP-02, CP-07 | `e2e/create-post.spec.ts`                                 | `validation blocks submit; valid post appears`       | Planned |

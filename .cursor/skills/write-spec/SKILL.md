---
name: write-spec
description: >-
  Author or update a feature spec in specs/features with stable requirement IDs, Given/When/Then
  acceptance criteria and a traceability table. Use when adding a requirement, changing behavior,
  fixing a spec that contradicts reality, or when the user mentions specs, requirements or
  acceptance criteria.
---

# Write or update a spec

## Before writing

1. Read `specs/README.md` (template, ID rules, lifecycle) and `specs/constitution.md` (scope).
2. Check scope. If the behavior is not one of the five assessment requirements, do not spec it.
   Add it to the README "What I would do with more time" section instead.
3. If the behavior depends on the API, confirm it in `specs/api-contract.md`. If it isn't there,
   verify with a real `curl` request and update the contract first (bump its version and add a
   changelog row).

## Writing

1. Pick the right file: `async-states` (shared loading, error and empty behavior), `users-list`,
   `user-posts` or `create-post`. Do not duplicate shared behavior; reference its ID.
2. Add requirements to the **Functional requirements** table:
   - Next free ID with the file's prefix (`UL-10`). Never renumber or reuse IDs.
   - One observable behavior per ID, written as what the user or system sees.
3. Add at least one **acceptance criterion** per ID, tagged with the ID:

   ```markdown
   - **UL-10** Given <state>, when <action>, then <observable outcome>.
   ```

   Use real data from `src/test/fixtures/` (for example "Leanne Graham") so tests can copy it.

4. Add **edge cases**, **non-functional** (a11y, performance) and **out-of-scope** bullets when
   they change.
5. Add a **Traceability** row per ID:

   ```markdown
   | UL-10 | `src/features/users/__tests__/UsersPanel.test.tsx` | `UL-10 <behavior>` | Planned |
   ```

6. Set the spec **Status**: a changed requirement in an implemented spec goes back to `Approved`.
7. Add or update the matching task in `specs/tasks.md`.

## Changing or removing

- Change the text in place and keep the ID.
- Removing: strike it through (`~~UL-04~~`) and add the reason. Never delete the row.

## Commit

Spec changes get their own commit, before any test or code:

```text
docs(spec): add UL-10 for <behavior>
```

## Checklist

- [ ] In scope per the constitution
- [ ] API facts backed by `api-contract.md`
- [ ] Every new ID has a Given/When/Then and a traceability row
- [ ] No contradictions with other specs or `architecture.md`
- [ ] Spec status and `tasks.md` updated

---
name: tdd-cycle
description: >-
  Run one red/green/refactor cycle for a spec requirement in this repo, with the exact commands
  and commit types. Use when implementing a requirement ID (AS-, UL-, UP-, CP-), writing a
  failing test first, or when the user mentions TDD, red/green or implementing a feature.
---

# TDD cycle

One cycle covers one acceptance criterion (or a tight group with the same ID).

## 0. Prepare

1. Re-read the requirement and its Given/When/Then in `specs/features/<feature>.md`.
2. Check the traceability row for the planned test file and name.
3. Make sure you're on the feature branch (`git branch --show-current`, for example
   `feat/users-list`).

## 1. Red

1. Write the test in the planned file. Name it with the ID:

   ```ts
   it('UL-02 filters by name ignoring case', async () => {
     // Arrange: render with providers, MSW serves src/test/fixtures/users.json
     // Act: userEvent interactions
     // Assert: role/label queries, findBy* for async
   })
   ```

   - Network: default MSW handlers, or `server.use(http.get(...))` for the case under test.
   - Debounce: `vi.useFakeTimers()` plus `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`.

2. If the module doesn't exist yet, add a **minimal stub** (correct signature, wrong behavior, for
   example `return []`) so lint and typecheck pass.
3. Run only that file and confirm it fails **on the assertion**, not on setup:

   ```bash
   npx vitest run src/features/users/__tests__/UsersPanel.test.tsx
   ```

4. Commit (the hooks run lint-staged and typecheck, not tests):

   ```text
   test(users): add failing tests for name search
   ```

## 2. Green

1. Write the minimum code to pass. No extra props, options or abstractions.
2. Run:

   ```bash
   npx vitest run <file>
   npm run lint
   npm run typecheck
   npm run test:coverage
   ```

   Coverage must stay at 100%. If a branch is uncovered, either a spec criterion is missing a test
   or the code is speculative. Fix the cause, not the number.

3. Commit:

   ```text
   feat(users): add debounced name search
   ```

## 3. Refactor (only if worth it)

1. Improve names, extract a hook or component, remove duplication. Behavior stays identical.
2. Run the same commands as in Green. Everything stays green.
3. Commit `refactor(users): extract useUserSearch hook`. Skip this commit if nothing meaningful
   changed.

## 4. Trace

1. Update the traceability row status to `Done` (and fix the file or name if it moved).
2. Update `specs/tasks.md`.
3. Append to `docs/ai-usage-log.md` if AI output was accepted, corrected or rejected in a notable
   way.
4. Commit `docs(spec): update traceability for UL-02`, or include it with the next spec change.

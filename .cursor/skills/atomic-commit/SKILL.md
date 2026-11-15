---
name: atomic-commit
description: >-
  Stage hunks deliberately, validate, and write a Conventional Commit for this repo. Use when
  committing, splitting changes into commits, writing commit messages, or merging a feature
  branch.
---

# Atomic commit

## 1. Decide the unit

- One logical change: one behavior, one config concern, or one doc.
- Mixed work in the tree gets split: refactor vs behavior, formatting vs logic, spec vs code.

## 2. Stage deliberately

```bash
git status --short
git add <path> [<path>...]   # whole files that belong to this unit
git add -p <path>            # only some hunks of a file
git diff --staged            # review every staged line
```

Never `git add .` or `git add -A`. Untracked files you didn't create on purpose stay untracked.

## 3. Validate

```bash
npm run lint
npm run typecheck
npx vitest run <changed test files>   # skip only for red-phase test commits
```

The pre-commit hook re-runs lint-staged and typecheck, and blocks the commit if they fail.

## 4. Write the message

```text
type(scope): imperative subject, lowercase, no period, <= 72 chars

Why the change is needed and any trade-off or rejected alternative,
wrapped at ~72 columns. Omit the body when the subject says it all.
```

- Types: `feat`, `fix`, `test`, `refactor`, `docs`, `style`, `chore`, `build`, `ci`, `perf`.
- Scopes: `api`, `app`, `ui`, `shared`, `users`, `posts`, `e2e`, `spec`.
- TDD pairs: `test(users): add failing tests for name search`, then
  `feat(users): add debounced name search`.

On Windows PowerShell, write the message to a file and use `-F`. Here-strings piped to
`git commit -F -` and multi-line `-m` arguments are unreliable:

```powershell
git commit -F $env:TEMP\commitmsg.txt
```

Verify the file exists and is non-empty first. A missing file once produced a commit with only a
trailer as its message.

## 5. Verify

```bash
git log --format='%h %s' -3
git show --stat HEAD
```

## Merging a branch

```bash
git checkout main
git merge --no-ff <branch> -F <message-file>   # "chore: merge branch '<branch>'" plus a summary
```

Never squash, rebase published commits, amend pushed commits or force-push.

---
name: git-commit
description: "Inspect intended repository changes, stage only explicitly selected safe files, validate a Conventional Commit message, and create a local commit. Use only when the user explicitly asks to commit or stage changes; do not use for pushing, opening pull requests, merging, or rewriting history."
license: Apache-2.0
compatibility: Requires Git and a configured local author identity. Optional pnpm and commitlint enable repository message validation.
metadata:
  author: tao-xiaoxin
  repository: coding-skills
  version: "0.1.0"
---

# Create a Safe Git Commit

Create one focused, local commit. A successful commit does **not** imply a push,
pull request, tag, merge, or any other remote publication.

## Non-Negotiable Safety Rules

- Run this Skill only after an explicit user request to stage or commit changes.
- Never default to `git add .`, `git add -A`, `git commit -a`, `--amend`,
  `--no-verify`, or any history-rewrite option.
- Stage exact reviewed paths only. Preserve an existing staged set unless the
  user explicitly requests a change to it.
- Do not stage credentials, private keys, tokens, `.env` files, package-registry
  auth files, or other paths listed in
  [`references/sensitive-files.md`](references/sensitive-files.md).
- Do not change branches, remotes, Git configuration, hooks, or user identity.
- Do not push after committing. Use `git-push` only after a separate request.

## Workflow

### 1. Establish Repository State

Run from the repository root:

```bash
git rev-parse --show-toplevel
git status --short --branch
git diff --check
git diff --stat
git diff --cached --check
git diff --cached --stat
```

Stop if the worktree is not a Git repository, contains unresolved conflicts, or
has no staged or user-selected changes. Read both staged and unstaged diffs for
the files that may enter this commit.

### 2. Define One Commit Scope

Create one logical change per commit. Include only paths that implement the
same user-requested outcome. Do not absorb unrelated pre-existing changes,
experiments, generated output, or local configuration.

Before staging, compare candidate paths with the sensitive-file reference. For
a suspicious path, stop and report the path category without printing content.

If files are not already staged, add exact paths only:

```bash
git add -- path/to/file-a path/to/file-b
```

Re-inspect the staged set after every staging change:

```bash
git diff --cached --check
git diff --cached --stat
git diff --cached -- path/to/file-a path/to/file-b
```

### 3. Prepare the Commit Message

Follow [`references/conventional-commits.md`](references/conventional-commits.md).

```text
<type>(<scope>): <subject>

<body>

<footer>
```

- `type` is required and must be one of the repository's approved types.
- `scope` is optional and should identify the affected area.
- Keep the subject imperative, concise, free of terminal punctuation, and at
  most 72 characters.
- Use a body only to explain meaningful motivation or behavior.
- Use a footer for issue references or a real breaking change.

### 4. Commit and Verify

Create the commit from the reviewed staged set:

```bash
git commit -m "type(scope): concise subject"
```

For a multi-paragraph message, use separate message arguments rather than
embedding shell-sensitive newlines. The repository `commit-msg` hook validates
the message when dependencies are installed.

Then verify the outcome:

```bash
git log -1 --oneline
git status --short
```

## Recovery

- If staging reveals unrelated changes, unstage only the affected path and
  re-check the staged diff. Do not clear the whole index.
- If commit-message validation fails, revise the message; do not bypass hooks.
- If Git reports a missing author identity, tell the user how to configure it
  outside this Skill rather than altering global or local config automatically.
- If the commit succeeds but is wrong, require a separate explicit repair task.
  Do not amend or reset automatically.

## Result Format

Report:

1. Commit hash and subject.
2. Files included in the commit.
3. Validation commands and outcomes.
4. Unstaged or untracked work that remains.
5. That no remote push or pull request was created.

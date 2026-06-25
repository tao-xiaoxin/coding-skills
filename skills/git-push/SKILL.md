---
name: git-push
description: "Safely push the intended current Git branch to an approved remote without force pushing, deleting refs, or publishing unrelated branches. Use only when the user explicitly asks to push or publish commits; do not use for committing, opening pull requests, merging, or remote history rewriting."
license: Apache-2.0
compatibility: Requires Git, a configured remote, network access, and credentials accepted by the remote.
metadata:
  author: tao-xiaoxin
  repository: coding-skills
  version: "0.1.0"
---

# Push a Git Branch Safely

Push exactly one intended branch only after an explicit user request. This Skill
does not create a commit, amend history, open a pull request, tag a release, or
merge anything.

## Non-Negotiable Safety Rules

- Do not invoke this Skill merely because a commit was created; pushing needs a
  separate explicit request.
- Never use `--force`, `--force-with-lease`, `--mirror`, `--all`, `--tags`,
  remote deletion syntax, or hook-bypass options.
- Do not push from detached `HEAD`.
- Do not push `main`, `master`, or `release/*` unless the user explicitly names
  the exact remote and branch and confirms the protected target.
- Do not run pull, fetch, rebase, reset, merge, or conflict resolution to make
  a push succeed. Report failures without changing local history.

## Workflow

### 1. Inspect the Candidate Target

Run these checks from the repository root:

```bash
git rev-parse --show-toplevel
git status --short --branch
git branch --show-current
git remote -v
git log -1 --oneline
```

Determine the current branch, configured upstream, remote names, and whether
the branch has local commits to publish. A dirty worktree does not necessarily
block a push, but report it because uncommitted work remains local.

### 2. Resolve Remote and Branch Deliberately

Use an explicitly named remote and branch when the user provides them.
Otherwise, use the current branch's configured upstream only when it is
unambiguous. If no upstream exists, use `origin` and the current branch only
after confirming that the user asked to publish that current branch.

Stop instead of guessing when any of these are true:

- the current branch is empty or detached;
- multiple plausible remotes or targets exist;
- no upstream exists and the user did not identify a target;
- the target is protected but has not been explicitly confirmed;
- the branch is not ahead of its upstream.

### 3. Push One Branch

For an existing approved upstream:

```bash
git push --porcelain
```

For a new approved non-protected branch on `origin`:

```bash
git push --porcelain -u origin "$(git branch --show-current)"
```

Use equivalent argument-safe syntax only for the single remote and branch the
user explicitly selected.

### 4. Verify and Report

After a successful push:

```bash
git status --short --branch
git log -1 --oneline
```

If the remote rejects the push, preserve local state and follow
[`references/push-safety.md`](references/push-safety.md). Do not retry with a
force option.

## Recovery

- For a non-fast-forward rejection, report the remote response and propose a
  separate synchronization task; do not rebase automatically.
- For insufficient permissions or protected-branch rejection, report the target
  and host response; do not change remotes or credentials.
- For an accidental local commit discovered before push, stop and request a
  separate explicit correction task.

## Result Format

Report:

1. Remote and branch pushed.
2. Latest commit or range published.
3. Whether an upstream was newly configured.
4. Uncommitted work that remains local.
5. Any safe failure reason, without exposing credentials or tokens.

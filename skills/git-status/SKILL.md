---
name: git-status
description: "Inspect a Git repository and summarize branch, staged, unstaged, and untracked changes. Use when the user asks for Git status, change review, or a concise diff overview; do not use it to modify files, stage changes, commit, push, or create pull requests."
license: Apache-2.0
compatibility: Requires Git and a local repository. Read-only; works with Codex and Claude Code.
metadata:
  author: tao-xiaoxin
  repository: coding-skills
  version: "0.1.0"
---

# Inspect Git Repository State

Provide a factual, read-only summary of the current Git worktree. This Skill is
safe to use whenever a user asks what changed, which branch is active, or what
would be committed.

## Safety Rules

- Do not modify the worktree, index, branch, remote, Git configuration, or
  history.
- Do not stage, commit, push, pull, fetch, rebase, reset, clean, tag, or open a
  pull request.
- Do not print secret values. Redact credential-bearing remote URLs if one is
  discovered.
- Prefer summary output first; inspect full diffs only for user-selected files
  or when the user specifically asks for detail.

## Workflow

### 1. Confirm Repository Context

Run these read-only checks from the requested directory:

```bash
git rev-parse --show-toplevel
git branch --show-current
git status --short --branch
```

If the directory is not inside a Git worktree, report that condition and stop.
If `HEAD` is detached, state it prominently because write workflows should not
guess a branch target.

### 2. Summarize Change Sets

Inspect staged and unstaged work separately:

```bash
git diff --stat
git diff --cached --stat
git ls-files --others --exclude-standard
```

Use `git diff --name-status` and `git diff --cached --name-status` to describe
file-level additions, modifications, renames, and deletions. Read a full diff
only for a path explicitly requested by the user or needed to explain an
observed risk.

### 3. Identify Action-Relevant Risks

Call out:

- untracked files that would not enter a commit automatically;
- staged files that differ from unstaged work in the same path;
- merge conflicts or unmerged entries;
- a detached `HEAD`;
- paths that match the sensitive-file policy in
  [`references/status-inspection.md`](references/status-inspection.md).

## Recovery

- For an unrecognized directory, ask for the repository path instead of
  creating or initializing anything.
- For a large diff, return the summary and request a specific path before
  expanding output.
- For a sensitive-looking path, report only its path and risk category; do not
  display its contents.

## Result Format

Report, in order:

1. Repository root and current branch or detached state.
2. Ahead/behind tracking state when available.
3. Counts and paths for staged, unstaged, and untracked changes.
4. Conflicts, sensitive-file warnings, or other blockers.
5. The next safe action, without performing it.

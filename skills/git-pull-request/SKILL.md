---
name: git-pull-request
description: "Create a focused GitHub pull request for an already-pushed branch with GitHub CLI. Use only when the user explicitly asks to open or prepare a pull request; do not use it to push, merge, assign reviewers, change labels, or alter repository settings."
license: Apache-2.0
compatibility: Requires Git, GitHub CLI, authenticated GitHub access, network access, and a branch already pushed to GitHub.
metadata:
  author: tao-xiaoxin
  repository: coding-skills
  version: "0.1.0"
---

# Create a GitHub Pull Request

Create one pull request for the current branch only after an explicit user
request. This Skill does not push the branch, create a fork, assign reviewers,
add labels, merge, or change repository settings.

## Non-Negotiable Safety Rules

- Confirm that the current branch is already pushed before calling `gh pr
  create`. Do not allow GitHub CLI to implicitly push it.
- Do not create a pull request from `main`, `master`, detached `HEAD`, or an
  unknown branch.
- Do not use `--web`, `--fill`, auto-merge, reviewer assignment, labels,
  milestones, or project changes unless directly requested.
- Use the repository default branch as the base only when the user did not name
  another base branch.
- Create a draft only when the user explicitly asks for a draft.

## Workflow

### 1. Verify Context and Publication State

Run:

```bash
git rev-parse --show-toplevel
git status --short --branch
git branch --show-current
gh auth status
gh repo view --json nameWithOwner,defaultBranchRef
gh pr status
```

Confirm that the current branch has an upstream and is already present on the
intended GitHub repository. If it has not been published, stop and tell the
user that `git-push` must be explicitly requested first.

### 2. Describe the Change from Evidence

Compare the current branch against the intended base. Summarize resulting
behavior, not a copied list of commit subjects. Include only validations that
actually ran. When no validation ran, write `Not run (not requested)`.

Use [`references/pr-template.md`](references/pr-template.md) as the body
shape. If an open pull request already exists for the branch, report it rather
than creating a duplicate.

### 3. Create the Pull Request Explicitly

Use explicit base, head, title, and body arguments:

```bash
gh pr create \
  --base "<base-branch>" \
  --head "<current-branch>" \
  --title "<title>" \
  --body "<body>"
```

Add `--draft` only after an explicit user request. Do not rely on interactive
prompts to choose a repository, fork, push location, or title.

### 4. Verify and Report

Read the new pull request back:

```bash
gh pr view --json number,url,title,state,baseRefName,headRefName,isDraft
```

## Recovery

- If GitHub CLI asks to push or fork, cancel and return to the separate
  `git-push` workflow.
- If authentication or permissions fail, report the host response; do not alter
  login state or create a token.
- If a pull request already exists, return its URL and state rather than opening
  another one.
- If branch comparison is unavailable, ask the user for the intended base
  branch; do not assume a protected target.

## Result Format

Report:

1. Pull request number, URL, title, and draft state.
2. Base and head branches.
3. Concise summary of included behavior changes.
4. Tests that ran, or `Not run (not requested)`.
5. That no push, merge, reviewer, label, or repository setting change was made
   unless explicitly requested.

# Coding Skills Repository Guide

## Purpose

This repository contains portable Agent Skills. Each Skill is a focused,
auditable workflow, not a general persona prompt or an automatic authorization
for shell commands, Git writes, network access, or credentials.

## Layout

- Put each installable Skill at `skills/<skill-name>/SKILL.md`.
- The directory name and frontmatter `name` must match exactly.
- Put detailed standards, long examples, and recovery procedures under the
  Skill's `references/` directory.
- Keep cross-host instructions in `SKILL.md`; host-specific behavior belongs in
  `docs/` unless it is standardized and required by every supported host.

## Skill Authoring Rules

1. Use valid frontmatter with an accurate `name`, `description`, license, and
   compatibility statement.
2. State when the Skill applies and when it must not run.
3. Describe the evidence to inspect, exact workflow order, safety boundaries,
   validation, output, and recovery behavior.
4. Keep write operations explicit. A Skill must not combine commit, push,
   pull-request creation, merge, deletion, or history rewriting unless the user
   requested that exact operation.
5. Do not use broad staging or destructive Git commands as a default.
6. Do not claim that frontmatter alone enforces security. Host approvals,
   sandboxing, branch rules, hooks, and structured MCP tools remain the
   enforcement layer.

## Git Workflow Rules

- Inspect status and the relevant diff before every write operation.
- Stage exact paths only. Do not default to `git add .`, `git add -A`, or
  `git commit -a`.
- Treat `.env`, private keys, credentials, tokens, and package-registry auth
  files as blocked from normal staging.
- The commit Skill never pushes. The push Skill never creates a commit. The PR
  Skill never implicitly pushes, merges, assigns reviewers, or changes labels.
- Reject `--force`, `--force-with-lease`, `--mirror`, remote deletions,
  `reset --hard`, and `clean -fd` from normal workflows.
- Treat `main`, `master`, and `release/*` as protected by default.

## Commit Convention

Use Conventional Commits with these types:

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore`, and `revert`.

Run the following before requesting review:

```bash
pnpm validate:skills
pnpm test
pnpm lint:commit
git diff --check
gh skill publish --dry-run
```

## Completion Criteria

- The Skill passes `scripts/validate-skills.mjs`.
- Supporting references exist for non-trivial policy or templates.
- The relevant tests pass.
- Documentation does not overstate what an agent host can enforce.
- No secrets, generated install metadata, or machine-local files are included.

# Coding Skills

[简体中文](README.md)

Reusable, safety-first coding skills for Git workflows, testing, code review,
releases, and deployment.

`coding-skills` is a source repository of portable Agent Skills. The first
release provides deliberately separated Git workflows: inspect changes, make a
local commit, push a branch, and open a pull request. A request to commit never
silently publishes code.

## Included Skills

| Skill | Purpose | Side effect |
| --- | --- | --- |
| [`git-status`](skills/git-status/SKILL.md) | Inspect repository state and summarize staged and unstaged changes. | None |
| [`git-commit`](skills/git-commit/SKILL.md) | Stage explicitly selected files and create a Conventional Commit. | Local commit |
| [`git-push`](skills/git-push/SKILL.md) | Push only the intended current branch to its remote. | Remote branch update |
| [`git-pull-request`](skills/git-pull-request/SKILL.md) | Create a GitHub pull request for an already-pushed branch. | GitHub pull request |

## Safety Contract

- Commit, push, and pull-request creation are independent Skills and require
  matching user intent.
- The write Skills do not default to `git add .`, `git add -A`, `git commit -a`,
  force pushes, remote ref deletion, automatic merges, or history rewriting.
- `main`, `master`, and `release/*` are treated as protected targets unless the
  user explicitly names and confirms the destination.
- Files that resemble credentials or private keys must not be staged by the
  normal commit workflow.
- Skill text is guidance, not a permission system. Enforce sensitive operations
  with host approvals, hooks, branch protection, and structured tools where
  available. See [the security model](docs/security-model.md).

## Install with GitHub CLI

Use a GitHub CLI build that includes the `gh skill` command. Always preview
third-party Skills before installation.

```bash
# Preview one Skill without installing it
gh skill preview tao-xiaoxin/coding-skills git-commit

# Install one Skill for Codex in the current project
gh skill install tao-xiaoxin/coding-skills git-commit \
  --agent codex --scope project

# Install one Skill for Claude Code in the current project
gh skill install tao-xiaoxin/coding-skills git-commit \
  --agent claude-code --scope project

# Install every Skill for a user-wide Codex setup
gh skill install tao-xiaoxin/coding-skills --all \
  --agent codex --scope user

# Inspect installed Skills and check for updates
gh skill list
gh skill update
```

Read [host compatibility](docs/host-compatibility.md) for local development,
manual installation fallbacks, and the Codex/Claude Code behavior model.

## Develop

Requirements: Node.js 22+ and pnpm 11+.

```bash
pnpm install

# Create a guided Conventional Commit
pnpm commit

# Validate the latest commit message
pnpm lint:commit

# Validate Skill structure and repository tests
pnpm validate:skills
pnpm test

# Validate the package with GitHub CLI before publishing
gh skill publish --dry-run
```

The `prepare` script configures the local `commit-msg` hook. Existing clones
can refresh it with `pnpm prepare` after installing dependencies.

## Repository Layout

```text
skills/<skill-name>/SKILL.md      Portable, installable Skill entry point
skills/<skill-name>/references/   Detailed procedures and templates
docs/                             Host compatibility and security notes
scripts/                          Repository validation helpers
.github/workflows/               CI and manual release workflows
```

## Release

Validate before publishing:

```bash
gh skill publish --dry-run
gh skill publish --tag v0.1.0
```

The release workflow is manually dispatched after review. It validates the
Skill package before creating the requested release tag.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the commit convention, validation
commands, and Skill authoring rules. [AGENTS.md](AGENTS.md) is the repository
instruction file for coding agents.

## License

[Apache License 2.0](LICENSE)

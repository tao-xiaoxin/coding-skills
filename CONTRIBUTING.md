# Contributing

## Skill Changes

1. Keep each Skill focused on one workflow.
2. Put the entry point at `skills/<skill-name>/SKILL.md`.
3. Keep the directory name and frontmatter `name` identical.
4. Put detailed policy and examples under `references/`.
5. Document preconditions, safety boundaries, validation, and recovery for every write-capable Skill.

## Commit Convention

Use Conventional Commits:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, and `revert`.

The subject is required, imperative for English, lower-case at the start, no longer than 72 characters, and has no trailing period. The optional body explains motivation and is wrapped at 100 characters. Use `Closes #123`, `Fixes #456`, or `BREAKING CHANGE:` in the footer when applicable.

Examples:

```text
feat(git-commit): add staged diff validation
fix(git-push): block implicit protected branch pushes
docs(readme): document Claude Code installation
```

## Validation

Run the repository validation, tests, commit-message validation, and GitHub CLI dry run before requesting review. Do not merge, tag, or publish from a Skill change unless explicitly asked.

## Releases

Use semantic versions and publish only reviewed releases.

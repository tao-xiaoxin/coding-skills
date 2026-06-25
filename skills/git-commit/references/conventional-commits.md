# Conventional Commit Reference

## Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

## Approved Types

| Type | Use for |
| --- | --- |
| `feat` | A new capability. |
| `fix` | A bug fix. |
| `docs` | Documentation-only changes. |
| `style` | Formatting without runtime behavior changes. |
| `refactor` | Restructuring without a feature or bug fix. |
| `perf` | A performance improvement. |
| `test` | Tests or test infrastructure. |
| `build` | Build system or dependency changes. |
| `ci` | Continuous-integration configuration. |
| `chore` | Maintenance that does not modify product behavior. |
| `revert` | A deliberate reversal of a prior commit. |

## Header Rules

- `type` is required.
- `scope` is optional and should describe the changed area, for example `api`,
  `router`, `skills`, or `git-push`.
- `subject` is required, imperative for English, lower-case at the start, and
  at most 72 characters.
- Do not end the subject with a period.
- Add `!` only for an actual breaking change.

## Body and Footer Rules

The body is optional. Explain motivation and material behavior changes rather
than restating the subject. Keep lines at 100 characters or fewer.

The footer is optional:

```text
Closes #123
Fixes #456
BREAKING CHANGE: Explain compatibility impact and migration steps.
```

When using `!` in the header, include a `BREAKING CHANGE:` footer, and do the
same in reverse.

## Examples

```text
feat(user): add profile edit page

Add validation, avatar upload, and user API integration.

Closes #42
```

```text
fix(login): correct password validation logic

Require at least eight characters with a number and symbol.

Fixes #123
```

```text
refactor(api)!: change authentication endpoint

BREAKING CHANGE: Move /api/auth to /api/v2/auth. Update configured API base URLs.
```

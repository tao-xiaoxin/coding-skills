# Status Inspection Reference

## Recommended Read-Only Commands

```bash
git status --short --branch
git diff --stat
git diff --cached --stat
git diff --name-status
git diff --cached --name-status
git ls-files --others --exclude-standard
```

Use `git diff -- <path>` or `git diff --cached -- <path>` only after identifying
the target path. Do not lead with a full-repository diff in a large worktree.

## Sensitive Path Heuristics

Treat these paths as warnings and avoid displaying their contents:

```text
.env
.env.*
.npmrc
.pypirc
.netrc
*.pem
*.key
id_rsa
id_ed25519
credential*
credentials*
secret*
token*
```

Path heuristics are not proof of a secret. They are a reason to stop a normal
commit workflow and request a human review.

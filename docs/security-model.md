# Security Model

## What Skills Can and Cannot Enforce

Skills provide repeatable operating procedures. They can make intended behavior
clear, but they cannot replace an agent host's approval model, sandbox, shell
permissions, Git hooks, branch protection, or secret scanning.

This repository therefore uses defense in depth:

1. **Skill procedure:** explicit intent, narrow staging, and dangerous-command
   refusal.
2. **Local checks:** commit-message hooks and repository structure validation.
3. **Repository controls:** protected branches and pull-request review rules.
4. **Remote controls:** secret scanning and push protection when available.
5. **Host controls:** approvals, sandboxing, and optional structured MCP tools.

## Default Deny List

The normal workflows must not perform these operations:

- `git add .`, `git add -A`, or `git commit -a` as a default.
- `git push --force`, `git push --force-with-lease`, `git push --mirror`, or a
  remote ref deletion.
- `git reset --hard`, `git clean -fd`, destructive rebases, or automatic merges.
- Direct publication to `main`, `master`, or `release/*` without explicit user
  intent and a host approval.
- Implicit forking, reviewer assignment, label changes, merge queues, or tags.

## Sensitive Files

The `git-commit` workflow treats the following as blocked unless a separate,
human-reviewed exception policy exists:

- `.env`, `.env.*`, `.npmrc`, `.pypirc`, and `.netrc`
- `*.pem`, `*.key`, `id_rsa`, and `id_ed25519`
- files named or prefixed with `credential`, `credentials`, `secret`, or `token`
- package registry credentials and cloud provider key exports

The agent should not print suspected secret contents while diagnosing a blocked
file. Prefer reporting a redacted path and requesting that the user remove the
secret or rotate it before continuing.

## Future Structured Tooling

For environments that need deterministic enforcement, expose Git writes as
structured tools rather than relying on broad shell access:

```text
git_status(workspace)
git_diff(workspace, files?, staged?)
git_commit(workspace, files[], message)
git_push(workspace, remote, branch, set_upstream?)
git_create_pr(workspace, base, head, title, body, draft?)
git_lint_commit(message)
git_scan_secrets(files[])
```

Each tool should constrain its workspace, reject forbidden flags, preserve an
audit record outside the repository, and leave history unchanged when a remote
operation is rejected.

## Recovery

- Before a commit: unstage an explicitly selected path and re-inspect the diff.
- After a local, unpushed commit: require explicit approval before any repair;
  prefer a new corrective commit when practical.
- After a pushed commit: prefer `git revert` to rewriting remote history.
- After a rejected push: report the rejection and stop. Do not force-push or
  automatically rebase.

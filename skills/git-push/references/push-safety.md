# Push Safety Reference

## Allowed Default Operations

- `git push --porcelain` for the configured upstream of the current branch.
- `git push --porcelain -u origin <current-branch>` for a new, approved,
  non-protected current branch after explicit user intent.

## Operations This Skill Must Not Perform

- Force pushes, including `--force-with-lease`.
- Mirroring, bulk branch pushes, or bulk tag pushes.
- Remote branch or tag deletion.
- Publishing from detached `HEAD`.
- Automatic pull, rebase, reset, merge, or conflict resolution.
- Changes to remote configuration or credential setup.

## Protected Targets

Treat these as protected unless the user explicitly identifies and confirms the
target:

```text
main
master
release/*
```

Repository branch rules remain the authoritative server-side control. The Skill
must not suggest bypassing them.

## Rejected Pushes

When a push is rejected:

1. Preserve the local branch unchanged.
2. Report the remote's response without secret-bearing URLs or tokens.
3. Identify the minimal next inspection step.
4. Do not retry with a force option or automatic rebase.

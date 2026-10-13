# Host Compatibility

The repository follows the open Agent Skills layout: every installable Skill
lives at `skills/<name>/SKILL.md`. The source remains host-neutral; GitHub CLI
copies it into each host's configured project or user scope.

## GitHub CLI Distribution

```bash
# Validate a local checkout before publishing
gh skill publish /root/workspace/coding-skills --dry-run

# Install every local Skill into the current Codex project
gh skill install /root/workspace/coding-skills --from-local \
  --agent codex --scope project --all

# Install every local Skill into the current Claude Code project
gh skill install /root/workspace/coding-skills --from-local \
  --agent claude-code --scope project --all
```

Use `gh skill list` to inspect installed Skills and `gh skill update` to fetch
newer upstream versions. Local installation is a copy-based test workflow; keep
editing this source repository rather than the installed copy.

## Generic `skills` CLI

The repository's `skills/<name>/SKILL.md` layout is also consumable by the
generic Skills CLI:

```bash
# Install one Skill globally for Codex
npx skills add tao-xiaoxin/coding-skills \
  --skill omp-codex-agent --global --agent codex --yes

# Update one installed Skill or all global Skills
npx skills update omp-codex-agent --global
npx skills update --global
```

The update command operates on Skills previously installed by that CLI. It
does not discover an arbitrary local directory unless it is first added as a
package/source.

The OMP delegation Skill requires a PTY or streaming terminal so Codex can
display JSONL Agent events while the command is running. A host that only
returns buffered command output cannot provide live progress; it must report
that limitation rather than use a blind fixed wait.

## Codex

Install through `gh skill install --agent codex`. The read-only `git-status`
Skill can be selected whenever a user asks about repository state. The other
Skills are deliberately explicit: the agent should not choose commit, push, or
pull-request creation merely because it has finished editing files.

Codex approval and sandbox settings remain the authority for whether the host
may execute a command. Keep this repository's `AGENTS.md` available in local
development so repository-level safety rules are discovered together with the
Skills.

## Claude Code

Install through `gh skill install --agent claude-code`. The content is designed
to work as a standard Skill, including direct user invocation such as asking to
run the `git-commit` workflow.

Claude Code permissions and hooks are the enforcement layer for destructive
commands. When deploying these Skills in an organization, use host permissions
or PreToolUse hooks to block force pushes, remote deletion, and history rewrite
commands independently of the Skill text.

## Manual Fallback

When `gh skill` is unavailable, copy a Skill directory into the host's project
Skill directory according to that host's documentation. Keep the entire
directory, including `references/`; copying only `SKILL.md` removes the detailed
policy and recovery guidance.

Do not add host-specific installation metadata to source `SKILL.md` files. The
distribution tool owns its installed-copy metadata.

---
name: omp-codex-agent
description: "Delegate an explicitly requested task from Codex to a local OMP Agent using a private, preconfigured model selector; use when the user asks for OMP execution, and do not use for native Codex provider configuration."
license: Apache-2.0
compatibility: Requires the OMP CLI (`omp`), a private `OMP_CODEX_AGENT_MODEL` environment variable, and an already configured provider credential; works with Codex hosts that can run terminal commands.
metadata:
  author: tao-xiaoxin
  repository: coding-skills
  version: "0.1.0"
---

# OMP Codex Agent

Delegate a user-authorized task to the local OMP Agent. This Skill is an
orchestration adapter: it starts `omp` and does not change Codex's model
provider or make OMP a native Codex subagent.

## Safety Rules

- Run only when the user explicitly asks to delegate work to OMP or invokes this Skill.
- Read the model selector from the private `OMP_CODEX_AGENT_MODEL` environment variable. Never put its value in this repository, a prompt, a log, or command output.
- Use OMP's existing credential configuration. Never print, copy, persist, or interpolate a credential into the prompt or command output.
- Do not edit Codex configuration, OMP configuration, project files, Git state, or remote state merely to activate this Skill.
- Do not use shell tracing such as `set -x`, and do not silently fall back to another model, provider, or API when OMP fails.
- Use the read-only command for tests and inspection. Remove `--no-tools` only when the user explicitly authorizes the requested workspace side effects.
- Skill instructions do not replace host approvals, sandbox policy, branch protection, or other enforcement controls.

## Workflow

1. Confirm the requested task and whether OMP may modify files or use network tools. Preserve the user's constraints in the delegated prompt.
2. Verify `omp` is available with `command -v omp` and stop with the original error if it is missing.
3. Require a non-empty private `OMP_CODEX_AGENT_MODEL`; stop clearly if it is unset. Always use `--thinking max` unless the user asks for another supported level.
4. Start the command in a PTY/streaming terminal. Read each JSONL event as it arrives and surface progress in Codex; do not issue a blocking command followed by a blind fixed wait. Follow [the streaming contract](references/omp-delegation.md).
5. For an explicitly authorized task that needs OMP tools, keep the same model selector and thinking flags and remove only `--no-tools`; retain the user's requested working directory and side-effect boundaries.
6. Treat a non-zero exit status, an error event, or a failed turn as failure. Do not claim success from partial assistant text. Report the last observed event and concise non-sensitive error.

## Result Format

Report, in order:

1. That the task was delegated to the configured OMP model with the requested thinking setting.
2. Live progress events observed while the PTY session was running, including the final event.
3. The OMP provider/protocol and process/turn status, without revealing model or credential identifiers.
4. The useful result or a concise failure reason.
5. Files or external state changed by OMP, if any, and any remaining blocker.

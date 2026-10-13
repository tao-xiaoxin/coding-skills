# OMP Delegation Reference

## Read-only command

Set the private model selector in the caller's environment. Keep the prompt as
one quoted argument and do not enable shell tracing.

```bash
test -n "${OMP_CODEX_AGENT_MODEL:-}" || {
  printf '%s\n' 'OMP_CODEX_AGENT_MODEL is required' >&2
  exit 1
}

omp -p --no-session --no-tools --no-extensions --no-skills --no-rules --mode json \
  --model "$OMP_CODEX_AGENT_MODEL" \
  --thinking max \
  '<delegated task>'
```

This calls OMP's Agent runtime through its configured provider. It does not
modify Codex's `model_provider` or require a Codex API key.

## Streaming contract

Run the command in a PTY or another terminal mode that exposes incremental
stdout. Read and handle each JSON line immediately instead of waiting for the
process to exit. Surface at least these state transitions in Codex:

- `agent_start` and `turn_start`: the delegated Agent is running.
- `message_update`: assistant text is arriving; display deltas as they arrive.
- Tool events, when tools are enabled: report the tool phase without exposing arguments that contain private data.
- `turn_end` and `agent_end`: the turn reached a terminal state; combine this with the process exit code.

Poll the active PTY session with the host terminal's read/poll operation until
`agent_end` is terminal and the process exits. Do not use an unbounded sleep or
claim progress from a command that has not emitted an event. If the host cannot
provide PTY streaming, report that limitation instead of pretending the Agent
is live.

## Side-effect modes

| Mode | Required flags | Intended use |
| --- | --- | --- |
| Read-only/test | `--no-session --no-tools --no-extensions --no-skills --no-rules` | Smoke tests, analysis, and diagnostics |
| Authorized OMP tools | Keep `--model` and `--thinking max`; remove only `--no-tools` | User-approved workspace work |

Do not remove safety flags or add automatic approval flags to broaden an
assignment. A tool-enabled run may edit files or access the network according
to the OMP host's own policy.

## Success and failure

The JSON stream should contain a completed turn and a successful process exit.
Treat non-zero exit status, an error event, or a failed/interrupted turn as a
failed delegation. Preserve the original provider and protocol in the report;
do not retry with a different target to make the result look successful.

## Provider boundary

The model is resolved by OMP's private local catalog. Do not publish its ID,
provider-specific alias, endpoint, or credential. Making the configured model a
native Codex provider is a separate integration and may require provider-
specific Responses compatibility.

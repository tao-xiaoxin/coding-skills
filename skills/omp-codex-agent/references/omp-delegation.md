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

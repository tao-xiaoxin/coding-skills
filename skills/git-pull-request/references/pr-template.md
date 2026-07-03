# Pull Request Body Template

```md
## Summary

- <primary behavior change>
- <secondary behavior change>

## Validation

- <command and outcome>

## Notes

- <migration, compatibility, security, privacy-safe evidence, or follow-up detail>
```

## Rules

- Do not claim tests passed unless they actually ran.
- Use `Not run (not requested)` when no validation command was executed.
- Explain resulting behavior rather than copying every commit message.
- State breaking changes, migration steps, and known limitations clearly.
- Do not include secrets, local absolute paths, local service addresses,
  temporary artifact or screenshot locations, personal data, or unrelated
  worktree changes.
- Refer to locally gathered evidence with a privacy-safe description rather than
  publishing machine-specific paths, raw local logs, or environment details.
- Do not attach or embed a binary asset merely as proof of validation. When an
  asset is intentionally included, ensure unrelated creator, location,
  document, or environment metadata has been removed where practical.

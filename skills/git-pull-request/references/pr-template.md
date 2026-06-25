# Pull Request Body Template

```md
## Summary

- <primary behavior change>
- <secondary behavior change>

## Validation

- <command and outcome>

## Notes

- <migration, compatibility, security, or follow-up detail>
```

## Rules

- Do not claim tests passed unless they actually ran.
- Use `Not run (not requested)` when no validation command was executed.
- Explain resulting behavior rather than copying every commit message.
- State breaking changes, migration steps, and known limitations clearly.
- Do not include secrets, local absolute paths, tokens, or unrelated worktree
  changes.

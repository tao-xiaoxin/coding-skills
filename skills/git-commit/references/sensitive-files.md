# Sensitive File Policy

Normal commit workflows must stop when candidate paths match any of the
following patterns:

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

## Handling a Match

1. Do not stage the path.
2. Do not display its contents in agent output.
3. Report a redacted path and the matched category.
4. Ask the user to remove, rotate, replace, or explicitly route the data through
   a reviewed secret-management policy.
5. Re-run the staged diff inspection after the path is excluded.

## Notes

- A filename match is a safety trigger, not proof that a secret is present.
- A non-matching filename is not proof that a file is safe.
- Repository secret scanning and push protection are additional defenses, not a
  substitute for narrow staging and human review.

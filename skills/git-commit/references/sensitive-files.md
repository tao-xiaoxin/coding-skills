# Sensitive Files and Publication-Safety Policy

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

A filename match is a safety trigger, not proof that restricted content is
present. A non-matching filename is not proof that a file or diff is safe.

## Diff and Public-Exposure Review

Before staging, inspect the relevant candidate diff for private material that
should not enter a public repository, including:

- machine-specific paths, usernames, home directories, temporary artifact
  locations, local logs, caches, screenshot paths, and local environment
  identifiers;
- local or internal service addresses and ports that are not a documented public
  test contract;
- personal records, local configuration values, or private evidence copied into
  source, documentation, fixtures, or release notes;
- restricted authentication material or other secrets.

Do not print suspected private values merely to prove they were found. Report a
redacted path, affected line range where available, and the exposure category.

## Binary Assets and Embedded Data

For new or modified images, fonts, archives, binaries, SVGs, and embedded
`data:` payloads, inspect decoded metadata where practical. Stop when an asset
contains unrelated creator, device, location, document, instance, environment,
or similar provenance metadata, or any private material not required at runtime.

A visual match, successful browser render, or safe-looking filename is not proof
that a binary asset is safe to publish.

## Handling a Match

1. Do not stage the path or affected change.
2. Do not display the private content in agent output.
3. Report a redacted path, line range or artifact category, and exposure type.
4. Ask the user to remove, sanitize, replace, or explicitly route the material
   through an approved policy.
5. Re-run staged-diff and relevant metadata checks after remediation.
6. When a value has already been committed or published, do not claim that a
   branch rewrite or edited public text removes every cache, notification, fork,
   mirror, or hosting-provider copy.

## Notes

- Repository scanning and push protection are additional defenses, not a
  substitute for narrow staging, diff inspection, artifact metadata review, and
  human review.
- Pull-request and Issue text are public publication surfaces too; a safe commit
does not make an unsafe PR body safe.

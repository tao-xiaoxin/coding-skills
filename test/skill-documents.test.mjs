import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');

async function source(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

test('README documents Codex and Claude Code installation', async () => {
  const readme = await source('README.md');

  assert.match(readme, /--agent codex/);
  assert.match(readme, /--agent claude-code/);
  assert.match(readme, /gh skill publish --dry-run/);
});

test('all MVP Skills have a matching frontmatter name', async () => {
  for (const name of ['git-status', 'git-commit', 'git-push', 'git-pull-request']) {
    const skill = await source(`skills/${name}/SKILL.md`);
    assert.match(skill, new RegExp(`^name: ${name}$`, 'm'));
    assert.match(skill, /^description: /m);
    assert.match(skill, /^## (Safety Rules|Non-Negotiable Safety Rules)$/m);
    assert.match(skill, /^## Workflow$/m);
    assert.match(skill, /^## Result Format$/m);
  }
});

test('write Skills document separated side effects', async () => {
  const commit = await source('skills/git-commit/SKILL.md');
  const push = await source('skills/git-push/SKILL.md');
  const pullRequest = await source('skills/git-pull-request/SKILL.md');

  assert.match(commit, /does \*\*not\*\* imply a push/i);
  assert.match(push, /does not create a commit/i);
  assert.match(pullRequest, /does not push the branch/i);
});

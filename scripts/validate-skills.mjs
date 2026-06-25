import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const skillsRoot = path.join(root, 'skills');
const writeSkills = new Set(['git-commit', 'git-push', 'git-pull-request']);

function extractFrontmatter(source, filePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    throw new Error(`${filePath}: missing YAML frontmatter`);
  }

  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const scalar = line.match(/^([a-z][a-z0-9-]*):\s*(.+)$/i);
    if (scalar) {
      values[scalar[1]] = scalar[2].replace(/^['"]|['"]$/g, '');
    }
  }

  return values;
}

async function validateSkill(directory) {
  const skillPath = path.join(skillsRoot, directory, 'SKILL.md');
  const source = await readFile(skillPath, 'utf8');
  const frontmatter = extractFrontmatter(source, skillPath);
  const errors = [];

  if (frontmatter.name !== directory) {
    errors.push(`frontmatter name must equal directory name (${directory})`);
  }

  if (!frontmatter.description || frontmatter.description.length < 40) {
    errors.push('description must explain the capability and activation context');
  }

  if (!frontmatter.compatibility) {
    errors.push('compatibility is required for this repository');
  }

  if (!frontmatter.license) {
    errors.push('license is required for this repository');
  }

  if (!/^#\s+/m.test(source)) {
    errors.push('a top-level Markdown heading is required');
  }

  if (!/^##\s+(?:Safety|Safety Rules|Non-Negotiable Safety Rules)/m.test(source)) {
    errors.push('a dedicated safety section is required');
  }

  if (!/^##\s+(?:Workflow|Procedure)/m.test(source)) {
    errors.push('a dedicated workflow section is required');
  }

  if (!/^##\s+Result Format/m.test(source)) {
    errors.push('a result format section is required');
  }

  const referenceDirectory = path.join(skillsRoot, directory, 'references');
  try {
    const referenceEntries = await readdir(referenceDirectory);
    if (!referenceEntries.some((entry) => entry.endsWith('.md'))) {
      errors.push('references directory must contain at least one Markdown file');
    }
  } catch {
    errors.push('references directory is required');
  }

  if (writeSkills.has(directory)) {
    if (!/explicit(?:ly)?/i.test(source)) {
      errors.push('write Skill must require explicit user intent');
    }
    if (!/must not|never|do not/i.test(source)) {
      errors.push('write Skill must document blocked operations');
    }
  }

  return errors.map((error) => `${directory}: ${error}`);
}

async function main() {
  let entries;
  try {
    entries = await readdir(skillsRoot);
  } catch {
    console.error('skills/: directory not found');
    process.exitCode = 1;
    return;
  }

  const directories = [];
  for (const entry of entries.sort()) {
    const entryPath = path.join(skillsRoot, entry);
    if ((await stat(entryPath)).isDirectory()) {
      directories.push(entry);
    }
  }

  if (directories.length === 0) {
    console.error('skills/: no Skill directories found');
    process.exitCode = 1;
    return;
  }

  const errors = (await Promise.all(directories.map(validateSkill))).flat();
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
    return;
  }

  console.log(`Validated ${directories.length} Skill directories.`);
}

await main();

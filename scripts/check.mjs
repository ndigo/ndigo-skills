#!/usr/bin/env node
/**
 * Validates every skill in this repository.
 *
 * A skill is a `<id>/SKILL.md` directory whose frontmatter `name` matches the
 * directory, carries a description, may declare the workspace `package` it
 * ships with, and stays within the 120-line budget that keeps one skill
 * loadable without exhausting an agent's context. The README table must list
 * every skill. Run in CI and before syncing into the Ndigo monorepo.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const MAX_SKILL_LINES = 120;
const packageNamePattern = /^@ndigo\/[a-z0-9-]+$/u;

const ids = readdirSync(ROOT)
    .filter((entry) => statSync(join(ROOT, entry)).isDirectory() && existsSync(join(ROOT, entry, 'SKILL.md')))
    .sort();

const problems = [];
if (ids.length === 0) problems.push('no skills found');

for (const id of ids) {
    const file = join(ROOT, id, 'SKILL.md');
    const text = readFileSync(file, 'utf8');
    const match = /^---\n([\s\S]*?)\n---\n/u.exec(text);
    if (match === null) {
        problems.push(`${id}/SKILL.md is missing its frontmatter block`);
        continue;
    }
    const name = /^name:\s*(.+)$/mu.exec(match[1])?.[1]?.trim();
    if (name !== id) problems.push(`${id}/SKILL.md declares name '${name}', expected '${id}'`);
    if (!/^description:\s*\S/mu.test(match[1])) problems.push(`${id}/SKILL.md is missing a description`);
    const packageLine = /^package:\s*(.+)$/mu.exec(match[1])?.[1]?.trim();
    if (packageLine !== undefined) {
        const packageName = packageLine.replace(/^["']|["']$/gu, '');
        if (!packageNamePattern.test(packageName)) {
            problems.push(`${id}/SKILL.md declares package '${packageName}'; expected @ndigo/<lower-case-name>`);
        }
    }
    const bodyLines = text.split('\n').length;
    if (bodyLines > MAX_SKILL_LINES) {
        problems.push(`${id}/SKILL.md is ${bodyLines} lines; keep skills at or below ${MAX_SKILL_LINES}`);
    }
}

const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
for (const id of ids) {
    if (!readme.includes(`\`${id}\``)) problems.push(`README.md does not list ${id}`);
}

// Install command must use the current CLI and the real repository.
if (!readme.includes('npx skills add ndigo/ndigo-skills')) {
    problems.push('README.md install snippet must read `npx skills add ndigo/ndigo-skills`');
}
if (readme.includes('npx add-skill')) {
    problems.push('README.md uses the deprecated `npx add-skill` command');
}

if (problems.length > 0) {
    for (const problem of problems) process.stderr.write(`✗ ${problem}\n`);
    process.exitCode = 1;
} else {
    console.log(`ok ${ids.length} skills`);
}

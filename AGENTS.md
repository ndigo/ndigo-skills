# ndigo-skills — Agent Guidelines

Canonical authoring repository for Ndigo agent skills (`ndigo-*`). Each skill is a
`<id>/SKILL.md` whose frontmatter `name` matches its directory. Keep skills at
or below 120 lines.

## Commands

```bash
node scripts/check.mjs   # validate frontmatter, length, and naming
```

## Conventions

- One directory per skill, frontmatter `name` matching the directory.
- Optional `package` frontmatter field names the workspace package a skill
  ships with (e.g. `package: "@ndigo/ui"`).
- Router-shaped content: verbs, traps, and an example prompt. Facts come from
  machine output, not prose.

## Syncing into the monorepo

This repo is the canonical source. The monorepo vendors a pinned snapshot.
After merging a skill change here, run in a clean `ndigo` checkout:

```bash
pnpm agent-content:sync && pnpm agent-content:build
```

and commit the snapshot, lock, and regenerated outputs together.
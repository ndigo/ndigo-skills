<p align="center">
  <img src="https://github.com/ndigo/.github/raw/main/profile/assets/ndigo.svg" alt="Ndigo logo" width="120" height="120">
</p>

# Ndigo Skills

AI agent skills for building Ndigo applications. Install with:

```bash
npx skills add ndigo/ndigo-skills
```

Or via the Ndigo CLI:

```bash
ndigo ai init
```

## Skills

| Skill | Description |
|---|---|
| `ndigo-agent` | Expose an application's handlers as MCP tools |
| `ndigo-app` | Scaffold, run, configure, and update a Ndigo application |
| `ndigo-debug` | Debugging Ndigo apps (logs, traces, health endpoints) |
| `ndigo-endpoint` | Add HTTP endpoints, handlers, and validation |
| `ndigo-model` | Add a provider-neutral model loop with streaming and tools |
| `ndigo-persistence` | Database, migrations, and entity management |
| `ndigo-reactive` | Reactive signals and state management |
| `ndigo-ui` | UI components and theming |
| `ndigo-upgrade` | Upgrade Ndigo versions and migrate |
| `ndigo-verify` | Verification and conformance checks |
| `ndigo-views` | View resolvers and templates |

## Working on a skill

Each skill is a `<id>/SKILL.md` file whose frontmatter `name` matches its
directory. Keep skills at or below 120 lines so an agent can load one without
spending its context.

A skill may declare the workspace package it belongs to, for example
`package: "@ndigo/ui"`. The Ndigo monorepo emits such skills into that
package's `skills/` directory (with the package's export index alongside), so
an agent can read `node_modules/@ndigo/<pkg>/skills/<id>/SKILL.md` when the
package is a direct dependency. Skills without the field ship only through the
Ndigo CLI assets and the published mirror.

```bash
node scripts/check.mjs
```

CI runs the same check on every push and pull request.

## Compatibility

Skills track the Ndigo framework. Check the skill's frontmatter for the compatible framework version range.

## Syncing into the monorepo

This repository is the canonical source. The Ndigo monorepo bundles a pinned
snapshot for offline `ndigo ai init`, and `tools/agent-content/build.mjs`
refuses to emit assets while that snapshot drifts from its lock.

1. Change the skills here and merge to `main`.
2. In a clean checkout of `ndigo`, run:

    ```bash
    pnpm agent-content:sync
    pnpm agent-content:build
    pnpm agent-content:check
    ```

3. Commit `tools/agent-content/skills/` and `skills.lock.json` with the change.

`pnpm agent-content:sync` reads the sibling `../ndigo-skills` checkout by
default; set `NDIGO_SKILLS_DIR` to point elsewhere. The source checkout must be
clean, so the commit recorded in `skills.lock.json` identifies the content
exactly.

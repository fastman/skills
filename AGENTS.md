# AGENTS.md — Skills Repository

This repository contains agent skills following the Agent Skills format. It is NOT a typical application — there is no build, test framework, or linting. Only validation scripts exist.

## Commands

```bash
# Run all validations (scope, marketplace, skill spec)
npm run validate

# Run validations individually
npm run validate:scope    # Verifies skills/ directory exists
npm run validate:plugins # Validates .claude-plugin/marketplace.json
npm run validate:skills  # Auto-discovers and validates all skills/*/SKILL.md
```

No other commands available. This is a skill package, not an application.

## Code Style Guidelines

### General Principles

- Keep code minimal and concise — these are small validation scripts
- Use ES modules (`import`/`export`, not CommonJS `require`)
- Use async/await over raw promises
- Use `node:` prefix for built-in modules: `import { readFile } from 'node:fs/promises'`

### File Conventions

- Validation scripts: `.mjs` extension (ESM)
- Place in `scripts/` directory
- Use `#!/usr/bin/env node` shebang if executable

### Error Handling

- Use try/catch blocks for async operations
- Exit with `process.exit(1)` on failure
- Print meaningful error messages to stderr
- Exit with code 0 on success

Example:
```javascript
async function main() {
  try {
    await doSomething();
  } catch (err) {
    console.error(`Validation failed: ${err.message}`);
    process.exit(1);
  }
}
main();
```

### Imports

```javascript
import { promises as fs } from 'node:fs';
import path from 'node:path';
```

## Repository Structure

```
├── skills/<name>/SKILL.md   # Skill definition
├── skills/<name>/references/# Optional supporting docs
├── scripts/                 # Validation scripts (.mjs)
├── .claude-plugin/          # Marketplace manifest
└── docs/                    # Documentation
```

## SKILL.md Frontmatter

Required fields:
```yaml
---
name: <skill-name>
description: <description>
license: MIT
compatibility: opencode
metadata:
  audience: developers
  topic: <topic>
  version: X.Y.Z
---
```

## Scope Policy

This repository is open to any skill. Allowed skill directories: any directory under `skills/` with a valid `SKILL.md`.

## Versioning

- Update `metadata.version` in each skill's `SKILL.md` for behavior changes
- Create git tags: `vX.Y.Z`
- Document changes in `CHANGELOG.md`

## Common Tasks

### Running validation before committing
```bash
npm run validate
```

### Updating skill version
Edit `version` in the skill's SKILL.md frontmatter metadata section.

### Creating a new skill
Create a new directory under `skills/` with a valid `SKILL.md`.

## References

- Publishing guide: `docs/PUBLISHING.md`
- README: `README.md`

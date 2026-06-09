# Skills

Agent skills collection by fastman.

## Repository Structure

- `skills/<skill-name>/SKILL.md` — skill metadata and instructions
- `skills/<skill-name>/references/` — optional supporting docs
- `skills/<skill-name>/scripts/` — optional helper scripts

## Available Skills

| Skill | Description |
|---|---|
| `kaneo` | Manage tasks in Kaneo via REST API (tasks, labels, comments, search, project workflows). |
| `kaneo-brain-dump` | Persist analysis insights and investigation findings into Kaneo tasks. |

## Usage

Install from this repository with the Skills CLI:

```bash
npx skills add fastman/skills
```

Install a specific skill:

```bash
npx skills add fastman/skills --skill kaneo
```

## Claude Code Plugin Marketplace

This repository also includes plugin marketplace metadata at `.claude-plugin/marketplace.json`.

```bash
/plugin marketplace add fastman/skills
/plugin install kaneo@skills
```

## Validation

Run all checks locally before publishing:

```bash
npm run validate
```

Or run checks independently:

```bash
npm run validate:plugins
npm run validate:skills
```

CI also runs these checks on every PR and push to `main` via `.github/workflows/validate.yml`.

## Scope Policy

- Any skill directory under `skills/` is allowed.
- Each skill must have a valid `SKILL.md` in its directory.
- The scope validator checks that `skills/` exists and is a directory.
- The skills validator auto-discovers all `skills/*/SKILL.md` files and validates each one.

## Versioning and Releases

- Keep `metadata.version` in each skill's `SKILL.md` up to date for behavior changes.
- Create git tags for published milestones (`vX.Y.Z`).
- Record public changes in `CHANGELOG.md`.

## Publishing to skills.sh

There is no manual deploy step to skills.sh.
Skills become discoverable/ranked via anonymous telemetry when users run:

```bash
npx skills add fastman/skills
```

Publishing checklist is documented in `docs/PUBLISHING.md`.

## Maintenance Guidelines

- Keep one skill per directory under `skills/`.
- Keep `SKILL.md` focused on activation + workflow.
- Move large references to `references/` as the skill grows.
- Keep frontmatter valid (`name`, `description` required).

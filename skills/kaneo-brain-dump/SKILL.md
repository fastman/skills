---
name: kaneo-brain-dump
description: >
  Persist analysis insights and investigation findings into Kaneo tasks so work can be resumed later without re-doing the analysis.
  Use this skill whenever the user wants to save what they learned for later, hand off implementation context, switch tasks mid-session,
  or "put this in Kaneo" — especially after code reading, debugging, design work, or any investigation where the valuable part is the
  reasoning, not the source files. Trigger phrases include: "save this for later", "put it in Kaneo", "offload your brain",
  "we'll come back to this", "save everything you learned", "dump the important findings". Also trigger when the user has done
  substantial analysis and wants to preserve gotchas, dependencies, constraints, missing pieces, or recommended approaches.
  Do not use for ordinary Kaneo task CRUD (create, move, rename, comment, label, search, list projects) or simple task creation
  with no meaningful analysis to preserve.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  topic: project-management
  api: kaneo
  version: 0.3.0
---

# Kaneo Brain Dump

Persist analysis work into Kaneo so later implementation can start from understanding instead of re-discovery.

## When to use this skill

Use this skill when the user wants to preserve analysis context, for example:
- "save this for later"
- "put it in Kaneo"
- "offload your brain"
- "we'll come back to this"
- "create a Kaneo task with everything you learned"
- switching contexts after substantial code reading, debugging, design work, or investigation

Use the regular Kaneo task-management workflow instead when the user only wants to:
- create a simple task with a short description
- rename, reprioritize, move, assign, or comment on an existing task
- manage labels, projects, columns, or due dates without preserving analysis

## Core idea

Capture what would be expensive to reconstruct.

Source files can be re-read. Your reasoning usually cannot. The value of this skill is preserving the gap between raw artifacts and your conclusions.

A brain dump that just restates what the files say is useless — the next agent can read the files too. The useful part is what you figured out that the files don't say on their own.

## What to capture

Capture:
- hidden dependencies or coupling you noticed
- gotchas, footguns, and misleading comments
- edge cases worth testing or designing around
- missing files, factories, migrations, or setup pieces
- constraints from current architecture, conventions, or external APIs
- recommended implementation strategy and why it is the best fit
- the smallest useful next actions to move work forward
- file paths only as pointers, not as substitutes for explanation

Do not capture:
- long source code excerpts
- large dumps of re-readable file contents
- line-by-line summaries of code the next agent can open directly
- vague filler like "needs investigation" when you already know the real blocker

## Before creating anything in Kaneo

Do not guess the Kaneo destination.

1. Read `docs/KANEO.md` at the project root if it exists. It contains the active workspace name, project name, and column slugs.
2. If `docs/KANEO.md` does not exist, ask the user which workspace and project to target. Provide a short list of options from `kaneo_list_workspaces` and `kaneo_list_projects` if the user is unsure.
3. If the user did not specify a status, use `kaneo_list_columns` for the target project and confirm a valid slug before calling `kaneo_create_task`.
4. If the user did not specify a priority, default to `medium` unless the analysis clearly warrants `high` or `urgent`.

This matters because a good brain dump is much less useful if it lands in the wrong project or invalid column.

## Output shape

Create one parent task plus subtasks when there is enough distinct follow-up work to justify them.

### Parent task

The parent task is the durable context holder. It should explain the situation, the important findings, and the recommended path forward.

Use this exact structure. The section headers are not decorative — they signal to the next agent what kind of information lives where, so they can scan quickly instead of re-reading everything.

```markdown
# [Short work summary]

## Goal
- What problem or feature this work is about
- Why it matters

## What I learned
- The conclusions that are easy to lose and costly to rediscover
- What the investigation revealed that was not obvious from reading the files
- Why existing behavior differs from what you would expect

## Important gotchas
- Edge cases, hidden behavior, or misleading assumptions
- Things that look one way in comments but behave differently in code
- Hardcoded values, backdoors, or legacy exceptions
- Time-sensitive behavior or race conditions

## Constraints and dependencies
- Architectural constraints that limit the solution space
- Required collaborators or teams
- Missing pieces that must exist before implementation can start
- Related files that serve as good references

## Recommended approach
- The next best implementation path and why it is the best fit
- What to avoid and why
- The smallest first step that proves the approach works

## Useful references
- `path/to/file.ext` — why it matters, what to look at
- `path/to/other_file.ext` — what pattern to follow

## Run / verify
- Test, lint, migration, or repro commands if relevant
```

### Subtasks

Create subtasks only when they make the work more executable. Good subtasks are cohesive action groups, not arbitrary slices.

Each subtask must include four things:

```markdown
## What to do
- Concrete action the implementer should take

## Success looks like
- How to tell when this subtask is done

## Local gotchas
- Risk, edge case, or trap specific to this action

## Relevant files or commands
- Files to edit, commands to run, or specs to reference
```

Examples of good subtask groupings:
- one subtask for setup work (factories, migrations, config)
- one subtask for a risky integration edge case
- one subtask for tests that share the same setup strategy

Do not create subtasks when a single well-written parent task is enough. A good rule of thumb: if the investigation uncovered one clear problem with one clear fix, one task is right. If there are multiple distinct work streams that different people could pick up independently, subtasks help.

## Workflow

### Step 1: Confirm the Kaneo target

- Read `docs/KANEO.md` first. If it exists, use the workspace and project listed there.
- If the file does not exist, list workspaces and projects to find the right destination, or ask the user.
- Use `kaneo_list_columns` to get a valid status slug.

### Step 2: Distill the analysis

Turn raw exploration into a concise handoff:
- what exists already
- what is missing
- what is risky
- what will probably break if implemented naively
- what approach best fits the observed codebase

If your notes are mostly restating source code, compress further until the analysis is doing real work.

### Step 3: Create the parent task

Use `kaneo_create_task` with:
- a title that describes the actual work to resume
- a description centered on insights, not copied artifacts
- a status slug confirmed from the project columns
- a priority that reflects urgency, not just size

### Step 4: Create subtasks if warranted

Use `kaneo_create_subtask` for meaningful work packets.

### Step 5: Verify the handoff

- Confirm the parent task was created in the intended project and status.
- Confirm each subtask exists and has a usable description.
- Report back to the user with the created task titles and what was preserved.

## How to write well

Prefer explanation over dump.

Good:
- "`UserSyncService` looks stateless, but it depends on request-scoped auth injected through `Current.account`, so background jobs will fail unless that context is set explicitly."
- "There is no factory for `Membership`, but three existing specs build it manually through `Organization#create_membership`; follow that pattern instead of adding a new factory first."

Bad:
- "The service is in `app/services/user_sync_service.rb` and has 11 methods."
- "Here are the contents of the controller and model files."

Good handoffs help the next agent make decisions quickly.

## Examples

### Good: captures irreplaceable insight

> `#is_admin?` has a hardcoded backdoor for legacy IDs; add an explicit test before refactoring or the cleanup may silently remove production behavior.

### Good: captures strategy

> `getCircleFor` is private but shared by six public entry points. Stub or isolate that dependency in tests rather than repeating full setup in each case.

### Good: captures missing piece

> The implementation can reuse the current repository layer, but there is no migration for `archived_at`; schema work has to happen before UI changes.

### Bad: captures only what can be reopened

> The method starts on line 136 and compares `admin_id` to `uid`.

### Bad: creates a task with no brain

> Write tests for the event model.

## Resuming from a brain-dump task

When coming back to a task created with this skill:
1. Read the parent task first for context.
2. Read subtasks for concrete execution slices.
3. Re-read the referenced source files because the code may have changed.
4. Treat the Kaneo content as preserved reasoning, not as a replacement for checking current reality.

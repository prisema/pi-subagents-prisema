# Remove Slop default agent

## Goal
Add a dedicated `Remove Slop` subagent so Pi can run post-validation cleanup in isolated context instead of spending the parent agent's context.

## Context
Prisema already had `/remove-slop` in `pi-extension-prisema` and a Codex-compatible `remove-slop` skill prompt. Pi subagents did not expose a cleanup role, so the parent had to run cleanup itself or call the prompt command.

## Decisions
- Added `Remove Slop` as an embedded default agent.
- Gave it `read`, `bash`, `edit`, `grep`, `find`, and `ls` tools plus FFF search extension access.
- Excluded `write` so it can edit existing touched files but cannot create new files.
- Scoped the prompt to job-local touched files from parent-provided scope, merge-base-aware branch diff, or current working tree/cached diff.
- Prohibited commits, staging, pushes, branch changes, destructive cleanup, file creation, unrelated refactors, and shell redirects/heredocs for writes.
- Reused the forgiving agent-name lookup so `Remove Slop`, `remove slop`, and `remove-slop` resolve to the same agent.
- Updated README, Agent tool guidance, registry tests, prompt tests, and package metadata.
- Bumped package version to `0.6.3-prisema.5`.

## Commands run
- Edited default agent registry, tests, README, and package metadata
- `npm run typecheck`
- `npm test`
- `npm run build`
- `./node_modules/.bin/biome check src/ test/`
- `git diff --check`

## Files changed
- `src/default-agents.ts`
- `src/index.ts`
- `src/types.ts`
- `test/agent-types.test.ts`
- `test/prompts.test.ts`
- `README.md`
- `package.json`
- `package-lock.json`
- `docs/agent/notes/2026-05-02-remove-slop-default-agent.md`

## Tests
- `npm run typecheck` ✅
- `npm test` ✅ — 17 files, 319 tests passed
- `npm run build` ✅
- `./node_modules/.bin/biome check src/ test/` ✅
- `git diff --check` ✅

## Risks
- `Remove Slop` has `edit`, so prompt guardrails and parent-provided scope must keep cleanup limited to touched files.
- Validation commands may create normal test/build cache artifacts even though the agent cannot create files directly.

## Next
- Update/install the package and run `/reload` in Pi so the Agent tool advertises `Remove Slop`.
- Use `Remove Slop` after implementation and validation when the touched scope is meaningful.

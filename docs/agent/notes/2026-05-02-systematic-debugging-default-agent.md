# Systematic Debugging default agent

## Goal
Add a dedicated `Systematic Debugging` subagent so bug and failure work spends enough context on root-cause investigation before any fix is proposed.

## Context
Codex was already using the Superpowers `systematic-debugging` skill from its curated plugin cache. Pi did not have an equivalent built-in Prisema subagent. The existing Prisema default roles were `Explore`, `Plan`, `Implement`, and `Review`; `Explore` can map context, but it is not explicitly a root-cause debugging workflow.

## Decisions
- Added `Systematic Debugging` as an embedded default agent between `Explore` and `Plan`.
- Made it read-only: `read`, `bash`, `grep`, `find`, `ls`, plus FFF search extension tools.
- Adapted the Superpowers systematic-debugging workflow into a Prisema Root Cause Report prompt: reproduce, inspect recent changes, gather evidence, trace flow, compare working examples, test one hypothesis, then recommend a minimal test-first fix.
- Kept implementation separate: parent or `Implement` applies the fix after the Root Cause Report; `Review` validates when risk is meaningful.
- Updated README, Agent tool guidance, default agent names, prompt tests, and registry tests.
- Made agent type lookup tolerate spaces, hyphens, and underscores so `Systematic Debugging`, `systematic debugging`, and `systematic-debugging` resolve to the same agent.
- Bumped package version to `0.6.3-prisema.4`.

## Commands run
- `git status --short`
- Read Codex Superpowers `systematic-debugging/SKILL.md`
- Edited default agent registry, tests, README, and package metadata
- `npm install`
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
- `docs/agent/notes/2026-05-02-systematic-debugging-default-agent.md`

## Tests
- `npm run typecheck` ✅
- `npm test` ✅ — 17 files, 317 tests passed
- `npm run build` ✅
- `./node_modules/.bin/biome check src/ test/` ✅
- `git diff --check` ✅

## Risks
- `Systematic Debugging` can run reproduction/build/test commands with `bash`; those commands may create normal cache/build artifacts even though the agent cannot edit files.
- The agent name contains a space. Lookup now tolerates `systematic-debugging`, but docs should still prefer `subagent_type: "Systematic Debugging"` for clarity.

## Next
- Update/install the package and run `/reload` in Pi so the Agent tool advertises `Systematic Debugging`.
- Use `Systematic Debugging -> Implement -> Review` for bug/failure work.

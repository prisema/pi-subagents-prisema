# Default subagent concurrency 10

## Goal
Allow up to 10 background subagents to run at same time before queueing.

## Context
Existing `AgentManager` default max concurrent background agents was 4. Runtime/project/global settings can still override via `maxConcurrent`.

## Decisions
- Changed hardcoded default from 4 to 10.
- Kept queue behavior unchanged: 11th background agent queues by default.
- Added regression test for 10 running + 1 queued.
- Updated README and changelog docs to match new default.

## Commands run
- `npx vitest run test/agent-manager.test.ts` — RED first, default still 4.
- `npx vitest run test/agent-manager.test.ts` — pass, 9 tests.
- `npm run typecheck` — pass.
- `./node_modules/.bin/biome check src/ test/` — pass.
- `npm run typecheck && npm test` — pass, 17 files / 325 tests.
- `npm run lint` — harness reported `ESLint output (JSON parse failed: EOF...)`; direct Biome binary passed.

## Files changed
- `src/agent-manager.ts`
- `test/agent-manager.test.ts`
- `README.md`
- `CHANGELOG.md`
- `docs/agent/notes/2026-05-07-default-concurrency-10.md`

## Tests
Focused and full suites passed after change.

## Risks
Higher default parallelism may increase CPU/API/token pressure on low-resource machines. Rollback: set `maxConcurrent` lower in `.pi/subagents.json` or revert `DEFAULT_MAX_CONCURRENT` to 4.

## Next
Use `/agents` → Settings or project/global `subagents.json` if a specific machine needs lower/higher limit.

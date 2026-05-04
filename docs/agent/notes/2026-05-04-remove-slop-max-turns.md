# Remove Slop default max turns

## Goal

Set built-in `Remove Slop` default max turn limit to 16 turns unless caller/settings override it.

## Context

UI runtime default shows `≤8`; requested built-in default doubles that for `Remove Slop` only.

## Decisions

- Added `maxTurns: 16` to embedded `Remove Slop` default config in `src/default-agents.ts`.
- Added regression assertion in `test/agent-types.test.ts` so other defaults remain covered by existing tests.
- Did not change global runtime defaults or other agents.

## Commands run

- `npx vitest run test/agent-types.test.ts` — RED first: `Remove Slop defaults to 16 max turns` failed with `expected undefined to be 16`.
- `npx vitest run test/agent-types.test.ts` — PASS (37 passed).
- `npm run typecheck` — PASS.
- `npm test` — PASS (17 files, 324 tests).
- `npm run build` — PASS.
- `./node_modules/.bin/biome check src/ test/` — PASS (`Checked 37 files`).
- `git diff --check` — PASS.

## Files changed

- `src/default-agents.ts`
- `test/agent-types.test.ts`
- `docs/agent/notes/2026-05-04-remove-slop-max-turns.md`

## Tests

Focused regression, typecheck, full test suite, build, Biome check, and whitespace check passed.

## Risks

Low. Config-only default; callers/settings can still override through existing resolution path.

## Next

Reload extension/runtime and confirm `Remove Slop` activity displays `≤16` when no caller override is provided.

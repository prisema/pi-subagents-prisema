# 2026-05-03 — Explore thinking medium

## Goal
Make the default `Explore` subagent run with `medium` thinking instead of inheriting or accepting a lower caller-provided value.

## Context
A recent `Explore` run appeared in the Pi UI as `thinking: low` and then aborted after exceeding the active turn limit (`⟳12≤6`). Explore is the default local context builder, so `low` reasoning is too shallow for repository mapping.

## Decisions
- Set `thinking: "medium"` on the embedded `Explore` default agent in `src/default-agents.ts`.
- Add a registry test assertion against `getAgentConfig("Explore")?.thinking`.
- Did not change Explore turn limits in this patch. In source, Explore has no agent-specific `maxTurns`; it uses the call parameter or global/project `defaultMaxTurns` when configured. The code default is unlimited.

## Commands run
- `npm run test -- test/agent-types.test.ts` — passed, 36 tests.
- `npm run typecheck` — passed.
- `npm run build` — passed.
- `./node_modules/.bin/biome check src/ test/` — passed, 37 files.

## Files changed
- `src/default-agents.ts`
- `test/agent-types.test.ts`
- `docs/agent/notes/2026-05-03-explore-thinking-medium.md`

## Tests
- Focused registry test passed.
- Typecheck and build passed.
- Direct Biome lint passed.

## Risks
- `Explore` runs may use more tokens/time than `low`, but less than `high`/`xhigh`.
- Turn-limit aborts may still happen if the active runtime default stays at 6 turns or the caller passes `max_turns: 6`.
- Rollback: remove `thinking: "medium"` from the `Explore` config and remove the matching test assertion.

## Next
Reload Pi extensions, then run an `Explore` smoke task and confirm the UI shows `thinking: medium`. If `max turns exceeded` continues, decide whether to set an agent-specific `maxTurns` for Explore or increase the runtime default in `/agents` settings.

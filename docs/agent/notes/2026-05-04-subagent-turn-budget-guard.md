# 2026-05-04 — Subagent turn budget guard

## Goal
Stop expensive subagent runs from reaching max-turn aborts with no usable output, especially broad `Explore` mapping tasks.

## Context
Recent Vindula `Explore`-style mapping runs aborted after ~60 tool uses and ~2M tokens with `No output.` The global default max-turn setting had been raised, but broad read-only agents still spent large token budgets and could ignore the soft wrap-up steer by continuing tool calls until hard abort.

## Decisions
- At the soft `max_turns` limit, the runner now disables all active tools before steering the agent to answer from gathered evidence.
- The runner restores the prior active tool set after that prompt finishes, so later `resume` calls are not permanently tool-less.
- Kept the existing grace-turn hard abort as a fallback if the model still fails to answer.
- Added an embedded `Explore` `maxTurns: 12` cap and prompt budget rules so local context mapping returns a partial Context Pack rather than chasing every branch.
- Left broader global defaults unchanged; projects can still eject/override `Explore` if they need a larger budget.

## Commands run
- `npm run test -- --run test/agent-runner.test.ts test/agent-types.test.ts`
- `npm run test`
- `npm run typecheck`
- `./node_modules/.bin/biome check src/ test/`
- `npm run lint` (failed in the harness with `ESLint output (JSON parse failed: EOF while parsing a value at line 1 column 0)`; direct Biome command passed)

## Files changed
- `src/agent-runner.ts`
- `src/default-agents.ts`
- `test/agent-runner.test.ts`
- `test/agent-types.test.ts`
- `README.md`
- `docs/agent/notes/2026-05-04-subagent-turn-budget-guard.md`

## Tests
- Added coverage that `runAgent` disables tools and steers at the soft turn limit.
- Added registry coverage for the `Explore` 12-turn cap.

## Risks
- `Explore` may stop earlier on very broad discovery prompts and report unknowns/follow-ups instead of fully mapping every area.
- Disabling all tools at the soft limit may surprise custom agents that expect to use tools during grace turns. The intended trade-off is lower cost and higher chance of a final answer.

## Next
Reload Pi/extensions before testing. Run a broad `Explore` smoke task and confirm it wraps as `steered` with a Context Pack instead of aborting with `No output`.

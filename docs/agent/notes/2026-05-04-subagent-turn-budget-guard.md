# 2026-05-04 — Subagent turn budget guard

## Goal
Stop expensive subagent runs from ending with no usable output, especially broad `Explore` mapping tasks and transport failures such as Pi/WebSocket errors.

## Context
Recent Vindula `Explore`-style mapping runs aborted after ~60 tool uses and ~2M tokens with `No output.` The core failure is not the turn budget itself; it is losing the final answer when the run aborts or the transport fails after spending the tokens. The global default max-turn setting had been raised, but broad read-only agents still spent large token budgets and could ignore the soft wrap-up steer by continuing tool calls until hard abort.

## Decisions
- At the soft `max_turns` limit, the runner now disables all active tools before steering the agent to answer from gathered evidence.
- The runner restores the prior active tool set after that prompt finishes, so later `resume` calls are not permanently tool-less.
- Kept the existing grace-turn hard abort as a fallback if the model still fails to answer.
- Added best-effort recovery output for empty results: if a run errors or aborts without final assistant text, the record now surfaces the error reason plus the latest tool-result evidence instead of `No output.`
- Increased embedded `Explore` to `maxTurns: 36` and prompt budget rules so local context mapping has more room while still returning a partial Context Pack rather than chasing every branch indefinitely.
- Left broader global defaults unchanged; projects can still eject/override `Explore` if they need a different budget.

## Commands run
- `npm run test -- --run test/agent-runner.test.ts test/agent-manager.test.ts test/agent-types.test.ts`
- `npm run test`
- `npm run typecheck`
- `./node_modules/.bin/biome check src/ test/`
- `npm run lint` (failed in the harness with `ESLint output (JSON parse failed: EOF while parsing a value at line 1 column 0)`; direct Biome command passed)

## Files changed
- `src/agent-runner.ts`
- `src/agent-manager.ts`
- `src/default-agents.ts`
- `src/index.ts`
- `test/agent-runner.test.ts`
- `test/agent-manager.test.ts`
- `test/agent-types.test.ts`
- `README.md`
- `docs/agent/notes/2026-05-04-subagent-turn-budget-guard.md`

## Tests
- Added coverage that `runAgent` disables tools and steers at the soft turn limit.
- Added coverage for best-effort recovery output from recent tool evidence.
- Added registry coverage for the `Explore` 36-turn cap.

## Risks
- `Explore` may still stop before fully mapping very broad prompts and report unknowns/follow-ups.
- Best-effort recovery is not a real final conclusion; it is a safety net that preserves evidence and the error reason when the model/transport never produced final text.
- Disabling all tools at the soft limit may surprise custom agents that expect to use tools during grace turns. The intended trade-off is lower cost and higher chance of a final answer.

## Next
Reload Pi/extensions before testing. Run a broad `Explore` smoke task and confirm it wraps as `steered` with a Context Pack instead of aborting with `No output`.

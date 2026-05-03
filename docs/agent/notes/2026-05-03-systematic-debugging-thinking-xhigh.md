# 2026-05-03 — Systematic Debugging thinking xhigh

## Goal
Make the default `Systematic Debugging` subagent run with `xhigh` thinking so root-cause debugging has enough reasoning depth by default.

## Context
A `Systematic Debugging` run appeared in the Pi UI as `thinking: low`. For root-cause diagnosis, low thinking is too shallow; the agent config should be authoritative so even callers that omit or pass a lower thinking value get `xhigh`.

## Decisions
- Set `thinking: "xhigh"` on the embedded `Systematic Debugging` default agent in `src/default-agents.ts`.
- Add a registry test assertion against `getAgentConfig("Systematic Debugging")?.thinking` so the default cannot silently regress.
- Keep caller code unchanged; ownership stays in the agent definition.

## Commands run
- `npm run test -- test/agent-types.test.ts` — passed, 36 tests.
- `npm run typecheck` — passed.
- `npm run build` — passed.
- `npm run lint` — failed in the local npm wrapper with `ESLint output (JSON parse failed: EOF while parsing a value at line 1 column 0)`.
- `./node_modules/.bin/biome check src/ test/` — passed, 37 files.

## Files changed
- `src/default-agents.ts`
- `test/agent-types.test.ts`
- `docs/agent/notes/2026-05-03-systematic-debugging-thinking-xhigh.md`

## Tests
- Focused registry test passed.
- Typecheck and build passed.
- Direct Biome lint passed; npm lint wrapper failed before producing Biome output.

## Risks
- `Systematic Debugging` runs may spend more tokens and time because `xhigh` is deeper than low/inherited defaults.
- Rollback: remove `thinking: "xhigh"` from the `Systematic Debugging` config and remove the matching test assertion.

## Next
Reload Pi extensions, then run a `Systematic Debugging` smoke task and confirm the UI shows `thinking: xhigh`.

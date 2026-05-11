# 2026-05-04 — Implement thinking high

## Goal
Make the default `Implement` subagent use `high` thinking instead of inheriting the runtime/model default (`medium` in the Pi UI).

## Context
`Implement` is defined as an embedded default agent in `pi-subagents-prisema`. Without an agent-specific `thinking` value, invocations inherit caller/runtime defaults, which can show as `thinking: medium`.

## Decisions
- Set `thinking: "high"` directly on the embedded `Implement` agent in `src/default-agents.ts`.
- Keep Taskdone and other callers unchanged so the default belongs to the global `Implement` agent definition.
- Add a focused registry assertion to prevent accidental removal.

## Commands run
- `npm run test -- test/agent-types.test.ts` from the Taskdone repo — failed because that repo has no `test` script.
- `npm --prefix /Users/rizzao/Projetos/MeusProjetos/pi-subagents-prisema run test -- test/agent-types.test.ts` — passed.
- `npm --prefix /Users/rizzao/Projetos/MeusProjetos/pi-subagents-prisema run typecheck` — passed.
- `npm --prefix /Users/rizzao/Projetos/MeusProjetos/pi-subagents-prisema run build` — passed.
- `npm --prefix /Users/rizzao/Projetos/MeusProjetos/pi-subagents-prisema run lint` — passed.

## Files changed
- `src/default-agents.ts`
- `test/agent-types.test.ts`
- `docs/agent/notes/2026-05-04-implement-thinking-high.md`

## Tests
- Focused Vitest suite: 37 passed.
- TypeScript typecheck passed.
- Build passed.
- Biome lint passed.

## Risks
- `Implement` calls may use more tokens/time than inherited/default medium.
- Rollback: remove `thinking: "high"` from the `Implement` config and remove the matching test assertion.

## Next
Reload Pi extensions, then launch an `Implement` smoke task and confirm the UI shows `thinking: high`.

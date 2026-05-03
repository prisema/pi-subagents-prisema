# 2026-05-03 — Explore abort root cause

## Goal
Understand why `Explore` subagents frequently abort with `No output` after many tool calls and high token usage.

## Context
A failing run in `pi-extension-prisema` showed:

- `✗ Explore integration points aborted`
- `31 tool uses · 473.6k token · 19.7s`
- `No output.`
- Transcript: `/var/folders/h6/nqb48vyd5zxbp41zvwf354840000gp/T/pi-subagents-502/Users-rizzao-Projetos-MeusProjetos-pi-extension-prisema/019defd9-a768-7287-8aa6-9a6746c7d7bf/tasks/23c23632-2871-47b.output`

## Decisions
- Investigated with the `Systematic Debugging` subagent.
- Kept repo code unchanged; this pass was diagnosis only.
- Treat the immediate cause as runtime settings, not broken output-file rendering.

## Commands run
- `Systematic Debugging` inspected the transcript file, settings files, `src/agent-runner.ts`, `src/index.ts`, `src/output-file.ts`, `src/settings.ts`, and `src/default-agents.ts`.
- Confirmed global settings file exists at `/Users/rizzao/.pi/agent/subagents.json` with `defaultMaxTurns: 12`.
- Confirmed no project override at `/Users/rizzao/Projetos/MeusProjetos/pi-extension-prisema/.pi/subagents.json`.

## Files changed
- `docs/agent/notes/2026-05-03-explore-abort-root-cause.md`

## Tests
No code changed. Evidence came from the failing transcript and source inspection.

## Root cause
The global setting `defaultMaxTurns: 12` applies to `Explore` because `Explore` has no agent-specific `maxTurns`. The runner sends a wrap-up steer at turn 12 and hard-aborts after `graceTurns` (default 5) if the agent keeps using tools. The failing transcript contains the turn-limit steer, then additional tool calls, then final `stopReason: "aborted"` with empty assistant content. UI correctly displayed `No output` because no final answer was produced before abort.

## Risks
- Raising or removing the global turn cap can increase token/cost exposure for runaway agents.
- Keeping the cap at 12 will keep causing broad `Explore` tasks to abort before a Context Pack.

## Next
Choose one:

1. Set `/Users/rizzao/.pi/agent/subagents.json` `defaultMaxTurns` to `0` for unlimited.
2. Set it to a safer high value like `40`.
3. Add an Explore-specific `maxTurns` policy in code so other agents can keep the lower global cap.

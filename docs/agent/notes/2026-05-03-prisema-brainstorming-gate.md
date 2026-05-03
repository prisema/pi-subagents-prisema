# Prisema brainstorming gate

## Goal
Add a lightweight Prisema version of Superpowers `brainstorming` to the subagents planning flow.

## Context
A Codex run loaded `superpowers:brainstorming` for a creative audio/game task. That workflow requires design/spec approval before implementation. Prisema already separates that lifecycle across `Explore` Context Packs, `Plan` approval-gated Taskdone artifacts, `Implement` scoped TDD execution, and `Review` evidence-driven validation.

## Decisions
- Embedded a Prisema Brainstorming Gate into the default `Plan` agent prompt.
- Kept `Plan` as controlled-write planning only; product code remains prohibited.
- Adapted the gate to Prisema defaults: context first, at most 2 blocking questions, 2-3 approaches with trade-offs, recommended path, then Taskdone plan/manifest approval.
- Kept trivial, already-approved, reversible edits lightweight instead of requiring formal spec approval.
- Documented the gate in the subagents README.

## Commands run
- `npm run typecheck`
- `npm test`
- `npm run build`
- `./node_modules/.bin/biome check src/ test/`

## Files changed
- `src/default-agents.ts`
- `test/prompts.test.ts`
- `README.md`
- `docs/agent/notes/2026-05-03-prisema-brainstorming-gate.md`

## Tests
- Typecheck passed.
- Vitest passed: 17 files, 315 tests.
- Build passed.
- Biome check passed.

## Risks
- Embedded Prisema subagent prompts take effect only after the package is updated/reloaded.
- Overly broad creative requests still depend on `Plan` decomposing scope well before writing Taskdone tasks.

## Next
- Keep the companion `prisema-brainstorming` skill in `pi-extension-prisema` aligned with this Plan prompt.

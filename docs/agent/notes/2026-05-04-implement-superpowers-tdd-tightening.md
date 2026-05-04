# Implement Superpowers TDD tightening

## Goal
Make the default `Implement` subagent more clearly behave as Prisema's general execution arm and tighten its Superpowers-style TDD discipline.

## Context
Prisema now wants `Implement` used more often for scoped one-off implementation tasks, not only Taskdone execution. The Prisema extension guidance was updated in `pi-extension-prisema`, but the actual `Implement` default prompt lives in this companion package.

## Decisions
- State that `Implement` is the default execution arm for scoped code changes, preserving the parent thread for context, decisions, and orchestration.
- Tighten feature/bugfix/behavior-change workflow with Superpowers-style TDD language: no production behavior code before a focused failing test exists and has been observed failing for the expected reason.
- Tell `Implement` to prefer real behavior tests over mocks and to reject tests that pass immediately or fail for the wrong reason.
- Keep practical exceptions for docs-only/config-only/generated/no-harness work, requiring explanation plus concrete verification.
- Update the Plan-generated Taskdone `extraInstructions` so Taskdone implementers inherit the stricter TDD expectation.
- Add prompt regression assertions for the new guidance.

## Commands run
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint` (failed in this Pi shell with `ESLint output (JSON parse failed: EOF while parsing a value at line 1 column 0)` before useful Biome output)
- `./node_modules/.bin/biome check src/ test/`
- `git diff --check`

## Files changed
- `src/default-agents.ts`
- `test/prompts.test.ts`
- `docs/agent/notes/2026-05-04-implement-superpowers-tdd-tightening.md`

## Tests
- `npm run typecheck` passed.
- `npm test` passed: 17 files, 323 tests.
- `npm run build` passed.
- Direct Biome check passed: 37 files checked, no fixes applied.
- `git diff --check` passed.

## Risks
- Stronger wording can make `Implement` slower on tasks where test harness is weak. Mitigated by explicit impractical-TDD exception with fallback evidence.
- More frequent use of `Implement` can increase subagent calls; parent guidance keeps truly trivial edits local.

## Next
Commit and push after review if clean.

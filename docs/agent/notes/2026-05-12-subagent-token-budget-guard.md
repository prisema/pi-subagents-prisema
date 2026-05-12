# 2026-05-12 — Subagent token budget guard

## Goal
Prevent `Systematic Debugging` from spending millions of tokens on one diagnosis.

## Context
A run showed ~4.0M tokens and 66 tool uses for a read-only inbox-freeze diagnosis. Existing control only capped turns (`48 + grace`) and did not stop high-token loops.

## Decisions
- Added agent-level `max_tokens` / `maxTokens`.
- At soft token budget, disable all active tools and steer final answer from gathered evidence.
- At ~120% of token budget, abort the run.
- Reduced default `Systematic Debugging` from `xhigh`/48 turns to `high`/24 turns with 350k token budget.
- Added prompt guidance: prefer 8–20 tool calls and stop with partial evidence instead of broad digging.
- Bumped package to `0.6.3-prisema.9` for release.

## Files changed
- `src/agent-runner.ts`
- `src/agent-manager.ts`
- `src/types.ts`
- `src/index.ts`
- `src/invocation-config.ts`
- `src/custom-agents.ts`
- `src/default-agents.ts`
- `src/ui/agent-widget.ts`
- `test/*.ts`
- `README.md`
- `CHANGELOG.md`

## Commands run
- `npm run typecheck` — pass
- `npm test -- --run test/agent-runner.test.ts test/agent-types.test.ts test/custom-agents.test.ts test/invocation-config.test.ts` — pass (4 files)
- `npm test` — pass (17 files)
- `npm run lint` — harness reported `ESLint output (JSON parse failed: EOF...)`; reran with clean env.
- `./node_modules/.bin/biome check src/ test/` — pass
- `git fetch origin` — pass
- `npm version 0.6.3-prisema.9 --no-git-tag-version` — pass
- `env -i PATH="$PATH" HOME="$HOME" npm run typecheck` — pass
- `env -i PATH="$PATH" HOME="$HOME" npm test` — pass (17 files, 333 tests)
- `env -i PATH="$PATH" HOME="$HOME" npm run lint` — pass
- `env -i PATH="$PATH" HOME="$HOME" npm run build` — pass
- `git diff --check` — pass

## Tests
- Added runner coverage for token budget steering.
- Added config parsing/resolution coverage for `max_tokens`.
- Updated default agent assertions for `Systematic Debugging` budget.

## Risks
- Token stats depend on `session.getSessionStats()` being available and current.
- A single huge tool result can still overshoot until next event; hard cap aborts after detection.
- Lower `Systematic Debugging` budget may return partial reports sooner.

## Rollback
Revert `maxTokens` runner support and restore `Systematic Debugging` to `thinking: xhigh`, `maxTurns: 48`, no token budget.

## Next
Run typecheck and focused tests.

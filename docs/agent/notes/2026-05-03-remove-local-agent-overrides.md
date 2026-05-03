# Remove local subagents repo agent override

## Goal
Keep `pi-subagents-prisema` free of project-local agent definitions so Prisema agent guidance stays centralized in `pi-extension-prisema`.

## Context
Prisema standard instructions now live in `pi-extension-prisema/agents/AGENTS.md`. A tracked `.pi/agents/auditor.md` in this repo added a project-local custom agent when working inside `pi-subagents-prisema`, which could make available agent lists and prompts diverge from the centralized Prisema setup.

## Decisions
- Removed the tracked `.pi/agents/auditor.md` project-local custom agent.
- Added `.pi/agents/` to `.gitignore` so local ad hoc agent overrides are not reintroduced in this repo.
- Kept embedded default agents in `src/default-agents.ts`; those are package functionality, not prompt-injected Prisema operating instructions.

## Commands run
- `rm -f .pi/agents/auditor.md`
- `rmdir .pi/agents .pi 2>/dev/null || true`
- `npm test`

## Files changed
- `.gitignore`
- `.pi/agents/auditor.md` removed
- `docs/agent/notes/2026-05-03-remove-local-agent-overrides.md`

## Tests
- `npm test` passed: 17 files, 319 tests.

## Risks
- Anyone relying on the repo-local `auditor` test agent will need to create it in their user-level or project-local setup outside version control.
- This does not remove default embedded subagent types; removing those would break extension behavior.

## Next
- Keep Prisema-wide AGENTS instructions and reusable skills in `pi-extension-prisema` only.

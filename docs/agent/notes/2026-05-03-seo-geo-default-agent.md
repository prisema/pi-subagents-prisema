# SEO/GEO default agent

## Goal
Move the Prisema marketing/SEO/GEO/AI-ready-site specialist into `pi-subagents-prisema` as a built-in default subagent instead of relying on a global custom agent.

## Context
A global custom agent existed at `/Users/rizzao/.pi/agent/agents/seo_geo_agent_search.md`. The user wants Prisema-standard subagents to live in `pi-subagents-prisema`, while global operating instructions remain centralized in `pi-extension-prisema`.

## Decisions
- Added default agent `SEO GEO Agent Search` with display name `SEO/GEO`.
- Preserved compatibility with the old custom type spelling: `seo_geo_agent_search` resolves to `SEO GEO Agent Search` through normalized type lookup.
- Kept write tools and all extension/skill access because SEO/GEO audits may need repo edits, web/browser/MCP checks, and content/media tooling.
- Preserved key guardrails from the global custom agent: no ranking guarantees, no invented product claims, llms.txt treated as emerging convention, external publication/DNS/Search Console actions require explicit user request.
- Updated Agent tool guidance, README, type constants, and tests.

## Commands run
- `npm run typecheck`
- `npm test`
- `npm run build`
- `./node_modules/.bin/biome check src/ test/`

## Files changed
- `src/default-agents.ts`
- `src/types.ts`
- `src/index.ts`
- `test/agent-types.test.ts`
- `test/prompts.test.ts`
- `README.md`
- `docs/agent/notes/2026-05-03-seo-geo-default-agent.md`

## Tests
- Typecheck passed.
- Vitest passed: 17 files, 321 tests.
- Build passed.
- Biome check passed.

## Risks
- The old global custom agent file can still appear as a custom agent until removed locally or Pi is reloaded after package update.
- `gpt-5.4` silently falls back to the parent model if unavailable, matching existing config-model behavior.

## Next
- Remove or archive `/Users/rizzao/.pi/agent/agents/seo_geo_agent_search.md` after confirming the built-in default is installed/reloaded.

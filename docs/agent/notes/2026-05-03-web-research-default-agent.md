# Web Research default agent

## Goal
Add a default subagent focused on Pi web access research so external/current context can be gathered and filtered outside the parent agent context.

## Context
`Explore` is intentionally local-first: repo discovery, FFF search, Context Packs, and read-only codebase mapping. The user asked whether internet research should stay as loose tools on the parent, be added to `Explore`, or live in a separate subagent. We chose a separate `Web Research` role so local context gathering and external web research stay focused and independently summarizable.

## Decisions
- Added default agent `Web Research`.
- Kept it read-only: built-in read/bash/grep/find/ls only, no edit/write.
- Allowed only Pi web access tools: `web_search`, `fetch_content`, `get_search_content`, and `code_search`.
- Prompt requires a concise Web Context Pack with sources, relevant findings, applicability, conflicts/uncertainty, ignored/out-of-scope material, and next action.
- Left `Explore` local-focused instead of giving it web tools.
- Updated Agent tool guidance, README, default names, and tests.

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
- `docs/agent/notes/2026-05-03-web-research-default-agent.md`

## Tests
- Typecheck passed.
- Vitest passed: 17 files, 323 tests.
- Build passed.
- Biome check passed.

## Risks
- If Pi web access tools are not installed, the agent may start with missing extension tools depending on runtime tool resolution. The prompt still clearly scopes its role and can report the missing capability.
- More explicit routing may create one more subagent hop for research-heavy tasks, but it keeps parent context cleaner.

## Next
- Keep `pi-extension-prisema/agents/AGENTS.md` routing in sync with `Web Research` for internet/current/external research.

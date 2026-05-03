# 2026-05-03 — Caveman/RTK impact on subagent results

## Goal
Verify whether `pi-caveman` and `pi-rtk-optimizer` affect what `pi-subagents-prisema` subagents return to the parent agent.

## Context
- Installed Pi packages include `npm:pi-caveman`, `git:github.com/MasuRii/pi-rtk-optimizer`, and `git:github.com/prisema/pi-subagents-prisema` in `~/.pi/agent/settings.json`.
- `pi-caveman` source: `/Users/rizzao/.npm-global/lib/node_modules/pi-caveman/extensions/caveman.ts`.
- `pi-rtk-optimizer` source: `/Users/rizzao/.pi/agent/git/github.com/MasuRii/pi-rtk-optimizer/src/index.ts` and `/Users/rizzao/.pi/agent/git/github.com/MasuRii/pi-rtk-optimizer/src/output-compactor.ts`.
- Subagent runtime source: `src/agent-runner.ts`, `src/index.ts`, `src/default-agents.ts`, and `src/prompts.ts`.
- Pi extension docs inspected: `/Users/rizzao/.npm-global/lib/node_modules/@mariozechner/pi-coding-agent/docs/extensions.md` and `docs/sdk.md`.

## Decisions
- `pi-caveman` affects subagent output style while the subagent is generating its final assistant message. It appends Caveman rules through `before_agent_start`; it does not post-process completed subagent results.
- `pi-rtk-optimizer` affects subagent tool execution and evidence context, not the final `Agent`/`get_subagent_result` payload directly. It rewrites subagent `bash` calls through `tool_call` and compacts `bash`, `read`, and `grep` tool results through `tool_result`.
- `Agent` tool results, background `<task-notification>` messages, and `get_subagent_result` outputs are not directly compacted by RTK because RTK only transforms `bash`, `read`, and `grep` tool results.
- Subagents load extensions unless `isolated: true` or the agent config sets `extensions: false`. The default specialized agents set `extensions` to the FFF tool allowlist, but the runtime still loads extensions and only filters active extension tools afterward; hook-only extensions like Caveman and RTK still run.
- `general-purpose` is especially likely to receive Caveman behavior because it uses `prompt_mode: append` and inherits the parent prompt; if the parent prompt already includes Caveman rules, the subagent can also get Caveman again from its own loaded extension hook.

## Commands run
- Read Pi docs: `extensions.md`, `sdk.md`.
- Read package settings: `~/.pi/agent/settings.json`.
- Read Caveman extension source.
- Read RTK extension source and output compactor.
- Read subagent source: `src/index.ts`, `src/agent-runner.ts`, `src/default-agents.ts`, `src/prompts.ts`, `src/custom-agents.ts`, `src/agent-types.ts`, `src/types.ts`.
- `grep -RIn "subagents:\|message_end\|agent_end\|tool_result\|before_agent_start\|tool_call" /Users/rizzao/.npm-global/lib/node_modules/pi-caveman /Users/rizzao/.pi/agent/git/github.com/MasuRii/pi-rtk-optimizer --exclude-dir=node_modules | head -200`
- `npm test`

## Files changed
- `docs/agent/notes/2026-05-03-caveman-rtk-subagent-results.md`

## Tests
- `npm test` passed: 17 tests.
- Static hook check: Caveman uses `before_agent_start`; RTK uses `tool_call`, `tool_result`, `tool_execution_*`, and `before_agent_start`; neither listens to `subagents:*` lifecycle events or `message_end`.

## Risks
- Caveman can improve token economy and parent readability, but may over-compress high-evidence outputs such as Context Packs, Root Cause Reports, plans, and reviews.
- RTK compaction can reduce noisy context, but lossy compaction/truncation may hide details from the subagent. Current config keeps read compaction disabled, so code reads remain exact by default.
- Because extension loading and active-tool filtering are separate, an agent configured with `extensions: fffind, ffgrep, fff-multi-grep` still receives global extension hooks.

## Next
- Keep both enabled if goal is lower context use and concise subagent handoff.
- Use `isolated: true` or `extensions: false` for a subagent that must avoid Caveman/RTK hooks.
- Temporarily run `/caveman off` when a subagent must produce fuller prose.
- Keep RTK `readCompaction.enabled = false` for coding tasks where exact file text matters.

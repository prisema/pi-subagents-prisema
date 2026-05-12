# Hide finished agent widget lines

## Goal
Remove the lingering `○ Agents` finished-agent row that appears after an Agent tool call completes, especially rows like `✓ ... (turn limit)`.

## Context
- The Agent tool already renders a final result block/notification.
- The persistent widget duplicated completion state by keeping finished agents visible briefly.
- Request was to remove the finished widget row shown in the screenshot.

## Decisions
- Keep the persistent widget for running/queued agents only.
- Make `markFinished()` a compatibility no-op so existing completion paths can keep calling it safely.
- Clear the widget immediately when no agents are running or queued.
- Add focused tests proving finished agents render no widget lines and the registered widget gets cleared.

## Files changed
- `src/ui/agent-widget.ts`
- `test/agent-widget.test.ts`
- `README.md`

## Commands run
- `npm run test -- agent-widget` — passed, 3 tests.
- `npm run typecheck` — passed.
- `./node_modules/.bin/biome check src/ test/` — passed.
- `npm run test` — passed, 18 files / 336 tests.
- `npm run build` — passed.

## Risks
- Users who liked seeing finished/error agents in the persistent widget lose that small linger view.
- Completion/error details still remain in Agent tool result blocks and background notifications.

## Rollback
Reintroduce finished-agent filtering/rendering in `AgentWidget.renderWidget()` and restore `markFinished()` state tracking.

## Next
If needed, add a user setting later for `showFinishedAgentsInWidget`, default `false`.

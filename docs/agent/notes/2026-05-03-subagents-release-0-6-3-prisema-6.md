# Subagents release 0.6.3-prisema.6

## Goal
Finalize the current Prisema subagents work with a version bump, commit, push, tag, and GitHub release.

## Context
Since `v0.6.3-prisema.5`, the default Prisema subagent set gained:
- Prisema Brainstorming Gate in `Plan`.
- Removal of the tracked repo-local `.pi/agents/auditor.md` override.
- `SEO GEO Agent Search` as a built-in default marketing/SEO/GEO/AI-ready-site agent.
- `Web Research` as a built-in default web access research agent.

## Decisions
- Bump package version from `0.6.3-prisema.5` to `0.6.3-prisema.6`.
- Record release highlights in `CHANGELOG.md`.
- Keep unrelated modified note `docs/agent/notes/2026-05-02-rename-prisema-subagents-repo.md` out of the release commit.

## Commands run
- `git fetch origin`
- `npm version 0.6.3-prisema.6 --no-git-tag-version`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `./node_modules/.bin/biome check src/ test/`
- `git diff --check`

## Files changed
- `package.json`
- `package-lock.json`
- `CHANGELOG.md`
- `docs/agent/notes/2026-05-03-subagents-release-0-6-3-prisema-6.md`

## Tests
- Typecheck passed.
- Vitest passed: 17 files, 323 tests.
- Build passed.
- Biome check passed.
- `git diff --check` passed.

## Risks
- Release tag should point at a green commit after validation.
- Existing local unrelated note remains uncommitted and should not be published by this release.

## Next
- Commit release files, push, tag, and create GitHub release.

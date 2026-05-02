# Rename subagents repo to pi-subagents-prisema

## Goal
Move the Prisema subagents extension away from the `pi-subagents-tintinweb` fork identity into a standalone Prisema repository: `prisema/pi-subagents-prisema`.

## Context
The repository had diverged from upstream with Prisema-specific defaults: `Explore`, `Plan`, `Implement`, `Review`, Taskdone planning contracts, FFF search integration, and Prisema release tags. The old GitHub repository `prisema/pi-subagents-tintinweb` is still marked as a fork, which is confusing for the now-Prisema-owned workflow.

## Decisions
- Rebranded the package as `@prisema/pi-subagents-prisema`.
- Updated repository, homepage, bugs, and media URLs to `https://github.com/prisema/pi-subagents-prisema`.
- Updated README install command to `pi install git:github.com/prisema/pi-subagents-prisema`.
- Kept the upstream MIT attribution in README.
- Bumped version to `0.6.3-prisema.2` for the standalone repo cut.
- Plan: create a new GitHub repo, set it as `origin`, remove the upstream fork remote, push `master`, tag, and release from the new repo.

## Commands run
- Edited `package.json`, `package-lock.json`, and `README.md`.
- `rg` checks for old repo/package references in the main metadata files.

## Files changed
- `package.json`
- `package-lock.json`
- `README.md`
- `docs/agent/notes/2026-05-02-rename-prisema-subagents-repo.md`

## Tests
- `npm run typecheck` passed.
- `npm test` passed: 17 files, 315 tests.
- `npm run build` passed.
- `./node_modules/.bin/biome check src/ test/` passed.

## Risks
- Existing installs from `git:github.com/prisema/pi-subagents-tintinweb` will keep using the old fork repo until updated.
- Old GitHub releases remain in the old fork repo unless separately migrated.
- The old fork is not archived or deleted by this change.

## Next
- Validate, commit, create `prisema/pi-subagents-prisema`, update remotes, push, tag, release.
- Update `pi-extension-prisema` managed extension source to the new repo.

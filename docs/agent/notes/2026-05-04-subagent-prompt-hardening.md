# Subagent prompt hardening

## Goal
Aplicar o lote seguro aprovado para os prompts default do `pi-subagents-prisema`: corrigir ambiguidade de leitura no `Explore`, bloquear stage/commit/push em agentes com escrita, fixar caps por papel, aceitar cache normal de validação no `Review`, e responder no idioma do usuário.

## Context
- Auditoria anterior: `docs/agent/notes/2026-05-04-subagent-prompt-audit.md`.
- Usuário aprovou:
  - `Implement`: proibir `git add`/commit/push sem pedido explícito.
  - `SEO GEO Agent Search`: mesma proibição.
  - Caps explícitos: Debug 48, Plan 48, Implement 40, Review 32, SEO 40.
- Usuário também concordou com minha decisão prática:
  - corrigir `Explore` `cat/head/tail`;
  - ajustar `Review` para cache normal de test/build;
  - adicionar resposta no idioma do usuário;
  - não mexer agora em `skills`, MCP/FFF, ou compactação do `Plan`.

## Decisions
- Mantive `extensions: FFF_SEARCH_TOOLS` nos agentes locais; não removi MCP amplo porque esses agentes já não tinham MCP amplo, só FFF allowlist.
- Mantive `skills: true`; mudança para `skills: false` ficou para validação futura.
- Não compacte o `Plan`; risco de afetar schema/qualidade do `taskdone.json`.
- Versão bump: `0.6.3-prisema.7`.

## Changes
- `Explore`: bash read-only não lista mais `cat/head/tail`; file content deve usar `read`.
- Todos agentes especializados: regra curta para responder no idioma do usuário.
- `Systematic Debugging`: `maxTurns: 48`.
- `SEO GEO Agent Search`: `maxTurns: 40`; proíbe stage/commit/push/branch switch sem pedido explícito.
- `Plan`: `maxTurns: 48`.
- `Implement`: `maxTurns: 40`; proíbe staging/committing/pushing sem assignment do parent.
- `Review`: `maxTurns: 32`; permite normal test/build cache artifacts sem edição intencional.
- README e changelog atualizados.
- Testes adicionados para caps e novas guardrails.

## Commands run
- `npm version 0.6.3-prisema.7 --no-git-tag-version`
- `rg`/`read`/`git diff` para inspeção.

## Files changed
- `src/default-agents.ts`
- `test/agent-types.test.ts`
- `test/prompts.test.ts`
- `README.md`
- `CHANGELOG.md`
- `package.json`
- `package-lock.json`
- `docs/agent/notes/2026-05-04-subagent-prompt-hardening.md`

## Tests
- `npm run test` — PASS, 16 test files / 311 tests.
- `npm run typecheck` — PASS.
- `./node_modules/.bin/biome check src/ test/` — PASS, 37 files checked.
- `env -i PATH="$PATH" HOME="$HOME" npm run prepublishOnly` — PASS: lint, typecheck, test, build. In this run, Vitest reported 17 files / 328 tests because ignored `dist/` build artifacts from the build workflow were present.
- `rm -rf dist && npm run test` — PASS again, 16 test files / 311 tests after removing ignored build artifacts.
- Note: plain `npm run lint` inside the current Pi shell env still hits the pre-existing local wrapper issue (`ESLint output (JSON parse failed...)`); clean env and direct Biome both pass.

## Risks
- Caps explícitos melhoram reprodutibilidade, mas podem cortar casos que antes dependiam do default global.
- Regra de idioma melhora PT-BR, mas artefatos técnicos continuam podendo precisar inglês/schema literal.
- Release GitHub precisa tag `v0.6.3-prisema.7` depois de validação green.

## Next
Rodar validação completa, atualizar esta nota, commit, push e criar GitHub release/tag.

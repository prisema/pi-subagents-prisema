# Subagent prompt audit

## Goal
Analisar todos os prompts padrão em `pi-subagents-prisema` para identificar sinergia, riscos de regressão, oportunidades de compactação, melhorias de produtividade, confiabilidade e processo.

## Context
- Repo: `/Users/rizzao/.pi/agent/git/github.com/prisema/pi-subagents-prisema`.
- Arquivo principal: `src/default-agents.ts`.
- Agentes padrão encontrados: `general-purpose`, `Explore`, `Web Research`, `Systematic Debugging`, `SEO GEO Agent Search`, `Plan`, `Implement`, `Review`, `Remove Slop`.
- O runner usa `promptMode: "replace"` para agentes especializados, com `noContextFiles: true`; isso significa que eles não herdam automaticamente o `AGENTS.md` do projeto. O agente `general-purpose` é exceção: usa `append` e herda o prompt do parent.
- Correções recentes no repo já mitigam o problema de subagents caros terminando sem saída: forced wrap-up at turn cap, best-effort output recovery, `Explore.maxTurns = 36`, `Web Research.maxTurns = 36`.

## Decisions

### Inventário e tamanho dos prompts

| Agent | Prompt chars | Lines | Words | Tools | Extensions | Max turns | Observação |
| --- | ---: | ---: | ---: | --- | --- | ---: | --- |
| `general-purpose` | 0 | 0 | 0 | all builtin | all | global | Parent twin; herda parent prompt. |
| `Explore` | 3,346 | 58 | 545 | read-only + bash | FFF | 36 | Bom Context Pack, read-only. |
| `Web Research` | 3,300 | 56 | 507 | read-only + bash | web tools | 36 | Bom Web Context Pack com fontes. |
| `Systematic Debugging` | 3,919 | 75 | 600 | read-only + bash | FFF | global | Forte root-cause workflow; falta cap explícito. |
| `SEO GEO Agent Search` | 5,489 | 79 | 740 | write tools | all | global | Especialista amplo; poder alto. |
| `Plan` | 8,260 | 124 | 1,157 | read + write/edit | FFF | global | Maior prompt; contrato Taskdone forte. |
| `Implement` | 2,882 | 46 | 441 | write tools | FFF | global | Bom TDD executor; falta proibição explícita de commit/stage/push. |
| `Review` | 2,081 | 39 | 315 | read-only + bash | FFF | global | Bom gate read-only; pode ter cap explícito menor. |
| `Remove Slop` | 3,139 | 60 | 495 | edit-only | FFF | 16 | Bom cleanup escopado; sem write. |

### Avaliação geral
- A cadeia está bem desenhada: `Explore`/`Web Research`/`Systematic Debugging` coletam evidência; `Plan` transforma decisão em Taskdone; `Implement` executa com TDD; `Review` valida; `Remove Slop` limpa.
- Os prompts especializados não herdam `AGENTS.md`, então precisam conter seus próprios guardrails críticos. A maioria já contém.
- O problema principal não é tamanho always-on, porque só um prompt especializado entra por subagent run. O maior prompt (`Plan`) é aceitável porque precisa gerar artifacts corretos e autocontidos.
- Melhorias relevantes são de precisão operacional: evitar ambiguidade de bash/read-only, limitar comportamento por agente, reduzir tool/s skill surface onde não agrega, e evitar subagents fazendo Git/commit sem autorização.

### Achados priorizados

| Prioridade | Achado | Risco | Melhoria sugerida |
| --- | --- | --- | --- |
| P1 | `Explore` permite em texto `cat/head/tail` em bash, mas depois manda usar `read` e não `cat/head/tail`. | Instrução contraditória; pode gastar tool calls ruins. | Remover `cat/head/tail` da lista de bash read-only e dizer `bash` só para `pwd`, `git status/log/diff`, comandos de inspeção sem escrita. |
| P1 | `Implement` não proíbe explicitamente `git add`, `git commit`, `git push`. | Subagent executor pode commitar/pushar fora da orquestração do parent. | Adicionar: “Do not stage, commit, push, or change branches unless explicitly assigned.” |
| P1 | `SEO GEO Agent Search` tem write tools + all extensions, mas também não proíbe Git commit/push. | Agente amplo pode fazer side effects locais/externos demais. | Adicionar proibição de stage/commit/push; considerar split futuro audit/read-only vs implement/write. |
| P1 | `Systematic Debugging`, `Plan`, `Implement`, `Review`, `SEO GEO` herdam default/global `maxTurns`. | Mudança global altera comportamento/reliability sem passar por prompt review. | Definir caps explícitos por papel: Debug 48, Plan 48, Implement 40, Review 24/32, SEO 40. |
| P1 | `Review` read-only pode rodar comandos de validação que geram caches/artefatos normais. | Conflito entre “não modificar arquivos” e tests/builds que escrevem cache. | Copiar nuance do Debugging: normal test/build cache may happen; do not intentionally write files. |
| P2 | `skills: true` em `Explore`, `Review`, `Remove Slop`, talvez `Systematic Debugging`. | Mais superfície/contexto/ferramentas do que precisa para papel local/autocontido. | Considerar `skills: false` nesses agentes ou skills listadas sob demanda; manter skills true para `Implement`, `Plan`, `Web Research`, `SEO`. |
| P2 | `Plan` prompt é grande, mas útil. | Custo por planejamento; difícil manter texto duplicado. | Compactar 15-25% mantendo schema Taskdone; extrair fragmentos compartilhados para manutenção sem remover schema runtime. |
| P2 | Prompts não dizem explicitamente para responder no idioma do usuário. | Subagents podem voltar em inglês em fluxo PT-BR. | Adicionar regra curta: “Respond in the user’s language unless artifact/code requires otherwise.” |
| P2 | Regras de notas obrigatórias vivem no parent AGENTS, mas agentes `replace` não herdam. | `Implement`/Taskdone pode terminar mudança sem nota se parent/task não pedir. | Fazer `Plan` incluir requisito de nota para tarefas não triviais, ou `Implement` criar nota apenas quando task/acceptance criteria pede. |
| P3 | Repetição de blocos Tool Usage/Output Rules entre prompts. | Drift de frase entre agentes. | Criar prompt fragments/testes de termos críticos para manutenção; runtime pode continuar inline. |

### Melhor pacote de mudanças pequenas
Se for implementar agora, o lote mais seguro é:
1. Remover contradição `cat/head/tail` em `Explore`.
2. Adicionar “do not stage/commit/push unless explicitly assigned” em `Implement` e `SEO GEO`.
3. Adicionar “respond in user language” em todos agentes especializados.
4. Adicionar caps explícitos: Debug 48, Plan 48, Implement 40, Review 32, SEO 40.
5. Ajustar `Review` para permitir caches normais de tests/builds sem intenção de escrita.
6. Adicionar/atualizar testes em `test/agent-types.test.ts` para travar essas decisões.

### Mudanças que eu não faria sem validação extra
- Trocar `skills: true` para `skills: false` em vários agentes: provável ganho de ruído, mas pode quebrar workflows que dependem de skills carregadas automaticamente.
- Splitar `SEO GEO Agent Search` em dois agentes: bom design, mas muda UX/nome mental.
- Compactar agressivamente `Plan`: risco de piorar qualidade do `taskdone.json`.

## Commands run
- `git status --short --branch`
- `python3` script over `src/default-agents.ts` to list agents, prompt sizes, tools, extensions, model/thinking/maxTurns/promptMode.
- `rg` over `src/default-agents.ts` for guardrail terms: `cat`, `head`, `tail`, `Bash ONLY`, `Never use write/edit`, `redirect`, `heredoc`, `maxTurns`, `skills: true`, `extensions: true`, `Output Format`, `Budget Rules`.
- `read` on `src/default-agents.ts`, `src/agent-runner.ts`, `src/prompts.ts`, `src/skill-loader.ts`, `test/agent-types.test.ts`, `README.md`.

## Files changed
- `docs/agent/notes/2026-05-04-subagent-prompt-audit.md`

## Tests
- `npm run test` — PASS, 16 test files / 310 tests.
- `npm run typecheck` — PASS.
- `./node_modules/.bin/biome check src/ test/` — PASS, 37 files checked.

## Risks
- Esta é uma auditoria de prompt/config; não executa subagents reais.
- Mudanças de prompt precisam de smoke test real em Pi depois de `/reload`, porque testes unitários só validam contrato estático.
- Turn caps explícitos melhoram reprodutibilidade, mas podem cortar tarefas que hoje dependem do default global 40/unlimited em outros ambientes.

## Next
1. Implementar o lote pequeno P1/P2 seguro, com testes.
2. Rodar suite estática.
3. Depois do reload Pi, fazer smoke test real com `Explore`, `Implement` dry/small, `Review`, e um caso de turn-limit recovery.

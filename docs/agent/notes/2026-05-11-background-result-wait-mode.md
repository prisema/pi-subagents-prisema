# Background result wait mode

## Goal

Bloquear o padrão em que o agente pai cria subagent em background, continua trabalhando, e usa o retorno caro só depois ou nem usa.

## Context

O usuário observou um caso em `vindulaworkflow`: um subagent read-only consumiu milhões de tokens diagnosticando, mas o agente pai já havia implementado antes do retorno. O problema não era o produto alvo, e sim o mecanismo do subagent permitir fire-and-forget por padrão.

## Decisions

- Novo modo persistente `backgroundResultMode` em `.pi/subagents.json` / `~/.pi/agent/subagents.json`.
- Default em runtime: `wait`.
- `Agent({ run_in_background: true })` continua podendo agendar execução concorrente, mas o tool call espera o subagent completar antes de retornar ao agente pai.
- Modo legado `async` permanece como opt-in explícito para casos raros.
- `get_subagent_result(wait: true)` agora também espera agentes `queued`, não só `running`.
- Tool description agora avisa que Prisema espera resultado por padrão.

## Files changed

- `src/index.ts`
- `src/settings.ts`
- `src/types.ts`
- `test/settings.test.ts`

## Commands run

```bash
npm ci
npm run typecheck
npm test -- test/settings.test.ts
```

## Tests

- TypeScript passou.
- `test/settings.test.ts`: 39 tests passaram.

## Risk / rollback

- Risco: workflows que dependiam de background assíncrono não retornam imediatamente por default.
- Mitigação: configurar `backgroundResultMode: "async"` explicitamente.
- Rollback: voltar default/ramo `run_in_background` para retorno imediato e remover setting.

## Next

Rodar suíte completa antes de publicar release.

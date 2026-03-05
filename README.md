# opencode-refactor-agent

Plugin do OpenCode que adiciona um terceiro agente primário chamado `refactor` sem substituir os agentes padrão (`build` e `plan`).

## Como o agente `refactor` funciona

Quando você seleciona o agente `refactor` (via TAB em `/agents` ou `--agent refactor`) e envia um prompt, o OpenCode:

1. Faz uma etapa de análise estilo review primeiro (sem editar código).
2. Lista melhorias de refatoração priorizadas por risco/impacto.
3. Exibe um menu interativo de decisão antes de editar qualquer arquivo.
4. Faz perguntas objetivas se houver ambiguidade.
5. Só aplica mudanças depois de confirmação explícita do usuário.
6. Mantém `build` e `plan` intactos; o plugin só adiciona `refactor` e o comando `/refactor`.

Na prática, ele tende a:

- Entregar diagnóstico antes de execução.
- Exibir menu de opções no idioma do usuário quando possível (fallback para inglês).
- Fazer refactors pequenos e revisáveis, após aprovação.
- Reaproveitar padrões já existentes no projeto.
- Evitar quebra de API/contrato externo sem pedido explícito.
- Rodar validações (testes/lint/typecheck) quando fizer sentido no contexto.

Importante: este plugin não cria um executor separado. Ele configura um agente primário com prompt especializado de refatoração. O resultado ainda depende do seu pedido, do contexto e das permissões/tools ativas no OpenCode.

### Comando `/refactor`

O plugin também adiciona o comando `/refactor`, que roteia o prompt para o agente `refactor` com um template focado em refatoração.

Exemplo:

```text
/refactor src/services/user
```

Isso instrui o OpenCode a tratar esse escopo como tarefa de refatoração segura.

### Variants de refatoração

O plugin adiciona 3 variants iniciais para o modo `refactor`:

- `legibility`: foca em clareza, legibilidade e redução de carga cognitiva.
- `performance`: foca em otimização segura de hotspots e operações custosas.
- `maintainability`: foca em modularidade, reuso e facilidade de evolução.

Comandos disponíveis:

```text
/refactor <escopo>
/refactor-legibility <escopo>
/refactor-performance <escopo>
/refactor-maintainability <escopo>
```

Se nenhuma variant for informada, o comportamento padrão é `maintainability`.

## Instalação (forma comum)

Depois de publicar no npm:

```bash
npx opencode-refactor-agent@latest install
```

Isso adiciona `opencode-refactor-agent@latest` no `~/.config/opencode/opencode.json` dentro do campo `plugin`.

## Instalação direto do GitHub (sem npm)

Se você ainda não publicou no npm, qualquer pessoa pode instalar direto do repositório:

```bash
npx --yes --package "github:OWNER/REPO" opencode-refactor-agent install "github:OWNER/REPO"
```

Exemplo:

```bash
npx --yes --package "github:yuriramosdasilva/opencode-refactor-agent" opencode-refactor-agent install "github:yuriramosdasilva/opencode-refactor-agent"
```

Esse comando também atualiza o `~/.config/opencode/opencode.json` global do usuário.

## Validação

```bash
opencode agent list
```

Você deve ver `refactor (primary)` junto com `build` e `plan`.

Você também pode validar detalhes do agente:

```bash
opencode debug agent refactor
```

## Remoção

```bash
npx opencode-refactor-agent@latest uninstall
```

## Publicação

```bash
bun install
npm publish --access public
```

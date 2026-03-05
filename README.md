# opencode-refactor-agent

Plugin do OpenCode que adiciona um agente primário `refactor` e o comando `/refactor`.

## Installation

```bash
npx opencode-refactor-agent@latest install
```

Isso adiciona `opencode-refactor-agent@latest` ao seu `~/.config/opencode/opencode.json`.

## Usage

Depois da instalação, rode:

```bash
opencode agent list
```

Você deve ver o agente `refactor` junto com `build` e `plan`.

Comandos disponíveis:

```text
/refactor <scope>
/refactor-legibility <scope>
/refactor-performance <scope>
/refactor-maintainability <scope>
```

## Manual config

Você também pode adicionar manualmente no `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-refactor-agent@latest"]
}
```

## Uninstall

```bash
npx opencode-refactor-agent@latest uninstall
```

## License

MIT

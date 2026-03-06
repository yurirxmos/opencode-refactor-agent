# opencode-refactor-agent

Add a safe `refactor` primary agent to OpenCode without replacing `build` or `plan`.

## Why use this

- Review-first workflow: analyze before editing.
- Safer changes: asks for explicit confirmation before applying refactors.
- Better focus: choose `legibility`, `performance`, or `maintainability`.
- Keeps behavior stable: designed for low-risk, incremental improvements.

## Refactor vs Build

- Use `refactor` when you want to improve code quality without changing features.
- Use `build` when you want to implement or change functionality directly.

## Installation

```bash
npx opencode-refactor-agent@latest install
```

Important: `npm install opencode-refactor-agent` or `bun add opencode-refactor-agent` only installs the package.
It does not configure OpenCode automatically.
Run `npx opencode-refactor-agent@latest install` (or `bunx opencode-refactor-agent@latest install`) to enable the plugin.

This adds `opencode-refactor-agent@latest` to `~/.config/opencode/opencode.json`.

## Quick start

Check that the agent is available:

```bash
opencode agent list
```

You should see `refactor (primary)` together with `build` and `plan`.

Run your first refactor:

```text
/refactor src/services/user
```

## Commands

```text
/refactor <scope>
/refactor-legibility <scope>
/refactor-performance <scope>
/refactor-maintainability <scope>
```

## Manual config

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

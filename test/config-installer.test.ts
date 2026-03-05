import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "bun:test";
import { parse } from "jsonc-parser";
import {
  installPluginGlobally,
  normalizePackageName,
  uninstallPluginGlobally,
} from "../src/configInstaller";

const temporaryDirectories: string[] = [];

function createTempConfigPath(): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "opencode-refactor-agent-test-"));
  temporaryDirectories.push(directory);
  return path.join(directory, "opencode.json");
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0, temporaryDirectories.length)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("normalizePackageName", () => {
  it("normalizes unscoped and scoped package specs", () => {
    expect(normalizePackageName("opencode-refactor-agent@latest")).toBe("opencode-refactor-agent");
    expect(normalizePackageName("@scope/refactor-plugin@1.2.3")).toBe("@scope/refactor-plugin");
  });
});

describe("installPluginGlobally", () => {
  it("creates config file and adds plugin when file does not exist", () => {
    const configPath = createTempConfigPath();

    installPluginGlobally({
      configPath,
      pluginSpec: "opencode-refactor-agent@latest",
    });

    const content = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(content) as { $schema: string; plugin: string[] };

    expect(parsed.$schema).toBe("https://opencode.ai/config.json");
    expect(parsed.plugin).toEqual(["opencode-refactor-agent@latest"]);
  });

  it("updates existing plugin version without duplication", () => {
    const configPath = createTempConfigPath();
    fs.writeFileSync(
      configPath,
      `{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-refactor-agent@0.1.0", "opencode-gemini-auth@latest"]
}
`,
      "utf8",
    );

    installPluginGlobally({
      configPath,
      pluginSpec: "opencode-refactor-agent@latest",
    });

    const content = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(content) as { plugin: string[] };

    expect(parsed.plugin).toEqual([
      "opencode-refactor-agent@latest",
      "opencode-gemini-auth@latest",
    ]);
  });

  it("supports JSONC config with comments", () => {
    const configPath = createTempConfigPath();
    fs.writeFileSync(
      configPath,
      `{
  // user config
  "plugin": ["opencode-gemini-auth@latest"]
}
`,
      "utf8",
    );

    installPluginGlobally({
      configPath,
      pluginSpec: "opencode-refactor-agent@latest",
    });

    const content = fs.readFileSync(configPath, "utf8");
    const parsed = parse(content) as { plugin: string[] };
    expect(parsed.plugin).toEqual([
      "opencode-gemini-auth@latest",
      "opencode-refactor-agent@latest",
    ]);
  });
});

describe("uninstallPluginGlobally", () => {
  it("removes plugin from plugin array and preserves others", () => {
    const configPath = createTempConfigPath();
    fs.writeFileSync(
      configPath,
      `{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-refactor-agent@latest", "opencode-gemini-auth@latest"]
}
`,
      "utf8",
    );

    uninstallPluginGlobally({
      configPath,
      pluginName: "opencode-refactor-agent",
    });

    const content = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(content) as { plugin: string[] };

    expect(parsed.plugin).toEqual(["opencode-gemini-auth@latest"]);
  });
});

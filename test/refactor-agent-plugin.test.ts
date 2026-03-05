import { describe, expect, it } from "bun:test";
import { applyRefactorAgentConfig, type MutableConfig } from "../src/refactorConfig";

describe("applyRefactorAgentConfig", () => {
  it("adds a primary refactor agent and /refactor command", () => {
    const config: MutableConfig = {
      agent: {
        build: { mode: "primary", description: "Build agent" },
        plan: { mode: "primary", description: "Plan agent" },
      },
    };

    applyRefactorAgentConfig(config);

    expect(config.agent?.build).toEqual({ mode: "primary", description: "Build agent" });
    expect(config.agent?.plan).toEqual({ mode: "primary", description: "Plan agent" });
    expect(config.agent?.refactor?.mode).toBe("primary");
    expect(config.command?.refactor?.agent).toBe("refactor");
    expect(config.command?.["refactor-legibility"]?.agent).toBe("refactor");
    expect(config.command?.["refactor-performance"]?.agent).toBe("refactor");
    expect(config.command?.["refactor-maintainability"]?.agent).toBe("refactor");
  });

  it("does not overwrite an existing refactor agent custom fields", () => {
    const config: MutableConfig = {
      agent: {
        refactor: {
          mode: "primary",
          description: "Custom refactor agent",
          prompt: "Custom prompt",
          color: "accent",
        },
      },
    };

    applyRefactorAgentConfig(config);

    expect(config.agent?.refactor).toMatchObject({
      mode: "primary",
      description: "Custom refactor agent",
      prompt: "Custom prompt",
      color: "accent",
    });
    expect((config.agent?.refactor as Record<string, unknown>).permission).toEqual({
      question: "allow",
    });
  });

  it("does not overwrite an existing /refactor command", () => {
    const config: MutableConfig = {
      command: {
        refactor: {
          description: "Custom command",
          agent: "refactor",
          template: "Do custom refactor: $ARGUMENTS",
        },
      },
    };

    applyRefactorAgentConfig(config);

    expect(config.command?.refactor).toEqual({
      description: "Custom command",
      agent: "refactor",
      template: "Do custom refactor: $ARGUMENTS",
    });
  });

  it("does not overwrite an existing variant command", () => {
    const config: MutableConfig = {
      command: {
        "refactor-performance": {
          description: "Custom performance command",
          agent: "refactor",
          template: "Performance only: $ARGUMENTS",
        },
      },
    };

    applyRefactorAgentConfig(config);

    expect(config.command?.["refactor-performance"]).toEqual({
      description: "Custom performance command",
      agent: "refactor",
      template: "Performance only: $ARGUMENTS",
    });
  });
});

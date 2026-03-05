import type { Plugin } from "@opencode-ai/plugin";
import { applyRefactorAgentConfig, type MutableConfig } from "./refactorConfig.js";

export const RefactorAgentPlugin: Plugin = async () => ({
  config: async (config) => {
    applyRefactorAgentConfig(config as MutableConfig);
  },
});

export default RefactorAgentPlugin;

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { loadConfig, saveConfig, configExists } from "../src/core/config/index.js";
import { homedir } from "node:os";
import { join } from "node:path";
import { rmSync } from "node:fs";

const TEST_CONFIG = join(homedir(), ".soulforge", "config.json");

describe("config", () => {
  beforeEach(() => {
    try {
      rmSync(TEST_CONFIG);
    } catch {}
  });

  afterEach(() => {
    try {
      rmSync(TEST_CONFIG);
    } catch {}
  });

  it("returns null when no config exists", () => {
    expect(loadConfig()).toBeNull();
    expect(configExists()).toBe(false);
  });

  it("saves and loads config", () => {
    const config = {
      provider: "anthropic",
      model: "claude-sonnet-4",
      apiKey: "test",
      theme: "dark" as const,
    };
    saveConfig(config);
    expect(configExists()).toBe(true);
    expect(loadConfig()).toEqual(config);
  });
});

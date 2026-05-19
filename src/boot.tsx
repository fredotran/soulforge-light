#!/usr/bin/env bun

import { loadConfig, configExists, setTheme } from "./core/config/index.js";
import { useSessionStore } from "./stores/session.js";

const cliArgs = process.argv.slice(2);

// Headless mode
if (cliArgs.includes("--headless")) {
  const { runHeadless } = await import("./headless/index.js");
  await runHeadless(cliArgs);
  process.exit(0);
}

// Simple CLI flags
if (cliArgs.includes("--version") || cliArgs.includes("-v")) {
  console.log("soulforge-light 1.0.0");
  process.exit(0);
}

if (cliArgs.includes("--help") || cliArgs.includes("-h")) {
  console.log(`soulforge-light — Lightweight terminal AI coding assistant

Usage:
  soulforge                    Start TUI
  soulforge --headless "msg"   Run a single prompt
  soulforge --headless --chat  Interactive headless chat
  soulforge --version          Show version
  soulforge --help             Show this help
`);
  process.exit(0);
}

// Load config and theme
const config = loadConfig();
if (config) {
  setTheme(config.theme);
} else {
  setTheme("dark");
}

// Wizard or main app
if (!configExists()) {
  // Show wizard — we'll need to handle this in the TUI
  // For now, create a default tab and let the user configure later
  useSessionStore.getState().loadSessions();
} else {
  useSessionStore.getState().loadSessions();
}

// Import and render App
const { createCliRenderer } = await import("@opentui/core");
const { createRoot } = await import("@opentui/react");
const { App } = await import("./components/App.js");
const { start } = await import("./index.js");

await start({
  App,
  createCliRenderer,
  createRoot,
});

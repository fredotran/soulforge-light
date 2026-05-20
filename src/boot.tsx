#!/usr/bin/env bun

const args = process.argv.slice(2);

if (args.includes("--version") || args.includes("-v")) {
  process.stdout.write("soulforge-light 1.0.0\n");
  process.exit(0);
}

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write(`soulforge-light — Lightweight CLI AI coding agent

Usage:
  soulforge                      Interactive CLI chat (default)
  soulforge "prompt"             Run a single prompt and exit
  soulforge --model <model>      Override model (e.g. claude-sonnet-4-20250514)
  soulforge --system "prompt"    Override system prompt
  soulforge --tui                Launch full TUI mode
  soulforge --version            Show version
  soulforge --help               Show this help
`);
  process.exit(0);
}

if (args.includes("--tui")) {
  const { loadConfig } = await import("./core/config/index.js");
  const { setTheme } = await import("./core/theme/index.js");
  const { useSessionStore } = await import("./stores/session.js");

  const config = loadConfig();
  setTheme(config?.theme ?? "dark");
  useSessionStore.getState().loadSessions();

  const { createCliRenderer } = await import("@opentui/core");
  const { createRoot } = await import("@opentui/react");
  const { App } = await import("./components/App.js");
  const { start } = await import("./index.js");

  await start({ App, createCliRenderer, createRoot });
} else {
  const { runCLI } = await import("./cli/index.js");

  let prompt: string | undefined;
  let model: string | undefined;
  let systemOverride: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i] ?? "";
    const next = args[i + 1];
    if (arg === "--model" && next) {
      model = next;
      i++;
    } else if (arg === "--system" && next) {
      systemOverride = next;
      i++;
    } else if (arg === "--headless" && next && !next.startsWith("--")) {
      prompt = next;
      i++;
    } else if (!arg.startsWith("--")) {
      prompt = arg;
    }
  }

  const isChat = !prompt || args.includes("--chat");

  await runCLI({ prompt, chat: isChat, model, systemOverride });
}

import type { createCliRenderer as CreateCliRenderer } from "@opentui/core";
import type { createRoot as CreateRoot } from "@opentui/react";
import type { App as AppComponent } from "./components/App.js";

let renderer: Awaited<ReturnType<typeof CreateCliRenderer>> | null = null;

export function cleanupAndExit(code = 0): void {
  try {
    renderer?.destroy();
  } catch {}
  process.exit(code);
}

process.on("SIGINT", () => cleanupAndExit(0));
process.on("SIGTERM", () => cleanupAndExit(0));

process.on("uncaughtException", (err) => {
  process.stderr.write(`\nError: ${err?.message ?? String(err)}\n`);
  cleanupAndExit(1);
});

interface StartOptions {
  App: typeof AppComponent;
  createCliRenderer: typeof CreateCliRenderer;
  createRoot: typeof CreateRoot;
}

export async function start(opts: StartOptions): Promise<void> {
  const r = await opts.createCliRenderer({
    exitOnCtrlC: false,
    useKittyKeyboard: { disambiguate: true },
    externalOutputMode: "passthrough",
    targetFps: 60,
  });
  renderer = r;

  r.setMaxListeners(30);
  r.keyInput.setMaxListeners(30);

  try {
    r.setTerminalTitle("SoulForge Light");
  } catch {}

  opts.createRoot(r).render(<opts.App />);
}

import { runAgentStream } from "../core/agent.js";
import { loadConfig } from "../core/config/index.js";

export async function runHeadless(args: string[]) {
  const config = loadConfig();
  if (!config) {
    // biome-ignore lint/suspicious/noConsole: CLI error output
    console.error("No config found. Run `soulforge` to set up.");
    process.exit(1);
  }

  const promptIndex = args.indexOf("--headless") + 1;
  const prompt = args[promptIndex] ?? "";

  if (!prompt && !args.includes("--chat")) {
    // biome-ignore lint/suspicious/noConsole: CLI error output
    console.error("Usage: soulforge --headless 'prompt'");
    process.exit(1);
  }

  if (args.includes("--chat")) {
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.log("SoulForge Light — Headless Chat Mode");
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.log("Type 'quit' to exit.\n");

    const messages: { role: "user" | "assistant"; content: string }[] = [];

    for await (const line of console) {
      if (line === "quit") break;
      messages.push({ role: "user", content: line });

      process.stdout.write("🤖 ");
      let fullText = "";

      await runAgentStream(
        config.provider,
        config.model,
        config.apiKey,
        messages.map((m) => ({
          ...m,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        })),
        {
          onTextChunk: (chunk) => {
            process.stdout.write(chunk);
            fullText += chunk;
          },
          onToolCall: () => {},
          onToolResult: () => {},
          onFinish: () => {
            // biome-ignore lint/suspicious/noConsole: CLI output
            console.log("\n");
            messages.push({ role: "assistant", content: fullText });
          },
        },
      );
    }
  } else {
    const messages = [
      {
        role: "user" as const,
        content: prompt,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
    ];

    await runAgentStream(config.provider, config.model, config.apiKey, messages, {
      onTextChunk: (chunk) => process.stdout.write(chunk),
      onToolCall: () => {},
      onToolResult: () => {},
      onFinish: () => {
        // biome-ignore lint/suspicious/noConsole: CLI output
        console.log("");
      },
    });
  }
}

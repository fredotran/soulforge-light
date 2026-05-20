import type { ModelMessage } from "ai";
import { runAgent } from "../core/agent.js";
import { loadConfig } from "../core/config/index.js";
import { buildSystemPrompt } from "../core/system-prompt.js";
import { c, styled, truncate } from "./format.js";

function die(msg: string): never {
  process.stderr.write(`${styled("error", c.red, c.bold)}: ${msg}\n`);
  process.exit(1);
}

function printHeader(model: string) {
  process.stdout.write(
    `${styled("SoulForge Light", c.bold, c.cyan)} ${styled("v1.0.0", c.dim)}\n` +
      `${styled("Model:", c.dim)} ${model}\n` +
      `${styled("CWD:", c.dim)}   ${process.cwd()}\n` +
      `${styled('Type "exit" or Ctrl+C to quit.', c.dim)}\n\n`,
  );
}

function formatToolArgs(args: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(args)) {
    const val = typeof v === "string" ? v : JSON.stringify(v);
    parts.push(`${k}=${truncate(String(val), 60)}`);
  }
  return parts.join(", ");
}

function formatToolResult(result: unknown): string {
  if (result === null || result === undefined) return "(empty)";
  const str = typeof result === "string" ? result : JSON.stringify(result);
  return truncate(str, 300);
}

async function runOnce(
  provider: string,
  model: string,
  apiKey: string,
  systemPrompt: string,
  messages: ModelMessage[],
): Promise<void> {
  let hasText = false;

  await runAgent({
    provider,
    model,
    apiKey,
    systemPrompt,
    messages,
    callbacks: {
      onTextDelta: (text) => {
        if (!hasText) hasText = true;
        process.stdout.write(text);
      },
      onToolCall: (name, args) => {
        if (hasText) {
          process.stdout.write("\n");
          hasText = false;
        }
        process.stdout.write(
          `  ${styled("▸", c.cyan)} ${styled(name, c.cyan, c.bold)} ${styled(formatToolArgs(args), c.dim)}\n`,
        );
      },
      onToolResult: (name, result) => {
        const display = formatToolResult(result);
        process.stdout.write(
          `  ${styled("◂", c.green)} ${styled(name, c.green)} ${styled(display, c.dim)}\n`,
        );
      },
      onStepFinish: () => {},
      onFinish: () => {
        if (hasText) process.stdout.write("\n");
      },
      onError: (err) => {
        process.stderr.write(`\n${styled("Error:", c.red, c.bold)} ${err.message}\n`);
      },
    },
  });
}

export interface CLIOptions {
  prompt?: string;
  chat?: boolean;
  model?: string;
  systemOverride?: string;
}

export async function runCLI(opts: CLIOptions): Promise<void> {
  const config = loadConfig();
  if (!config) die("No config found. Run `soulforge --tui` to set up.");

  const provider = config.provider;
  const model = opts.model ?? config.model;
  const apiKey = config.apiKey;
  const cwd = process.cwd();
  const systemPrompt = opts.systemOverride ?? buildSystemPrompt(cwd);

  if (opts.prompt && !opts.chat) {
    const messages: ModelMessage[] = [{ role: "user", content: opts.prompt }];
    await runOnce(provider, model, apiKey, systemPrompt, messages);
    return;
  }

  printHeader(`${provider}/${model}`);

  const messages: ModelMessage[] = [];

  for await (const line of console) {
    const input = line.trim();
    if (!input) continue;
    if (input === "exit" || input === "quit") break;

    messages.push({ role: "user", content: input });

    process.stdout.write(`\n${styled("●", c.magenta)} `);

    let assistantText = "";
    await runAgent({
      provider,
      model,
      apiKey,
      systemPrompt,
      messages,
      callbacks: {
        onTextDelta: (text) => {
          assistantText += text;
          process.stdout.write(text);
        },
        onToolCall: (name, args) => {
          process.stdout.write(
            `\n  ${styled("▸", c.cyan)} ${styled(name, c.cyan, c.bold)} ${styled(formatToolArgs(args), c.dim)}`,
          );
        },
        onToolResult: (name, result) => {
          const display = formatToolResult(result);
          process.stdout.write(
            `\n  ${styled("◂", c.green)} ${styled(name, c.green)} ${styled(display, c.dim)}`,
          );
        },
        onStepFinish: () => {},
        onFinish: () => {
          process.stdout.write("\n\n");
        },
        onError: (err) => {
          process.stderr.write(`\n${styled("Error:", c.red, c.bold)} ${err.message}\n\n`);
        },
      },
    });

    if (assistantText) {
      messages.push({ role: "assistant", content: assistantText });
    }
  }
}

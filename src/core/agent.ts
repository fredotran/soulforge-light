import { createAnthropic } from "@ai-sdk/anthropic";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import { createOpenAI } from "@ai-sdk/openai";
import type { ModelMessage } from "ai";
import { stepCountIs, streamText } from "ai";
import { tools } from "./tools/index.js";

const providerMap: Record<string, (config: { apiKey: string }) => unknown> = {
  anthropic: createAnthropic,
  openai: createOpenAI,
  google: createGoogleGenerativeAI,
  groq: createGroq,
  mistral: createMistral,
  deepseek: createDeepSeek,
};

export interface AgentCallbacks {
  onTextDelta: (text: string) => void;
  onToolCall: (name: string, args: Record<string, unknown>) => void;
  onToolResult: (name: string, result: unknown) => void;
  onStepFinish: (stepNumber: number) => void;
  onFinish: () => void;
  onError: (error: Error) => void;
}

export interface AgentOptions {
  provider: string;
  model: string;
  apiKey: string;
  systemPrompt: string;
  messages: ModelMessage[];
  maxSteps?: number;
  callbacks: AgentCallbacks;
}

function buildToolMap() {
  const aiTools: Record<string, unknown> = {};
  for (const t of tools) {
    aiTools[t.name] = {
      description: t.description,
      inputSchema: t.parameters,
      execute: t.execute,
    };
  }
  return aiTools;
}

function createModel(providerName: string, modelName: string, apiKey: string) {
  const create = providerMap[providerName];
  if (!create) throw new Error(`Unknown provider: ${providerName}`);
  const provider = create({ apiKey });
  // biome-ignore lint/suspicious/noExplicitAny: provider factory typing
  return (provider as any)(modelName);
}

export async function runAgent(opts: AgentOptions): Promise<void> {
  const model = createModel(opts.provider, opts.model, opts.apiKey);
  const aiTools = buildToolMap();

  const result = streamText({
    model,
    system: opts.systemPrompt,
    messages: opts.messages,
    // biome-ignore lint/suspicious/noExplicitAny: heterogeneous tool map
    tools: aiTools as any,
    stopWhen: stepCountIs(opts.maxSteps ?? 25),
    onStepFinish: (event) => {
      opts.callbacks.onStepFinish(event.stepNumber);
    },
  });

  try {
    for await (const part of result.fullStream) {
      switch (part.type) {
        case "text-delta":
          opts.callbacks.onTextDelta(part.text);
          break;
        case "tool-call":
          opts.callbacks.onToolCall(
            part.toolName,
            (part as Record<string, unknown>).input as Record<string, unknown>,
          );
          break;
        case "tool-result":
          opts.callbacks.onToolResult(part.toolName, (part as Record<string, unknown>).output);
          break;
      }
    }
    opts.callbacks.onFinish();
  } catch (err) {
    opts.callbacks.onError(err instanceof Error ? err : new Error(String(err)));
  }
}

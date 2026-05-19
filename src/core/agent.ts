import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText, type CoreTool } from "ai";
import { tools } from "./tools/index.js";
import type { Message } from "../types/index.js";

const providerMap: Record<string, (config: { apiKey: string }) => unknown> = {
  anthropic: createAnthropic,
  openai: createOpenAI,
  google: createGoogleGenerativeAI,
  groq: createGroq,
  mistral: createMistral,
  deepseek: createDeepSeek,
};

interface AgentCallbacks {
  onTextChunk: (chunk: string) => void;
  onToolCall: (name: string, args: Record<string, unknown>) => void;
  onToolResult: (name: string, result: unknown) => void;
  onFinish: (text: string) => void;
}

export async function runAgentStream(
  providerName: string,
  modelName: string,
  apiKey: string,
  messages: Message[],
  callbacks: AgentCallbacks,
) {
  const create = providerMap[providerName];
  if (!create) throw new Error(`Unknown provider: ${providerName}`);

  const provider = create({ apiKey });
  // biome-ignore lint/suspicious/noExplicitAny: provider factory returns any
  const model = (provider as any)(modelName);

  const aiTools: Record<string, CoreTool> = {};
  for (const tool of tools) {
    aiTools[tool.name] = {
      description: tool.description,
      parameters: tool.parameters,
      execute: tool.execute,
    } as CoreTool;
  }

  const result = streamText({
    model,
    system:
      "You are SoulForge Light, a helpful coding assistant. You have access to tools for reading and editing files, running shell commands, and using git. Be concise. Always think step by step.",
    messages: messages.map((m) => ({
      role: m.role === "tool" ? "assistant" : m.role,
      content: m.content,
    })),
    tools: aiTools,
  });

  let fullText = "";
  for await (const chunk of result.textStream) {
    fullText += chunk;
    callbacks.onTextChunk(chunk);
  }

  const response = await result.response;
  for (const tc of response.toolCalls ?? []) {
    callbacks.onToolCall(tc.toolName, tc.args);
  }
  for (const tr of response.toolResults ?? []) {
    callbacks.onToolResult(tr.toolName, tr.result);
  }

  callbacks.onFinish(fullText);
}

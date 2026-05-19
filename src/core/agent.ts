import { createAnthropic } from "@ai-sdk/anthropic";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { Message } from "../types/index.js";
import { tools } from "./tools/index.js";

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

  const aiTools: Record<string, unknown> = {};
  for (const tool of tools) {
    aiTools[tool.name] = {
      description: tool.description,
      parameters: tool.parameters,
      execute: tool.execute,
    };
  }

  const result = streamText({
    model,
    system:
      "You are SoulForge Light, a helpful coding assistant. You have access to tools for reading and editing files, running shell commands, and using git. Be concise. Always think step by step.",
    messages: messages.map((m) => ({
      role: m.role === "tool" ? "assistant" : m.role,
      content: m.content,
    })),
    // biome-ignore lint/suspicious/noExplicitAny: tool typing is complex
    tools: aiTools as any,
  });

  let fullText = "";
  for await (const chunk of result.textStream) {
    fullText += chunk;
    callbacks.onTextChunk(chunk);
  }

  // biome-ignore lint/suspicious/noExplicitAny: accessing tool results from streamText
  const toolCalls = (await (result as any).toolCalls) ?? [];
  // biome-ignore lint/suspicious/noExplicitAny: accessing tool results from streamText
  const toolResults = (await (result as any).toolResults) ?? [];

  for (const tc of toolCalls) {
    callbacks.onToolCall(tc.toolName, tc.args);
  }
  for (const tr of toolResults) {
    callbacks.onToolResult(tr.toolName, tr.result);
  }

  callbacks.onFinish(fullText);
}

import { useCallback } from "react";
import { useChatStore } from "../stores/chat.js";
import { useSessionStore } from "../stores/session.js";
import { runAgentStream } from "../core/agent.js";
import { loadConfig } from "../core/config/index.js";

export function useChat() {
  const { activeTabId } = useSessionStore();
  const {
    addMessage,
    setStreaming,
    appendToActiveMessage,
    finalizeActiveMessage,
    updateMessage,
  } = useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeTabId) return;

      const config = loadConfig();
      if (!config) return;

      const userMsg = {
        id: crypto.randomUUID(),
        role: "user" as const,
        content,
        timestamp: new Date().toISOString(),
      };
      addMessage(activeTabId, userMsg);

      setStreaming(activeTabId, true);

      const messages = useChatStore.getState().getMessages(activeTabId);

      await runAgentStream(
        config.provider,
        config.model,
        config.apiKey,
        messages,
        {
          onTextChunk: (chunk) => {
            appendToActiveMessage(activeTabId, chunk);
          },
          onToolCall: (name, args) => {
            const toolMsg = {
              id: crypto.randomUUID(),
              role: "tool" as const,
              content: "",
              toolName: name,
              toolArgs: args,
              timestamp: new Date().toISOString(),
            };
            addMessage(activeTabId, toolMsg);
          },
          onToolResult: (name, result) => {
            const msgs = useChatStore.getState().getMessages(activeTabId);
            const lastTool = [...msgs].reverse().find((m) => m.role === "tool" && m.toolName === name);
            if (lastTool) {
              updateMessage(activeTabId, lastTool.id, {
                toolResult: typeof result === "string" ? result : JSON.stringify(result),
                content: typeof result === "string" ? result : JSON.stringify(result),
              });
            }
          },
          onFinish: () => {
            finalizeActiveMessage(activeTabId);
          },
        },
      );
    },
    [activeTabId, addMessage, setStreaming, appendToActiveMessage, finalizeActiveMessage, updateMessage],
  );

  return { sendMessage };
}

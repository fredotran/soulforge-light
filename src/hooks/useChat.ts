import { useCallback, useEffect, useRef } from "react";
import { runAgentStream } from "../core/agent.js";
import { loadConfig } from "../core/config/index.js";
import { useChatStore } from "../stores/chat.js";
import { useSessionStore } from "../stores/session.js";

export function useChat() {
  const { activeTabId } = useSessionStore();
  const { saveTab } = useSessionStore();
  const {
    addMessage,
    setStreaming,
    appendToActiveMessage,
    finalizeActiveMessage,
    updateMessage,
    getMessages,
  } = useChatStore();

  // Track message count for auto-save
  const msgCountRef = useRef(0);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!activeTabId) return;
    const currentCount = getMessages(activeTabId).length;
    if (currentCount === msgCountRef.current) return;
    msgCountRef.current = currentCount;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveTab(activeTabId);
    }, 3000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [activeTabId, getMessages, saveTab]);

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

      const messages = getMessages(activeTabId);

      await runAgentStream(config.provider, config.model, config.apiKey, messages, {
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
          const msgs = getMessages(activeTabId);
          const lastTool = [...msgs]
            .reverse()
            .find((m) => m.role === "tool" && m.toolName === name);
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
      });
    },
    [
      activeTabId,
      addMessage,
      setStreaming,
      appendToActiveMessage,
      finalizeActiveMessage,
      updateMessage,
      getMessages,
    ],
  );

  return { sendMessage };
}

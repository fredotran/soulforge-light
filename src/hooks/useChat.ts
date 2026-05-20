import { useCallback, useEffect, useRef } from "react";
import { runAgent } from "../core/agent.js";
import { loadConfig } from "../core/config/index.js";
import { buildSystemPrompt } from "../core/system-prompt.js";
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

      await runAgent({
        provider: config.provider,
        model: config.model,
        apiKey: config.apiKey,
        systemPrompt: buildSystemPrompt(process.cwd()),
        messages: messages.map((m) => ({
          role: m.role === "tool" ? ("assistant" as const) : (m.role as "user" | "assistant"),
          content: m.content,
        })),
        callbacks: {
          onTextDelta: (chunk) => {
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
          onStepFinish: () => {},
          onFinish: () => {
            finalizeActiveMessage(activeTabId);
          },
          onError: (err) => {
            finalizeActiveMessage(activeTabId);
            addMessage(activeTabId, {
              id: crypto.randomUUID(),
              role: "assistant" as const,
              content: `Error: ${err.message}`,
              timestamp: new Date().toISOString(),
            });
          },
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

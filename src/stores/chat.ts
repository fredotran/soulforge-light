import { create } from "zustand";
import type { Message } from "../types/index.js";

interface ChatState {
  messages: Record<string, Message[]>;
  streaming: Record<string, boolean>;
  activeMessage: Record<string, string>;

  getMessages: (tabId: string) => Message[];
  addMessage: (tabId: string, message: Message) => void;
  updateMessage: (tabId: string, messageId: string, updates: Partial<Message>) => void;
  clearMessages: (tabId: string) => void;
  setStreaming: (tabId: string, streaming: boolean) => void;
  appendToActiveMessage: (tabId: string, chunk: string) => void;
  finalizeActiveMessage: (tabId: string) => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  messages: {},
  streaming: {},
  activeMessage: {},

  getMessages: (tabId) => get().messages[tabId] ?? [],

  addMessage: (tabId, message) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [tabId]: [...(s.messages[tabId] ?? []), message],
      },
    })),

  updateMessage: (tabId, messageId, updates) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [tabId]: (s.messages[tabId] ?? []).map((m) =>
          m.id === messageId ? { ...m, ...updates } : m,
        ),
      },
    })),

  clearMessages: (tabId) =>
    set((s) => ({
      messages: { ...s.messages, [tabId]: [] },
    })),

  setStreaming: (tabId, streaming) =>
    set((s) => ({
      streaming: { ...s.streaming, [tabId]: streaming },
    })),

  appendToActiveMessage: (tabId, chunk) =>
    set((s) => ({
      activeMessage: {
        ...s.activeMessage,
        [tabId]: (s.activeMessage[tabId] ?? "") + chunk,
      },
    })),

  finalizeActiveMessage: (tabId) =>
    set((s) => {
      const content = s.activeMessage[tabId] ?? "";
      if (!content) return s;
      const message: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
        timestamp: new Date().toISOString(),
      };
      return {
        activeMessage: { ...s.activeMessage, [tabId]: "" },
        messages: {
          ...s.messages,
          [tabId]: [...(s.messages[tabId] ?? []), message],
        },
        streaming: { ...s.streaming, [tabId]: false },
      };
    }),
}));

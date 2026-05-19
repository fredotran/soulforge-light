import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { create } from "zustand";
import { getSessionsDir } from "../core/config/index.js";
import type { Message, Tab } from "../types/index.js";

interface SessionState {
  tabs: Tab[];
  activeTabId: string | null;

  createTab: () => string;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  renameTab: (id: string, name: string) => void;
  loadSessions: () => void;
  saveTab: (tabId: string) => void;
  saveAllTabs: () => void;
}

function makeTab(name = "New chat"): Tab {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  tabs: [],
  activeTabId: null,

  createTab: () => {
    const tab = makeTab();
    set((s) => ({
      tabs: [...s.tabs, tab],
      activeTabId: tab.id,
    }));
    return tab.id;
  },

  closeTab: (id) => {
    set((s) => {
      const tabs = s.tabs.filter((t) => t.id !== id);
      const activeTabId = s.activeTabId === id ? (tabs[0]?.id ?? null) : s.activeTabId;
      return { tabs, activeTabId };
    });
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  renameTab: (id, name) =>
    set((s) => ({
      tabs: s.tabs.map((t) => (t.id === id ? { ...t, name } : t)),
    })),

  loadSessions: () => {
    const dir = getSessionsDir();
    try {
      const files = readdirSync(dir).filter((f) => f.endsWith(".jsonl"));
      const tabs: Tab[] = [];
      for (const file of files) {
        try {
          const raw = readFileSync(join(dir, file), "utf-8");
          const lines = raw.trim().split("\n").filter(Boolean);
          const messages = lines.map((l) => JSON.parse(l) as Message);
          const tabId = file.replace(".jsonl", "");
          const firstUserMsg = messages.find((m) => m.role === "user");
          const firstUser = firstUserMsg?.content ?? "Chat";
          const name = firstUser.split(" ").slice(0, 3).join(" ") || "Chat";
          tabs.push({
            id: tabId,
            name,
            messages,
            createdAt: messages[0]?.timestamp ?? new Date().toISOString(),
            updatedAt: messages[messages.length - 1]?.timestamp ?? new Date().toISOString(),
          });
        } catch {
          // skip corrupted session files
        }
      }
      const firstTab = tabs[0];
      if (firstTab) {
        set({ tabs, activeTabId: firstTab.id });
      } else {
        const tab = makeTab();
        set({ tabs: [tab], activeTabId: tab.id });
      }
    } catch {
      const tab = makeTab();
      set({ tabs: [tab], activeTabId: tab.id });
    }
  },

  saveTab: (tabId) => {
    const tab = get().tabs.find((t) => t.id === tabId);
    if (!tab) return;
    const dir = getSessionsDir();
    const path = join(dir, `${tabId}.jsonl`);
    const lines = tab.messages.map((m) => JSON.stringify(m)).join("\n");
    writeFileSync(path, `${lines}\n`);
  },

  saveAllTabs: () => {
    for (const tab of get().tabs) {
      get().saveTab(tab.id);
    }
  },
}));

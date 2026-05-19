import { describe, it, expect } from "bun:test";
import { useAppStore } from "../src/stores/app.js";
import { useChatStore } from "../src/stores/chat.js";

describe("stores", () => {
  it("app store toggles settings", () => {
    useAppStore.getState().openSettings();
    expect(useAppStore.getState().settingsOpen).toBe(true);
    useAppStore.getState().closeSettings();
    expect(useAppStore.getState().settingsOpen).toBe(false);
  });

  it("chat store adds messages", () => {
    const tabId = "test-tab";
    useChatStore.getState().addMessage(tabId, {
      id: "1",
      role: "user",
      content: "hello",
      timestamp: new Date().toISOString(),
    });
    expect(useChatStore.getState().getMessages(tabId)).toHaveLength(1);
  });
});

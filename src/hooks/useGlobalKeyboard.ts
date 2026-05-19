import { useEffect } from "react";
import { useAppStore } from "../stores/app.js";
import { useSessionStore } from "../stores/session.js";
import { cleanupAndExit } from "../index.js";

export function useGlobalKeyboard() {
  const { settingsOpen, closeSettings, setFocus } = useAppStore();
  const { createTab, closeTab, setActiveTab, tabs, activeTabId, saveAllTabs } = useSessionStore();

  useEffect(() => {
    // OpenTUI keyboard handling is done via the renderer's keyInput
    // This hook is a placeholder for any additional keyboard logic
    // The actual key handling is wired in boot.tsx through OpenTUI's useKeyboard
    return () => {};
  }, [settingsOpen, activeTabId, tabs, closeSettings, createTab, closeTab, setActiveTab, setFocus, saveAllTabs]);
}

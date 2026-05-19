import { useSessionStore } from "../stores/session.js";

export function useTabs() {
  const { tabs, activeTabId, createTab, closeTab, setActiveTab, renameTab } = useSessionStore();

  return {
    tabs,
    activeTabId,
    createTab,
    closeTab,
    setActiveTab,
    renameTab,
  };
}

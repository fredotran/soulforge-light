import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { configExists } from "../core/config/index.js";
import { getTheme } from "../core/theme/index.js";
import { cleanupAndExit } from "../index.js";
import { useAppStore } from "../stores/app.js";
import { useSessionStore } from "../stores/session.js";
import { ChatPanel } from "./ChatPanel.js";
import { FooterBar } from "./FooterBar.js";
import { HeaderBar } from "./HeaderBar.js";
import { SettingsOverlay } from "./SettingsOverlay.js";
import { Box } from "./ui/box.js";
import { Wizard } from "./Wizard.js";

export function App() {
  const t = getTheme();
  const settingsOpen = useAppStore((s) => s.settingsOpen);
  const closeSettings = useAppStore((s) => s.closeSettings);
  const [showWizard, setShowWizard] = useState(!configExists());

  const { createTab, closeTab, setActiveTab, tabs, activeTabId, saveAllTabs } = useSessionStore();

  useKeyboard((key) => {
    // Ignore release events
    if (key.eventType === "release") return;

    // Escape — close settings
    if (key.name === "escape" && settingsOpen) {
      closeSettings();
      key.stopPropagation();
      return;
    }

    // Ctrl+X — Quit
    if (key.ctrl && key.name === "x") {
      cleanupAndExit(0);
      key.stopPropagation();
      return;
    }

    // Ctrl+S — Save all tabs
    if (key.ctrl && key.name === "s") {
      saveAllTabs();
      key.stopPropagation();
      return;
    }

    // Ctrl+T — New tab
    if (key.ctrl && key.name === "t") {
      createTab();
      key.stopPropagation();
      return;
    }

    // Ctrl+W — Close current tab
    if (key.ctrl && key.name === "w") {
      if (activeTabId) closeTab(activeTabId);
      key.stopPropagation();
      return;
    }

    // Tab — Next tab
    if (key.name === "tab" && !key.shift && !settingsOpen) {
      const idx = tabs.findIndex((t) => t.id === activeTabId);
      const next = tabs[(idx + 1) % tabs.length];
      if (next) {
        setActiveTab(next.id);
        key.stopPropagation();
      }
      return;
    }

    // Shift+Tab — Previous tab
    if (key.name === "tab" && key.shift && !settingsOpen) {
      const idx = tabs.findIndex((t) => t.id === activeTabId);
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
      if (prev) {
        setActiveTab(prev.id);
        key.stopPropagation();
      }
      return;
    }
  });

  if (showWizard) {
    return (
      <Box flexDirection="column" flexGrow={1} borderStyle="single" borderColor={t.border}>
        <Wizard onComplete={() => setShowWizard(false)} />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" flexGrow={1} borderStyle="single" borderColor={t.border}>
      <HeaderBar />
      {settingsOpen ? <SettingsOverlay /> : <ChatPanel />}
      <FooterBar />
    </Box>
  );
}

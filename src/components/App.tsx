import { getTheme } from "../core/theme/index.js";
import { useAppStore } from "../stores/app.js";
import { ChatPanel } from "./ChatPanel.js";
import { FooterBar } from "./FooterBar.js";
import { HeaderBar } from "./HeaderBar.js";
import { SettingsOverlay } from "./SettingsOverlay.js";
import { Box } from "./ui/box.js";

export function App() {
  const t = getTheme();
  const settingsOpen = useAppStore((s) => s.settingsOpen);

  return (
    <Box flexDirection="column" flexGrow={1} borderStyle="single" borderColor={t.border}>
      <HeaderBar />
      {settingsOpen ? <SettingsOverlay /> : <ChatPanel />}
      <FooterBar />
    </Box>
  );
}

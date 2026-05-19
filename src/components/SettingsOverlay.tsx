import { getTheme } from "../core/theme/index.js";
import { SettingsPanel } from "./SettingsPanel.js";
import { Box } from "./ui/box.js";

export function SettingsOverlay() {
  const t = getTheme();
  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      padding={2}
      borderStyle="single"
      borderColor={t.border}
    >
      <SettingsPanel />
    </Box>
  );
}

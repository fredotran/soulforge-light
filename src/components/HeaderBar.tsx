import { loadConfig } from "../core/config/index.js";
import { getTheme } from "../core/theme/index.js";
import { useAppStore } from "../stores/app.js";
import { useSessionStore } from "../stores/session.js";
import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";

export function HeaderBar() {
  const t = getTheme();
  const { tabs, activeTabId, setActiveTab, createTab } = useSessionStore();
  const { openSettings } = useAppStore();
  const config = loadConfig();

  return (
    <Box flexDirection="row" height={1} paddingLeft={1} paddingRight={1}>
      {tabs.map((tab) => (
        <Box key={tab.id} onPress={() => setActiveTab(tab.id)}>
          <Text
            color={tab.id === activeTabId ? t.brand : t.textMuted}
            bold={tab.id === activeTabId}
          >
            {tab.id === activeTabId ? `[${tab.name}]` : ` ${tab.name} `}
          </Text>
        </Box>
      ))}
      <Box paddingRight={2} onPress={() => createTab()}>
        <Text color={t.textMuted}>+</Text>
      </Box>
      <Box flexGrow={1} />
      <Box paddingRight={2}>
        <Text color={t.brandSecondary} dimColor>
          {config?.model ?? "no model"}
        </Text>
      </Box>
      <Box onPress={openSettings}>
        <Text color={t.textMuted}>≡</Text>
      </Box>
    </Box>
  );
}

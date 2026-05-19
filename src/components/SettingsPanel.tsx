import { useState } from "react";
import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";
import { getTheme } from "../core/theme/index.js";
import { useAppStore } from "../stores/app.js";
import { saveConfig } from "../core/config/index.js";

const PROVIDERS = ["anthropic", "openai", "google", "groq", "mistral", "deepseek"];
const MODELS: Record<string, string[]> = {
  anthropic: ["claude-sonnet-4", "claude-opus-4", "claude-haiku-3"],
  openai: ["gpt-4o", "gpt-4o-mini", "o3-mini"],
  google: ["gemini-2.0-flash", "gemini-2.5-pro"],
  groq: ["llama-3.3-70b", "mixtral-8x7b"],
  mistral: ["mistral-large", "mistral-medium"],
  deepseek: ["deepseek-chat", "deepseek-reasoner"],
};

export function SettingsPanel() {
  const t = getTheme();
  const { closeSettings, theme, toggleTheme } = useAppStore();
  const [activeTab, setActiveTab] = useState<"providers" | "theme" | "keys">("providers");
  const [provider, setProvider] = useState("anthropic");
  const [model, setModel] = useState("claude-sonnet-4");
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    saveConfig({ provider, model, apiKey, theme });
    closeSettings();
  };

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Box flexDirection="row" height={1} gap={2}>
        {(["providers", "theme", "keys"] as const).map((tab) => (
          <Text
            key={tab}
            color={activeTab === tab ? t.brand : t.textMuted}
            bold={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        ))}
        <Box flexGrow={1} />
        <Text color={t.error} onPress={closeSettings}>
          [X]
        </Text>
      </Box>
      <Box height={1} />
      {activeTab === "providers" && (
        <Box flexDirection="column" gap={1}>
          <Text color={t.textSecondary}>Provider:</Text>
          {PROVIDERS.map((p) => (
            <Text
              key={p}
              color={provider === p ? t.brand : t.textMuted}
              onPress={() => {
                setProvider(p);
                setModel(MODELS[p][0]);
              }}
            >
              {provider === p ? `● ${p}` : `○ ${p}`}
            </Text>
          ))}
          <Box height={1} />
          <Text color={t.textSecondary}>Model:</Text>
          {(MODELS[provider] ?? []).map((m) => (
            <Text
              key={m}
              color={model === m ? t.brand : t.textMuted}
              onPress={() => setModel(m)}
            >
              {model === m ? `● ${m}` : `○ ${m}`}
            </Text>
          ))}
          <Box height={1} />
          <Text color={t.textSecondary}>API Key:</Text>
          <Text color={t.textMuted}>************</Text>
          <Box height={1} />
          <Text color={t.success} onPress={handleSave}>
            [Save]
          </Text>
        </Box>
      )}
      {activeTab === "theme" && (
        <Box flexDirection="column" gap={1}>
          <Text color={t.textSecondary}>Theme:</Text>
          <Text color={theme === "dark" ? t.brand : t.textMuted} onPress={toggleTheme}>
            {theme === "dark" ? "● Dark" : "○ Dark"}
          </Text>
          <Text color={theme === "light" ? t.brand : t.textMuted} onPress={toggleTheme}>
            {theme === "light" ? "● Light" : "○ Light"}
          </Text>
        </Box>
      )}
      {activeTab === "keys" && (
        <Box flexDirection="column" gap={1}>
          <Text color={t.textSecondary}>Keyboard shortcuts:</Text>
          <Text color={t.textMuted}>^X — Quit</Text>
          <Text color={t.textMuted}>^S — Save session</Text>
          <Text color={t.textMuted}>^T — New tab</Text>
          <Text color={t.textMuted}>^W — Close tab</Text>
          <Text color={t.textMuted}>Tab — Next tab</Text>
          <Text color={t.textMuted}>Shift+Tab — Previous tab</Text>
          <Text color={t.textMuted}>^/ — Focus input</Text>
          <Text color={t.textMuted}>Escape — Close overlay</Text>
        </Box>
      )}
    </Box>
  );
}

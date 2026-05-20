import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { saveConfig } from "../core/config/index.js";
import { getTheme } from "../core/theme/index.js";
import { useAppStore } from "../stores/app.js";
import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";

const PROVIDERS = [
  "anthropic",
  "openai",
  "github-models",
  "google",
  "groq",
  "mistral",
  "deepseek",
] as const;
const MODELS: Record<(typeof PROVIDERS)[number], string[]> = {
  anthropic: ["claude-sonnet-4", "claude-opus-4", "claude-haiku-3"],
  openai: ["gpt-4o", "gpt-4o-mini", "o3-mini"],
  "github-models": ["gpt-4o", "claude-sonnet-4", "Llama-3.3-70B-Instruct", "Mistral-Large"],
  google: ["gemini-2.0-flash", "gemini-2.5-pro"],
  groq: ["llama-3.3-70b", "mixtral-8x7b"],
  mistral: ["mistral-large", "mistral-medium"],
  deepseek: ["deepseek-chat", "deepseek-reasoner"],
};

export function SettingsPanel() {
  const t = getTheme();
  const { closeSettings, theme, toggleTheme } = useAppStore();
  const [provider, setProvider] = useState("anthropic");
  const [model, setModel] = useState("claude-sonnet-4");
  const [apiKey, _setApiKey] = useState("");
  const [providerIdx, setProviderIdx] = useState(0);

  useKeyboard((key) => {
    if (key.eventType === "release") return;

    if (key.name === "down") {
      setProviderIdx((i) => {
        const next = (i + 1) % PROVIDERS.length;
        const p = PROVIDERS[next] as (typeof PROVIDERS)[number];
        setProvider(p);
        setModel(MODELS[p][0] as string);
        return next;
      });
      key.stopPropagation();
      return;
    }
    if (key.name === "up") {
      setProviderIdx((i) => {
        const next = (i - 1 + PROVIDERS.length) % PROVIDERS.length;
        const p = PROVIDERS[next] as (typeof PROVIDERS)[number];
        setProvider(p);
        setModel(MODELS[p][0] as string);
        return next;
      });
      key.stopPropagation();
      return;
    }
    if (key.name === "return") {
      saveConfig({ provider, model, apiKey, theme });
      closeSettings();
      key.stopPropagation();
      return;
    }
    if (key.name === "t") {
      toggleTheme();
      key.stopPropagation();
      return;
    }
  });

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Box flexDirection="row" height={1} gap={2}>
        <Text color={t.brand} bold>
          Settings
        </Text>
        <Box flexGrow={1} />
        <Text color={t.error}>[X]</Text>
      </Box>
      <Box height={1} />
      <Text color={t.textSecondary}>Provider (↑/↓ to select):</Text>
      {PROVIDERS.map((p, i) => (
        <Text key={p} color={i === providerIdx ? t.brand : t.textMuted} bold={i === providerIdx}>
          {i === providerIdx ? `> ${p}` : `  ${p}`}
        </Text>
      ))}
      <Box height={1} />
      <Text color={t.textSecondary}>Model: {model}</Text>
      <Box height={1} />
      <Text color={t.textSecondary}>Theme (press T to toggle):</Text>
      <Text color={theme === "dark" ? t.brand : t.textMuted}>
        {theme === "dark" ? "● Dark" : "○ Dark"}
      </Text>
      <Text color={theme === "light" ? t.brand : t.textMuted}>
        {theme === "light" ? "● Light" : "○ Light"}
      </Text>
      <Box height={1} />
      <Text color={t.textSecondary}>API Key:</Text>
      <Text color={t.textMuted}>************</Text>
      <Box height={1} />
      <Text color={t.success}>[Enter to Save]</Text>
    </Box>
  );
}

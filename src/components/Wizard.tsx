import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { saveConfig } from "../core/config/index.js";
import { getTheme } from "../core/theme/index.js";
import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";

const PROVIDERS = ["anthropic", "openai", "google", "groq", "mistral", "deepseek"] as const;
const MODELS: Record<(typeof PROVIDERS)[number], string[]> = {
  anthropic: ["claude-sonnet-4", "claude-opus-4", "claude-haiku-3"],
  openai: ["gpt-4o", "gpt-4o-mini", "o3-mini"],
  google: ["gemini-2.0-flash", "gemini-2.5-pro"],
  groq: ["llama-3.3-70b", "mixtral-8x7b"],
  mistral: ["mistral-large", "mistral-medium"],
  deepseek: ["deepseek-chat", "deepseek-reasoner"],
};

export function Wizard({ onComplete }: { onComplete: () => void }) {
  const t = getTheme();
  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState("anthropic");
  const [model, setModel] = useState("claude-sonnet-4");
  const [providerIdx, setProviderIdx] = useState(0);

  useKeyboard((key) => {
    if (key.eventType === "release") return;

    if (step === 0) {
      if (key.name === "return") {
        setStep(1);
        key.stopPropagation();
      }
      return;
    }

    if (step === 1) {
      if (key.name === "down") {
        setProviderIdx((i) => {
          const next = (i + 1) % PROVIDERS.length;
          const p = PROVIDERS[next];
          setProvider(p);
          setModel(MODELS[p][0]);
          return next;
        });
        key.stopPropagation();
        return;
      }
      if (key.name === "up") {
        setProviderIdx((i) => {
          const next = (i - 1 + PROVIDERS.length) % PROVIDERS.length;
          const p = PROVIDERS[next];
          setProvider(p);
          setModel(MODELS[p][0]);
          return next;
        });
        key.stopPropagation();
        return;
      }
      if (key.name === "return") {
        setStep(2);
        key.stopPropagation();
        return;
      }
      return;
    }

    if (step === 2) {
      if (key.name === "return") {
        saveConfig({ provider, model, apiKey: "", theme: "dark" });
        onComplete();
        key.stopPropagation();
      }
      return;
    }
  });

  return (
    <Box flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center">
      {step === 0 && (
        <>
          <Text color={t.brand} bold>
            Welcome to SoulForge Light
          </Text>
          <Box height={1} />
          <Text color={t.textSecondary}>A lightweight terminal AI coding assistant.</Text>
          <Box height={1} />
          <Text color={t.success}>[Press Enter to Start Setup]</Text>
        </>
      )}
      {step === 1 && (
        <>
          <Text color={t.brand} bold>
            Provider Setup
          </Text>
          <Box height={1} />
          <Text color={t.textSecondary}>
            Select provider (use ↑/↓ arrow keys, Enter to confirm)
          </Text>
          <Box height={1} />
          {PROVIDERS.map((p, i) => (
            <Text
              key={p}
              color={i === providerIdx ? t.brand : t.textMuted}
              bold={i === providerIdx}
            >
              {i === providerIdx ? `> ${p}` : `  ${p}`}
            </Text>
          ))}
          <Box height={1} />
          <Text color={t.textSecondary}>Model: {model}</Text>
          <Box height={1} />
          <Text color={t.textMuted}>API Key: configure later in settings</Text>
        </>
      )}
      {step === 2 && (
        <>
          <Text color={t.brand} bold>
            All Set!
          </Text>
          <Box height={1} />
          <Text color={t.textSecondary}>Provider: {provider}</Text>
          <Text color={t.textSecondary}>Model: {model}</Text>
          <Box height={1} />
          <Text color={t.success}>[Press Enter to Launch]</Text>
        </>
      )}
    </Box>
  );
}

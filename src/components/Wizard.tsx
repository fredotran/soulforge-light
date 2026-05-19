import { useState } from "react";
import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";
import { getTheme } from "../core/theme/index.js";
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

export function Wizard({ onComplete }: { onComplete: () => void }) {
  const t = getTheme();
  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState("anthropic");
  const [model, setModel] = useState("claude-sonnet-4");
  const [apiKey, setApiKey] = useState("");

  const handleFinish = () => {
    saveConfig({ provider, model, apiKey, theme: "dark" });
    onComplete();
  };

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
          <Text color={t.success} onPress={() => setStep(1)}>
            [Start Setup]
          </Text>
        </>
      )}
      {step === 1 && (
        <>
          <Text color={t.brand} bold>
            Provider Setup
          </Text>
          <Box height={1} />
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
          <Text color={t.textSecondary}>Model: {model}</Text>
          <Box height={1} />
          <Text color={t.textSecondary}>API Key:</Text>
          <Text color={t.textMuted}>************</Text>
          <Box height={1} />
          <Text color={t.success} onPress={() => setStep(2)}>
            [Continue]
          </Text>
        </>
      )}
      {step === 2 && (
        <>
          <Text color={t.brand} bold>
            All Set!
          </Text>
          <Box height={1} />
          <Text color={t.textSecondary}>Start chatting with soulforge.</Text>
          <Box height={1} />
          <Text color={t.success} onPress={handleFinish}>
            [Launch]
          </Text>
        </>
      )}
    </Box>
  );
}

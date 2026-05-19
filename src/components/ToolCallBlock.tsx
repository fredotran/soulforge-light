import { useState } from "react";
import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";
import { getTheme } from "../core/theme/index.js";
import type { Message } from "../types/index.js";

export function ToolCallBlock({ message }: { message: Message }) {
  const t = getTheme();
  const [expanded, setExpanded] = useState(false);
  const name = message.toolName ?? "tool";
  const result = message.toolResult ?? "";

  return (
    <Box flexDirection="column" paddingLeft={4} paddingRight={2}>
      <Box flexDirection="row" onPress={() => setExpanded(!expanded)}>
        <Text color={t.brand}>{expanded ? "▼" : "▶"}</Text>
        <Box width={1} />
        <Text color={t.brandSecondary}>{name}</Text>
        <Box width={1} />
        <Text color={t.textMuted} dimColor>
          {message.toolArgs ? JSON.stringify(message.toolArgs).slice(0, 40) : ""}
        </Text>
      </Box>
      {expanded && (
        <Box flexDirection="column" paddingLeft={2}>
          <Text color={t.textSecondary} dimColor wrap="wrap">
            {result}
          </Text>
        </Box>
      )}
    </Box>
  );
}

import { getTheme } from "../core/theme/index.js";
import type { Message } from "../types/index.js";
import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";

export function AssistantMessage({ message }: { message: Message }) {
  const t = getTheme();
  return (
    <Box flexDirection="column" paddingLeft={2} paddingRight={2}>
      <Text color={t.textPrimary} wrap="wrap">
        {message.content}
      </Text>
    </Box>
  );
}

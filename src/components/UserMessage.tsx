import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";
import { getTheme } from "../core/theme/index.js";
import type { Message } from "../types/index.js";

export function UserMessage({ message }: { message: Message }) {
  const t = getTheme();
  return (
    <Box flexDirection="row" paddingLeft={2} paddingRight={2}>
      <Box flexGrow={1} />
      <Box padding={1} borderStyle="round" borderColor={t.userMessageBg}>
        <Text color={t.textPrimary}>{message.content}</Text>
      </Box>
    </Box>
  );
}

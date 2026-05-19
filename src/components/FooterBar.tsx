import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";
import { getTheme } from "../core/theme/index.js";
import { useSessionStore } from "../stores/session.js";
import { useChatStore } from "../stores/chat.js";

export function FooterBar() {
  const t = getTheme();
  const { activeTabId } = useSessionStore();
  const messages = activeTabId ? useChatStore.getState().getMessages(activeTabId) : [];

  const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
  const approxTokens = Math.round(totalChars / 4);

  return (
    <Box flexDirection="row" height={1} paddingLeft={1} paddingRight={1}>
      <Text color={t.textMuted} dimColor>
        ● main
      </Text>
      <Box width={2} />
      <Text color={t.textMuted} dimColor>
        {approxTokens}k tokens
      </Text>
      <Box flexGrow={1} />
      <Text color={t.textMuted} dimColor>
        ^S save | ^X quit
      </Text>
    </Box>
  );
}

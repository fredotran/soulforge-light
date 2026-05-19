import { Box } from "./ui/box.js";
import { UserMessage } from "./UserMessage.js";
import { AssistantMessage } from "./AssistantMessage.js";
import { ToolCallBlock } from "./ToolCallBlock.js";
import { useChatStore } from "../stores/chat.js";
import { useSessionStore } from "../stores/session.js";

export function MessageList() {
  const { activeTabId } = useSessionStore();
  const { getMessages } = useChatStore();
  const messages = activeTabId ? getMessages(activeTabId) : [];

  return (
    <Box flexDirection="column" flexGrow={1} gap={1}>
      {messages.map((msg) => {
        if (msg.role === "user") return <UserMessage key={msg.id} message={msg} />;
        if (msg.role === "assistant") return <AssistantMessage key={msg.id} message={msg} />;
        if (msg.role === "tool") return <ToolCallBlock key={msg.id} message={msg} />;
        return null;
      })}
    </Box>
  );
}

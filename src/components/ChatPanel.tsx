import { Box } from "./ui/box.js";
import { MessageList } from "./MessageList.js";
import { InputBox } from "./InputBox.js";
import { useChat } from "../hooks/useChat.js";

export function ChatPanel() {
  const { sendMessage } = useChat();

  return (
    <Box flexDirection="column" flexGrow={1}>
      <MessageList />
      <InputBox onSubmit={sendMessage} />
    </Box>
  );
}

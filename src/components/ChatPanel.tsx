import { useChat } from "../hooks/useChat.js";
import { InputBox } from "./InputBox.js";
import { MessageList } from "./MessageList.js";
import { Box } from "./ui/box.js";

export function ChatPanel() {
  const { sendMessage } = useChat();

  return (
    <Box flexDirection="column" flexGrow={1}>
      <MessageList />
      <InputBox onSubmit={sendMessage} />
    </Box>
  );
}

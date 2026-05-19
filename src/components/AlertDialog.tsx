import { getTheme } from "../core/theme/index.js";
import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";

interface AlertDialogProps {
  message: string;
  onClose: () => void;
}

export function AlertDialog({ message, onClose }: AlertDialogProps) {
  const t = getTheme();
  return (
    <Box flexDirection="column" padding={2} borderStyle="single" borderColor={t.brand}>
      <Text color={t.textPrimary}>{message}</Text>
      <Box height={1} />
      <Text color={t.textSecondary} onPress={onClose}>
        [Press any key to close]
      </Text>
    </Box>
  );
}

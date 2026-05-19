import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";
import { getTheme } from "../core/theme/index.js";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  const t = getTheme();
  return (
    <Box flexDirection="column" padding={2} borderStyle="double" borderColor={t.warning}>
      <Text color={t.textPrimary}>{message}</Text>
      <Box height={1} />
      <Box flexDirection="row">
        <Text color={t.success} onPress={onConfirm}>
          [Yes]
        </Text>
        <Box width={2} />
        <Text color={t.error} onPress={onCancel}>
          [No]
        </Text>
      </Box>
    </Box>
  );
}

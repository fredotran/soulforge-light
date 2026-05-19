import { getTheme } from "../core/theme/index.js";
import { useAppStore } from "../stores/app.js";
import { Box } from "./ui/box.js";
import { Text } from "./ui/text.js";

interface InputBoxProps {
  onSubmit: (text: string) => void;
}

export function InputBox({ onSubmit: _onSubmit }: InputBoxProps) {
  const t = getTheme();
  const inputText = useAppStore((s) => s.inputText);

  return (
    <Box flexDirection="row" height={1} paddingLeft={1} paddingRight={1}>
      <Text color={t.brand}>&gt;</Text>
      <Box width={1} />
      <Text color={t.textPrimary}>{inputText}</Text>
      <Text color={t.brand}>_</Text>
    </Box>
  );
}

import { useAppStore } from "../stores/app.js";

interface InputBoxProps {
  onSubmit: (text: string) => void;
}

export function InputBox({ onSubmit }: InputBoxProps) {
  const inputText = useAppStore((s) => s.inputText);
  const setInputText = useAppStore((s) => s.setInputText);

  return (
    <input
      focused
      placeholder="Type a message or /command..."
      value={inputText}
      onInput={(value) => setInputText(value)}
      onSubmit={(value) => {
        const text = String(value).trim();
        if (text) {
          onSubmit(text);
          setInputText("");
        }
      }}
    />
  );
}

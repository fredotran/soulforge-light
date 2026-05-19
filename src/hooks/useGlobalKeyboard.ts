import { useEffect } from "react";

export function useGlobalKeyboard() {
  useEffect(() => {
    // OpenTUI keyboard handling is done via the renderer's keyInput
    // This hook is a placeholder for any additional keyboard logic
    // The actual key handling is wired in boot.tsx through OpenTUI's useKeyboard
    return () => {};
  }, []);
}

export interface ThemeTokens {
  bg: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  brand: string;
  brandSecondary: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  userMessageBg: string;
  assistantMessageBg: string;
}

export const darkTheme: ThemeTokens = {
  bg: "#1e1e2e",
  bgSecondary: "#313244",
  textPrimary: "#cdd6f4",
  textSecondary: "#a6adc8",
  textMuted: "#6c7086",
  brand: "#89b4fa",
  brandSecondary: "#b4befe",
  success: "#a6e3a1",
  warning: "#f9e2af",
  error: "#f38ba8",
  border: "#45475a",
  userMessageBg: "#313244",
  assistantMessageBg: "#1e1e2e",
};

export const lightTheme: ThemeTokens = {
  bg: "#eff1f5",
  bgSecondary: "#ccd0da",
  textPrimary: "#4c4f69",
  textSecondary: "#5c5f77",
  textMuted: "#8c8fa1",
  brand: "#1e66f5",
  brandSecondary: "#7287fd",
  success: "#40a02b",
  warning: "#df8e1d",
  error: "#d20f39",
  border: "#bcc0cc",
  userMessageBg: "#ccd0da",
  assistantMessageBg: "#eff1f5",
};

let currentTheme: ThemeTokens = darkTheme;

export function getTheme(): ThemeTokens {
  return currentTheme;
}

export function setTheme(name: "dark" | "light"): void {
  currentTheme = name === "dark" ? darkTheme : lightTheme;
}

export function useTheme(): ThemeTokens {
  return currentTheme;
}

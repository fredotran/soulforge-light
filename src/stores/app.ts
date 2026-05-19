import { create } from "zustand";

interface AppState {
  settingsOpen: boolean;
  focus: "chat" | "input" | "settings";
  theme: "dark" | "light";
  inputText: string;
  openSettings: () => void;
  closeSettings: () => void;
  setFocus: (focus: AppState["focus"]) => void;
  toggleTheme: () => void;
  setTheme: (theme: AppState["theme"]) => void;
  setInputText: (text: string) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  settingsOpen: false,
  focus: "chat",
  theme: "dark",
  inputText: "",
  openSettings: () => set({ settingsOpen: true, focus: "settings" }),
  closeSettings: () => set({ settingsOpen: false, focus: "chat" }),
  setFocus: (focus) => set({ focus }),
  toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
  setTheme: (theme) => set({ theme }),
  setInputText: (text) => set({ inputText: text }),
}));

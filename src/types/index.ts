export interface AppConfig {
  provider: string;
  model: string;
  apiKey: string;
  theme: "dark" | "light";
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: string;
  timestamp: string;
}

export interface Tab {
  id: string;
  name: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

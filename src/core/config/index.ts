import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { AppConfig } from "../../types/index.js";

const CONFIG_DIR = join(homedir(), ".soulforge");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");
const SESSIONS_DIR = join(CONFIG_DIR, "sessions");

export function ensureDir(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

export function loadConfig(): AppConfig | null {
  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(raw) as AppConfig;
  } catch {
    return null;
  }
}

export function saveConfig(config: AppConfig): void {
  ensureDir(CONFIG_DIR);
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function configExists(): boolean {
  return existsSync(CONFIG_FILE);
}

export function getSessionsDir(): string {
  ensureDir(SESSIONS_DIR);
  return SESSIONS_DIR;
}

export function listSessionFiles(): string[] {
  const dir = getSessionsDir();
  try {
    return readdirSync(dir).filter((f) => f.endsWith(".jsonl"));
  } catch {
    return [];
  }
}

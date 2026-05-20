import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const INSTRUCTION_FILES = [
  "CLAUDE.md",
  "SOULFORGE.md",
  ".soulforge/instructions.md",
  "AGENTS.md",
  "COPILOT.md",
  ".github/copilot-instructions.md",
];

const PROJECT_MARKERS: Record<string, string> = {
  "package.json": "Node.js/Bun",
  "pyproject.toml": "Python",
  "Cargo.toml": "Rust",
  "go.mod": "Go",
  "pom.xml": "Java (Maven)",
  "build.gradle": "Java (Gradle)",
  Gemfile: "Ruby",
  "composer.json": "PHP",
  "mix.exs": "Elixir",
  "CMakeLists.txt": "C/C++",
};

function detectProjectType(cwd: string): string {
  for (const [file, lang] of Object.entries(PROJECT_MARKERS)) {
    if (existsSync(join(cwd, file))) return lang;
  }
  return "Unknown";
}

function loadInstructions(cwd: string): string | null {
  for (const file of INSTRUCTION_FILES) {
    const path = join(cwd, file);
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, "utf-8").trim();
        if (content)
          return `<project_instructions source="${file}">\n${content}\n</project_instructions>`;
      } catch {}
    }
  }
  return null;
}

function listTopLevel(cwd: string): string {
  try {
    const entries = readdirSync(cwd, { withFileTypes: true })
      .filter((e) => !e.name.startsWith(".") || e.name === ".github")
      .slice(0, 40)
      .map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
    return entries.join(", ");
  } catch {
    return "(unable to list)";
  }
}

export function buildSystemPrompt(cwd: string): string {
  const projectType = detectProjectType(cwd);
  const instructions = loadInstructions(cwd);
  const files = listTopLevel(cwd);
  const projectName = basename(cwd);

  const parts = [
    `You are SoulForge Light, an autonomous CLI coding agent.`,
    `You have tools for reading/editing files, running shell commands, searching with glob/grep, and using git.`,
    ``,
    `RULES:`,
    `- Be concise. No filler text.`,
    `- Think step by step before acting.`,
    `- Read files before editing them.`,
    `- Make minimal, targeted changes.`,
    `- Always verify your edits make sense in context.`,
    `- If a task requires multiple steps, execute them sequentially using your tools.`,
    `- When asked to fix something, diagnose first, then fix.`,
    ``,
    `ENVIRONMENT:`,
    `- Working directory: ${cwd}`,
    `- Project: ${projectName} (${projectType})`,
    `- Top-level files: ${files}`,
  ];

  if (instructions) {
    parts.push("", instructions);
  }

  return parts.join("\n");
}

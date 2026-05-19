import { readFileTool } from "./read-file.js";
import { editFileTool } from "./edit-file.js";
import { multiEditTool } from "./multi-edit.js";
import { globTool } from "./glob.js";
import { grepTool } from "./grep.js";
import { listDirTool } from "./list-dir.js";
import { shellTool } from "./shell.js";
import { gitTool } from "./git.js";

export const tools = [
  readFileTool,
  editFileTool,
  multiEditTool,
  globTool,
  grepTool,
  listDirTool,
  shellTool,
  gitTool,
] as const;

export type ToolName = (typeof tools)[number]["name"];

export function getTool(name: string) {
  return tools.find((t) => t.name === name);
}

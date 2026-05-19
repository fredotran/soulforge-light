import { readFileSync } from "node:fs";
import { z } from "zod";

const argsSchema = z.object({
  file: z.string().describe("Path to the file to read"),
  startLine: z.number().optional().describe("Optional start line (1-indexed)"),
  endLine: z.number().optional().describe("Optional end line (1-indexed)"),
});

export const readFileTool = {
  name: "read_file",
  description: "Read the contents of a file. Optionally specify line range.",
  parameters: argsSchema,
  execute: async (args: z.infer<typeof argsSchema>) => {
    try {
      const content = readFileSync(args.file, "utf-8");
      const lines = content.split("\n");
      const start = args.startLine ? Math.max(0, args.startLine - 1) : 0;
      const end = args.endLine ? Math.min(lines.length, args.endLine) : lines.length;
      const sliced = lines.slice(start, end).join("\n");
      return { content: sliced, totalLines: lines.length };
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  },
};

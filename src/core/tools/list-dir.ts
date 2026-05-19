import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const argsSchema = z.object({
  path: z.string().describe("Directory path to list"),
});

export const listDirTool = {
  name: "list_dir",
  description: "List files and directories at a path.",
  parameters: argsSchema,
  execute: async (args: z.infer<typeof argsSchema>) => {
    try {
      const entries = readdirSync(args.path);
      const items = entries.map((name) => {
        const full = join(args.path, name);
        try {
          const stat = statSync(full);
          return { name, type: stat.isDirectory() ? "dir" : "file" };
        } catch {
          return { name, type: "unknown" };
        }
      });
      return { path: args.path, items };
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  },
};

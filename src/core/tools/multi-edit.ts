import { readFileSync, writeFileSync } from "node:fs";
import { z } from "zod";

const editSchema = z.object({
  file: z.string(),
  oldString: z.string(),
  newString: z.string(),
});

const argsSchema = z.object({
  edits: z.array(editSchema).describe("Array of file edits to apply atomically"),
});

export const multiEditTool = {
  name: "multi_edit",
  description: "Apply multiple file edits atomically. All or nothing.",
  parameters: argsSchema,
  execute: async (args: z.infer<typeof argsSchema>) => {
    const results: { file: string; success: boolean; error?: string }[] = [];
    const backups: { file: string; content: string }[] = [];

    try {
      for (const edit of args.edits) {
        const content = readFileSync(edit.file, "utf-8");
        backups.push({ file: edit.file, content });
        if (!content.includes(edit.oldString)) {
          throw new Error(`oldString not found in ${edit.file}`);
        }
      }

      for (const edit of args.edits) {
        const content = readFileSync(edit.file, "utf-8");
        const newContent = content.replace(edit.oldString, edit.newString);
        writeFileSync(edit.file, newContent);
        results.push({ file: edit.file, success: true });
      }

      return { results };
    } catch (err) {
      for (const backup of backups) {
        writeFileSync(backup.file, backup.content);
      }
      return {
        error: err instanceof Error ? err.message : String(err),
        results,
      };
    }
  },
};

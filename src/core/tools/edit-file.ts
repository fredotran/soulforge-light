import { readFileSync, writeFileSync } from "node:fs";
import { z } from "zod";

const argsSchema = z.object({
  file: z.string().describe("Path to the file to edit"),
  oldString: z.string().describe("The exact text to replace"),
  newString: z.string().describe("The replacement text"),
});

export const editFileTool = {
  name: "edit_file",
  description: "Replace a block of text in a file. oldString must match exactly.",
  parameters: argsSchema,
  execute: async (args: z.infer<typeof argsSchema>) => {
    try {
      const content = readFileSync(args.file, "utf-8");
      if (!content.includes(args.oldString)) {
        return { error: `oldString not found in ${args.file}` };
      }
      const newContent = content.replace(args.oldString, args.newString);
      writeFileSync(args.file, newContent);
      return { success: true, file: args.file };
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  },
};

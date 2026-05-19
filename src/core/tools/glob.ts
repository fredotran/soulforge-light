import { z } from "zod";

const argsSchema = z.object({
  pattern: z.string().describe("Glob pattern, e.g. 'src/**/*.ts'"),
});

export const globTool = {
  name: "glob",
  description: "Find files matching a glob pattern.",
  parameters: argsSchema,
  execute: async (args: z.infer<typeof argsSchema>) => {
    try {
      const files = Array.from(new Bun.Glob(args.pattern).scanSync());
      return { files };
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  },
};

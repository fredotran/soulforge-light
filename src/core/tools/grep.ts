import { z } from "zod";

const argsSchema = z.object({
  pattern: z.string().describe("Regex pattern to search for"),
  path: z.string().optional().describe("Directory or file to search in (default: cwd)"),
});

export const grepTool = {
  name: "grep",
  description: "Search for a regex pattern in files using ripgrep.",
  parameters: argsSchema,
  execute: async (args: z.infer<typeof argsSchema>) => {
    try {
      const proc = Bun.spawn(["rg", "--json", "-C", "2", args.pattern, args.path ?? "."], {
        stdout: "pipe",
        stderr: "pipe",
      });
      const output = await new Response(proc.stdout).text();
      const lines = output.trim().split("\n").filter(Boolean);
      const matches = lines
        .map((l) => {
          try {
            return JSON.parse(l);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      return { matches: matches.slice(0, 50) };
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  },
};

import { z } from "zod";

const argsSchema = z.object({
  command: z
    .enum(["status", "diff", "log", "branch", "commit", "push", "pull", "stash", "checkout"])
    .describe("Git subcommand"),
  args: z.array(z.string()).optional().describe("Additional arguments"),
});

export const gitTool = {
  name: "git",
  description: "Run git commands. Use 'status', 'diff', 'log', 'commit', etc.",
  parameters: argsSchema,
  execute: async (args: z.infer<typeof argsSchema>) => {
    try {
      const proc = Bun.spawn(["git", args.command, ...(args.args ?? [])], {
        stdout: "pipe",
        stderr: "pipe",
      });
      const [stdout, stderr] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
      ]);
      const exitCode = proc.exitCode ?? -1;
      return { stdout, stderr, exitCode };
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  },
};

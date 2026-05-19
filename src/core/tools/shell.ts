import { z } from "zod";

const argsSchema = z.object({
  command: z.string().describe("Shell command to execute"),
  timeout: z.number().optional().describe("Timeout in seconds (default: 30)"),
});

export const shellTool = {
  name: "shell",
  description: "Execute a shell command and return stdout/stderr.",
  parameters: argsSchema,
  execute: async (args: z.infer<typeof argsSchema>) => {
    try {
      const proc = Bun.spawn(["bash", "-c", args.command], {
        stdout: "pipe",
        stderr: "pipe",
        timeout: (args.timeout ?? 30) * 1000,
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

import { describe, it, expect } from "bun:test";
import { readFileTool } from "../src/core/tools/read-file.js";
import { listDirTool } from "../src/core/tools/list-dir.js";

describe("tools", () => {
  it("read_file reads existing file", async () => {
    const result = await readFileTool.execute({ file: "package.json" });
    expect(result.error).toBeUndefined();
    expect(result.content).toContain("soulforge-light");
  });

  it("list_dir lists current directory", async () => {
    const result = await listDirTool.execute({ path: "." });
    expect(result.error).toBeUndefined();
    expect(result.items).toBeArray();
  });
});

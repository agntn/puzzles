import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";
import { toolListings } from "../../src/mcp.ts";

const toolsDir = fileURLToPath(new URL("../../docs/server/mcp/tools/", import.meta.url));

describe("docs MCP tools", () => {
  it("serves every tool `puzzles mcp` lists, one file each", () => {
    const files = readdirSync(toolsDir).toSorted();
    expect(files).toEqual(
      toolListings.map((tool) => `${tool.name.replaceAll("_", "-")}.ts`).toSorted(),
    );
    for (const file of files) {
      const name = file.slice(0, -".ts".length).replaceAll("-", "_");
      expect(readFileSync(`${toolsDir}${file}`, "utf8")).toBe(
        `export default puzzlesMcpTool(${JSON.stringify(name)});\n`,
      );
    }
  });
});

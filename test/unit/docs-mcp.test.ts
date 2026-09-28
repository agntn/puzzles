import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { describe, expect, it, vi } from "vite-plus/test";
import { toolListings } from "../../src/mcp.ts";
import { firstText } from "../support/mcp.ts";

/*
 * The toolkit's server entry pulls in the Nitro runtime, and `defineMcpTool` hands its definition
 * back as it is. The path is the file `@nuxtjs/mcp-toolkit/server` resolves to from the docs.
 */
vi.mock(
  "../../docs/node_modules/@nuxtjs/mcp-toolkit/dist/runtime/server/mcp/definitions/index.js",
  () => ({
    defineMcpTool: (definition: unknown) => definition,
  }),
);

const toolsDir = fileURLToPath(new URL("../../docs/server/mcp/tools/", import.meta.url));

/**
 * A client connected to an SDK server that carries every docs tool, registered the way the
 * toolkit's `registerToolFromDefinition` does it.
 *
 * @returns {Promise<Client>} The connected client.
 */
async function docsClient(): Promise<Client> {
  const { puzzlesMcpTool } = await import("../../docs/server/utils/puzzles-mcp.ts");
  const server = new McpServer({ name: "docs", version: "0.0.0" });
  for (const listing of toolListings) {
    const tool = puzzlesMcpTool(listing.name);
    // The toolkit types handlers loosely and normalizes their results; this one returns a result as is.
    const handler = tool.handler as (
      args: Readonly<Record<string, unknown>>,
    ) => Promise<CallToolResult>;
    server.registerTool(listing.name, tool, handler);
  }
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "0.0.0" });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

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

  it("keeps a schema with parameters closed, so a misspelled filter fails", async () => {
    const client = await docsClient();
    const { tools } = await client.listTools();
    for (const listing of toolListings) {
      const served = tools.find((tool) => tool.name === listing.name);
      expect(served?.inputSchema.additionalProperties === false, listing.name).toBe(
        listing.inputSchema.additionalProperties === false,
      );
    }

    const misspelled = await client.callTool({
      name: "puzzles_list",
      arguments: { colection: "b1000", limit: 1 },
    });
    expect(misspelled.isError).toBe(true);
    expect(firstText(misspelled)).toContain('"colection"');

    const open = await client.callTool({ name: "puzzles_stats", arguments: { _: "" } });
    expect(open.isError).toBeFalsy();
    expect(firstText(open)).toMatch(/^Total: /u);
  });
});

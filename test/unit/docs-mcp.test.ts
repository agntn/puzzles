import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { describe, expect, it, vi } from "vite-plus/test";
import { callTool, toolListings } from "../../src/mcp.ts";
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

  /** The SDK stamps its own `$schema` on top, and `toEqual` reads an undefined key as absent. */
  it("lists the schema `puzzles mcp` lists, so a misspelled filter fails", async () => {
    const client = await docsClient();
    const { tools } = await client.listTools();
    for (const listing of toolListings) {
      const served = tools.find((tool) => tool.name === listing.name);
      expect({ ...served?.inputSchema, $schema: undefined }, listing.name).toEqual(
        listing.inputSchema,
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

  it("reads a call without arguments as `{}`, like `puzzles mcp`", async () => {
    const client = await docsClient();
    const served = await client.callTool({ name: "puzzles_stats" });
    expect(served.isError).toBeFalsy();
    expect(served.content).toEqual((await callTool("puzzles_stats", {})).content);

    const required = await client.callTool({ name: "puzzles_show" });
    expect(required.isError).toBe(true);
    expect(required.content).toEqual((await callTool("puzzles_show", {})).content);
  });

  it("refuses an unknown key in the words of `puzzles mcp`, sanitized", async () => {
    const client = await docsClient();
    const key = ["x", String.fromCodePoint(0x202e), "y", String.fromCodePoint(0x2028), "z"].join(
      "",
    );
    const args = { [key]: 1 };

    const served = await client.callTool({ name: "puzzles_list", arguments: args });
    expect(served.isError).toBe(true);
    expect(served.content).toEqual((await callTool("puzzles_list", args)).content);
    for (const code of [0x202e, 0x2028]) {
      expect(firstText(served)).not.toContain(String.fromCodePoint(code));
    }
  });
});

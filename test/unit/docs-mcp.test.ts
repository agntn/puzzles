import type { ToolkitTool } from "@agntn/tools/toolkit";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { describe, expect, it, vi } from "vite-plus/test";
import { callTool, toolListings } from "../../src/mcp.ts";
import { firstText } from "../support/mcp.ts";

/*
 * The toolkit's server entry pulls in the Nitro runtime, so the handler gets its options back and
 * two page tools. The path is the file `@nuxtjs/mcp-toolkit/server` resolves to from the docs.
 */
vi.mock(
  "../../docs/node_modules/@nuxtjs/mcp-toolkit/dist/runtime/server/mcp/definitions/index.js",
  () => ({
    defineMcpHandler: (options: unknown) => options,
    getMcpTools: async () => [{ name: "list-pages" }, { name: "get-page" }],
  }),
);

/* The worker bundles one `@agntn/tools`, so the handler gets the root's copy here too. */
vi.mock(
  "../../docs/node_modules/@agntn/tools/dist/toolkit.mjs",
  async () => await import("@agntn/tools/toolkit"),
);

/* What `server/mcp/index.ts` serves for one request, Docus page tools included. */
async function docsTools(): Promise<readonly ToolkitTool[]> {
  const { default: handler } = await import("../../docs/server/mcp/index.ts");
  const { tools } = handler;
  if (typeof tools !== "function") throw new TypeError("the handler should resolve its tools");
  return (await tools(undefined as never)) as ToolkitTool[];
}

/* An SDK v1 client on every puzzle tool, registered the way the toolkit does it. */
async function docsClient(): Promise<Client> {
  const server = new McpServer({ name: "docs", version: "0.0.0" });
  for (const tool of await docsTools()) {
    if (!tool.name.startsWith("puzzles_")) continue;
    const handler = tool.handler as (args: unknown) => Promise<CallToolResult>;
    server.registerTool(tool.name, tool as never, handler);
  }
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "0.0.0" });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

describe("docs MCP tools", () => {
  it("serves every tool `puzzles mcp` lists after the Docus page tools", async () => {
    expect((await docsTools()).map((tool) => tool.name)).toEqual([
      "list-pages",
      "get-page",
      ...toolListings.map((tool) => tool.name),
    ]);
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
      arguments: { colection: "bits", limit: 1 },
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
    expect(served).toEqual(await callTool("puzzles_stats", {}));

    const required = await client.callTool({ name: "puzzles_show" });
    expect(required.isError).toBe(true);
    expect(required).toEqual(await callTool("puzzles_show", {}));
  });

  it("refuses an unknown key in the words of `puzzles mcp`, sanitized", async () => {
    const client = await docsClient();
    const key = ["x", String.fromCodePoint(0x202e), "y", String.fromCodePoint(0x2028), "z"].join(
      "",
    );
    const args = { [key]: 1 };

    const served = await client.callTool({ name: "puzzles_list", arguments: args });
    expect(served.isError).toBe(true);
    expect(served).toEqual(await callTool("puzzles_list", args));
    for (const code of [0x202e, 0x2028]) {
      expect(firstText(served)).not.toContain(String.fromCodePoint(code));
    }
  });

  it("holds puzzles_verify to one id, so a filter can't spend the worker's CPU", async () => {
    const client = await docsClient();
    const { tools } = await client.listTools();
    const verify = tools.find((tool) => tool.name === "puzzles_verify");
    expect(Object.keys(verify?.inputSchema.properties ?? {})).toEqual(["id"]);
    expect(verify?.description).not.toContain("filters");

    const filtered = await client.callTool({
      name: "puzzles_verify",
      arguments: { technique: "md5-to-bip39-entropy" },
    });
    expect(filtered.isError).toBe(true);
    expect(firstText(filtered)).toContain('"technique"');

    const one = await client.callTool({ name: "puzzles_verify", arguments: { id: "bits/1" } });
    expect(firstText(one)).toMatch(/^bits\/1: verified, derives /u);
  });
});

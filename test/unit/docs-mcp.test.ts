import type { ToolkitTool } from "@agntn/tools/toolkit";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { describe, expect, it, vi } from "vite-plus/test";
import { callTool, toolListings } from "../../src/mcp.ts";
import { MENTION_LIMIT } from "../../src/tool-operations.ts";
import { firstText } from "../support/mcp.ts";

/** The module the docs plugins import `defineNitroPlugin` from, as `docs/` resolves it. */
const NITRO_RUNTIME = "../../docs/node_modules/nitropack/dist/runtime/index.mjs";

/*
 * The toolkit's server entry pulls in the Nitro runtime, so the handler gets its options back, two
 * page tools and the resource pool it was asked for. The path is the file
 * `@nuxtjs/mcp-toolkit/server` resolves to from the docs.
 */
vi.mock(
  "../../docs/node_modules/@nuxtjs/mcp-toolkit/dist/runtime/server/mcp/definitions/index.js",
  () => ({
    defineMcpHandler: (options: unknown) => options,
    getMcpTools: async () => [{ name: "list-pages" }, { name: "get-page" }],
    getMcpResources: async (options: object) => [{ uri: "ui://mcp-app/registry", options }],
  }),
);

/* The worker bundles one `@agntn/tools`, so the handler gets the root's copy here too. */
vi.mock(
  "../../docs/node_modules/@agntn/tools/dist/toolkit.mjs",
  async () => await import("@agntn/tools/toolkit"),
);

/* The part of the toolkit's `mcp:server:created` context the capability plugin touches. */
interface ServerCreated {
  readonly server: { readonly server: { readonly registerCapabilities: (added: object) => void } };
}

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

  /* The toolkit tags the app's page with its folder, and `orphansOnly` would drop it from `/mcp`. */
  it("serves the registry app's page with every other resource, not only the untagged ones", async () => {
    const { default: handler } = await import("../../docs/server/mcp/index.ts");
    const { resources } = handler;
    if (typeof resources !== "function")
      throw new TypeError("the handler should resolve its resources");
    expect(await resources(undefined as never)).toEqual([
      { uri: "ui://mcp-app/registry", options: { event: undefined } },
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

  it("fills ChatGPT's @ picker with puzzle pages the model never sees", async () => {
    const client = await docsClient();
    const { tools } = await client.listTools();
    const mentions = tools.find((tool) => tool.name === "puzzles_mentions");
    expect(mentions?._meta).toEqual({ ui: { visibility: ["app"] } });
    expect(mentions?.annotations?.readOnlyHint).toBe(true);
    expect(mentions?.outputSchema?.properties).toHaveProperty("items");

    const served = await client.callTool({ name: "puzzles_mentions", arguments: { query: "71" } });
    expect(served).toEqual(await callTool("puzzles_mentions", { query: "71" }));
    const { items } = served.structuredContent as { items: { name: string }[] };
    expect(items[0]).toEqual({
      type: "resource_link",
      uri: "https://puzzles.agntn.dev/collections/bits/71",
      name: "bits/71",
      description: expect.stringMatching(/^unsolved, [\d.]+ BTC$/u) as unknown,
      mimeType: "text/html",
    });
    expect(firstText(served).split("\n")[0]).toBe(
      "bits/71  https://puzzles.agntn.dev/collections/bits/71",
    );
  });

  it("answers an empty query with open puzzles and a miss with no picks, never an error", async () => {
    const empty = await callTool("puzzles_mentions", { query: "" });
    const { items } = empty.structuredContent as { items: { description: string }[] };
    expect(items).toHaveLength(MENTION_LIMIT);
    expect(items[0]?.description).toMatch(/^unsolved/u);

    const miss = await callTool("puzzles_mentions", { query: "no-such-puzzle" });
    expect(miss.isError).toBeFalsy();
    expect(miss.structuredContent).toEqual({ items: [] });

    const long = await callTool("puzzles_mentions", { query: "x".repeat(101) });
    expect(long.isError).toBe(true);
  });

  it("names puzzles_mentions in the capability ChatGPT reads", async () => {
    const plugins = vi.fn<(plugin: () => void) => void>();
    const hook = vi.fn<(name: string, handler: (context: ServerCreated) => void) => void>();
    vi.doMock(NITRO_RUNTIME, () => ({
      defineNitroPlugin: plugins,
      useNitroApp: () => ({ hooks: { hook } }),
    }));
    await import("../../docs/server/plugins/mentions.ts");
    plugins.mock.calls[0]?.[0]();
    vi.doUnmock(NITRO_RUNTIME);
    const created = hook.mock.calls.find(([name]) => name === "mcp:server:created")?.[1];

    const server = new McpServer({ name: "docs", version: "0.0.0" });
    created?.({ server });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
    expect(client.getServerCapabilities()?.extensions).toEqual({
      "openai/mentions": { searchTool: "puzzles_mentions" },
    });
  });
});

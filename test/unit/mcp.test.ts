import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { beforeAll, describe, expect, it } from "vitest";
import { createMcpServer } from "../../src/mcp.ts";
import { facts } from "../../src/tool-operations.ts";

const toolNames = Object.values(facts.tools)
  .map((tool) => tool.name)
  .sort();

let client: Client;

beforeAll(async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  client = new Client({ name: "test", version: "0.0.0" });
  await Promise.all([createMcpServer().connect(serverTransport), client.connect(clientTransport)]);
});

function firstText(result: unknown): string {
  if (typeof result !== "object" || result === null || !("content" in result)) {
    return "";
  }
  const { content } = result;
  if (!Array.isArray(content)) {
    return "";
  }
  const first: unknown = content[0];
  return typeof first === "object" && first !== null && "text" in first ? String(first.text) : "";
}

describe("puzzles MCP server", () => {
  it("advertises every read-only puzzle tool", async () => {
    const { tools } = await client.listTools();

    expect(tools.map((tool) => tool.name).sort()).toEqual(toolNames);
    expect(tools.every((tool) => tool.annotations?.readOnlyHint === true)).toBe(true);
    expect(tools.find((tool) => tool.name === "puzzles_balance")?.annotations?.openWorldHint).toBe(
      true,
    );
  });

  it("reports dataset statistics", async () => {
    const result = await client.callTool({ name: "puzzles_stats", arguments: {} });

    expect(firstText(result)).toContain("Total: 332 puzzles in 10 collections");
  });

  it("lists collections with the same rows as the CLI", async () => {
    const result = await client.callTool({ name: "puzzles_collections", arguments: {} });

    expect(firstText(result)).toContain(
      "b1000: 256 puzzles, 83 solved, 77 unsolved, by saatoshi_rising",
    );
    expect(firstText(result).split("\n")).toHaveLength(10);
  });

  it("shows one puzzle", async () => {
    const result = await client.callTool({
      name: "puzzles_show",
      arguments: { id: "b1000/1" },
    });

    expect(firstText(result)).toContain("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
  });

  it("limits list results and reports the match count", async () => {
    const result = await client.callTool({
      name: "puzzles_list",
      arguments: { collection: "b1000", status: "unsolved", limit: 3 },
    });

    expect(firstText(result)).toMatch(/^3 of \d+ matching puzzles:/);
  });

  it("rejects invalid arguments without throwing", async () => {
    const result = await client.callTool({ name: "puzzles_show", arguments: { id: "" } });

    expect(result.isError).toBe(true);
    expect(firstText(result)).toContain("Invalid arguments");
  });

  it("reports an unknown puzzle as a tool error", async () => {
    const result = await client.callTool({
      name: "puzzles_verify",
      arguments: { id: "b1000/does-not-exist" },
    });

    expect(result.isError).toBe(true);
    expect(firstText(result)).toContain("Puzzle not found");
  });

  it("treats Object prototype property names as unknown tools", async () => {
    const result = await client.callTool({ name: "toString", arguments: {} });

    expect(result.isError).toBe(true);
    expect(firstText(result)).toBe('Unknown puzzles tool: "toString"');
  });

  it("strips control characters from echoed error text", async () => {
    const result = await client.callTool({
      name: "puzzles_show",
      arguments: { id: "b1000/\nforged line" },
    });

    expect(result.isError).toBe(true);
    expect(firstText(result)).not.toContain("\n");
    expect(firstText(result)).toContain("Puzzle not found");
  });

  it("strips C1 controls, line separators and bidi overrides from echoed error text", async () => {
    const hostile = [
      "b1000/1",
      String.fromCodePoint(0x9b),
      "31m",
      String.fromCodePoint(0x2028),
      "forged",
      String.fromCodePoint(0x202e),
      "line",
    ].join("");
    const result = await client.callTool({ name: "puzzles_show", arguments: { id: hostile } });

    expect(result.isError).toBe(true);
    const text = firstText(result);
    expect(text).toContain("Puzzle not found");
    for (const code of [0x9b, 0x2028, 0x202e]) {
      expect(text).not.toContain(String.fromCodePoint(code));
    }
  });
});

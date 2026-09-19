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

    expect(firstText(result)).toContain("Total: 333 puzzles in 11 collections");
  });

  it("lists collections with the same rows as the CLI", async () => {
    const result = await client.callTool({ name: "puzzles_collections", arguments: {} });
    const rows = firstText(result).split("\n");

    expect(rows).toHaveLength(11);
    expect(rows).toContain("arweave: 12 puzzles, 0 solved, 4 unsolved, 8 claimed, by Tiamat");
    expect(rows).toContain(
      "b1000: 256 puzzles, 83 solved, 77 unsolved, 96 swept, by saatoshi_rising",
    );
    expect(rows).toContain("warp: 6 puzzles, 4 solved, 0 unsolved, 2 expired, by Keybase");
    expect(rows).toContain("zden: 15 puzzles, 13 solved, 2 unsolved, by Zden");
  });

  it("shows one puzzle", async () => {
    const result = await client.callTool({
      name: "puzzles_show",
      arguments: { id: "b1000/1" },
    });

    expect(firstText(result)).toContain("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
  });

  it("lists the hints of one puzzle with their source and confirmation", async () => {
    const hinted = await client.callTool({
      name: "puzzles_hints",
      arguments: { id: "warp/challenge_1" },
    });
    const several = await client.callTool({
      name: "puzzles_hints",
      arguments: { id: "zden/level_5" },
    });
    const bare = await client.callTool({ name: "puzzles_hints", arguments: { id: "gsmg" } });

    expect(firstText(hinted).split("\n")).toEqual([
      "warp/challenge_1: 1 hint",
      "hints: 1",
      "\tofficial\t-\tthis passphrase is 2 random alphanumeric characters, such as 'X9'.\tsource: https://keybase.io/warp\tconfirmation: https://web.archive.org/web/20131213023906/https://keybase.io/warp/warp_1.0.6_SHA256_e68d4587b0e2ec34a7b554fbd1ed2d0fedfaeacf3e47fbb6c5403e252348cbfc.html (Wayback capture of the challenge page)",
    ]);
    expect(firstText(several).split("\n")).toEqual([
      "zden/level_5: 3 hints",
      "hints: 3",
      "\tofficial\t2018-12-24 10:19:06\tSum of two consecutive following rectangles areas creates one byte of the private key. Apply more operations to obtain the results in byte range.\tsource: https://twitter.com/Zd3N/status/1077146640090316800\tconfirmation: https://web.archive.org/web/20220129183939/https://twitter.com/Zd3N/status/1077146640090316800 (Wayback capture of the tweet, the BTCrypto L5 part of a hints bundle)",
      "\tofficial\t-\tThe new corrected version including new hints! UNSOLVED for over 3 years because the original release was uncomplete! Relaunched on 12th of December 2021. My excuses to everyone!\tsource: https://crypto.haluska.sk/\tconfirmation: https://web.archive.org/web/20220124172559/https://crypto.haluska.sk/ (Wayback capture of the puzzle page)",
      "\tofficial\t-\t(clarity edit: sum of two ~~consecutive~~ following rectangles...)\tsource: https://crypto.haluska.sk/\tconfirmation: https://web.archive.org/web/20220124172559/https://crypto.haluska.sk/ (Wayback capture of the puzzle page, which strikes consecutive out of the 2018 hint)",
    ]);
    expect(firstText(bare)).toBe("gsmg: no hints recorded");
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

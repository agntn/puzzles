import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { beforeAll, describe, expect, it } from "vite-plus/test";
import { createMcpServer } from "../../src/mcp.ts";
import { facts } from "../../src/tool-operations.ts";
import { ASSETS } from "../support/assets.ts";
import { firstText } from "../support/mcp.ts";

const toolNames = Object.values(facts.tools)
  .map((tool) => tool.name)
  .sort();

let client: Client;

beforeAll(async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  client = new Client({ name: "test", version: "0.0.0" });
  await Promise.all([createMcpServer().connect(serverTransport), client.connect(clientTransport)]);
});

describe("puzzles MCP server", () => {
  it("advertises every read-only puzzle tool", async () => {
    const { tools } = await client.listTools();

    expect(tools.map((tool) => tool.name).sort()).toEqual(toolNames);
    expect(tools.every((tool) => tool.annotations?.readOnlyHint === true)).toBe(true);
    expect(tools.find((tool) => tool.name === "puzzles_balance")?.annotations?.openWorldHint).toBe(
      true,
    );
  });

  it("advertises list status as one enum", async () => {
    const { tools } = await client.listTools();
    const status = tools.find((tool) => tool.name === "puzzles_list")?.inputSchema.properties?.[
      "status"
    ];

    expect(status).toMatchObject({
      enum: [...facts.statuses],
      description: facts.parameters.status.description,
    });
    expect(status).not.toHaveProperty("anyOf");
  });

  it("advertises the technique vocabulary as the list filter's enum", async () => {
    const { tools } = await client.listTools();
    const technique = tools.find((tool) => tool.name === "puzzles_list")?.inputSchema.properties?.[
      "technique"
    ];

    expect(technique).toMatchObject({
      enum: [...facts.techniques],
      description: facts.parameters.technique.description,
    });
  });

  it("lists the puzzles built with a technique and names one an address filter left out", async () => {
    const result = await client.callTool({
      name: "puzzles_list",
      arguments: { technique: "beaufort" },
    });
    expect(firstText(result).split("\n")).toEqual([
      "1 matching puzzles:",
      "gsmg\tunsolved\t1.25636967 BTC\t1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe",
    ]);

    const outside = await client.callTool({
      name: "puzzles_list",
      arguments: { technique: "xor", address: "1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe" },
    });
    expect(firstText(outside).split("\n").at(-1)).toBe(
      "gsmg pays to this address, but it records no xor technique.",
    );
  });

  it("reports dataset statistics", async () => {
    const result = await client.callTool({ name: "puzzles_stats", arguments: {} });

    expect(firstText(result)).toContain("Total: 511 puzzles in 38 collections");
    expect(firstText(result)).toMatch(
      /^Techniques: aes 1, ascii-private-key 1, atbash 13, .*, xor 6$/mu,
    );
  });

  it("lists collections with the same rows as the CLI", async () => {
    const result = await client.callTool({ name: "puzzles_collections", arguments: {} });
    const rows = firstText(result).split("\n");

    expect(rows).toHaveLength(38);
    expect(rows).toContain("weave: 12 puzzles, 0 solved, 3 unsolved, 9 claimed, by Tiamat");
    expect(rows).toContain(
      "b1000: 256 puzzles, 83 solved, 77 unsolved, 96 swept, by saatoshi_rising",
    );
    expect(rows).toContain("warp: 6 puzzles, 4 solved, 0 unsolved, 2 expired, by Keybase");
    expect(rows).toContain("zden: 16 puzzles, 14 solved, 1 unsolved, 1 claimed, by Zden");
  });

  it("lists authors and shows one by author or collection key", async () => {
    const rows = firstText(await client.callTool({ name: "puzzles_authors", arguments: {} })).split(
      "\n",
    );
    expect(rows).toHaveLength(35);
    expect(rows).toContain(
      "peter-todd: Peter Todd (person), 1 collection: hash-collision, 6 puzzles",
    );
    expect(rows).toContain("keybase: Keybase (organization), 1 collection: warp, 6 puzzles");

    const byKey = firstText(
      await client.callTool({ name: "puzzles_author", arguments: { key: "zden" } }),
    ).split("\n");
    expect(byKey[0]).toBe("zden\tZden\tperson");
    expect(byKey).toContain("aliases: Zden Hlinka, zd3n");
    expect(byKey).toContain("\tsteemit\thttps://steemit.com/@zden");
    expect(byKey.some((line) => line.startsWith("\t2018-06-20\tSigned the Codex Protocol"))).toBe(
      true,
    );
    expect(byKey.at(-3)).toMatch(/\tsource: https:\/\/crypto\.haluska\.sk\/$/u);
    expect(byKey.slice(-2)).toEqual(["techniques: 1", "\tsteganography\t16 puzzles"]);

    const byCollection = firstText(
      await client.callTool({ name: "puzzles_author", arguments: { key: "hash-collision" } }),
    );
    expect(byCollection.split("\n")[0]).toBe("peter-todd\tPeter Todd\tperson");

    const missing = await client.callTool({ name: "puzzles_author", arguments: { key: "nobody" } });
    expect(missing.isError).toBe(true);
    expect(firstText(missing)).toMatch(
      /^puzzles_author failed: Unknown author: nobody\. Known authors: ktimesg, saatoshi-rising, /u,
    );
  });

  it("lists solvers and shows one by solver key or puzzle identifier", async () => {
    const rows = firstText(await client.callTool({ name: "puzzles_solvers", arguments: {} })).split(
      "\n",
    );
    expect(rows).toContain("pogo: pogo, 2 solves: weave/1, weave/2");

    const byPuzzle = firstText(
      await client.callTool({ name: "puzzles_solver", arguments: { key: "movie-enigma" } }),
    ).split("\n");
    expect(byPuzzle[0]).toBe("rabbidbird\trabbidbird\tkind unknown");
    expect(byPuzzle).toContain("\tmovie-enigma\tsolved\t2026-09-08 01:32:56\t0.001 BTC");
    expect(byPuzzle.at(-1)).toMatch(
      /\tsource: https:\/\/github\.com\/floflo777\/open-crypto-puzzles\/issues\/24$/u,
    );

    const missing = await client.callTool({ name: "puzzles_solver", arguments: { key: "nobody" } });
    expect(missing.isError).toBe(true);
    expect(firstText(missing)).toMatch(
      /^puzzles_solver failed: Unknown solver: nobody\. Known solvers: retired-coder, /u,
    );
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
      arguments: { id: "warp/challenge-1" },
    });
    const several = await client.callTool({
      name: "puzzles_hints",
      arguments: { id: "zden/level-5" },
    });
    const image = await client.callTool({ name: "puzzles_hints", arguments: { id: "gsmg" } });
    const bare = await client.callTool({
      name: "puzzles_hints",
      arguments: { id: "weave/1" },
    });

    expect(firstText(hinted).split("\n")).toEqual([
      "warp/challenge-1: 1 hint",
      "hints: 1",
      "\tofficial\t-\tthis passphrase is 2 random alphanumeric characters, such as 'X9'.\tsource: https://keybase.io/warp\tconfirmation: https://web.archive.org/web/20131213023906/https://keybase.io/warp/warp_1.0.6_SHA256_e68d4587b0e2ec34a7b554fbd1ed2d0fedfaeacf3e47fbb6c5403e252348cbfc.html (Wayback capture of the challenge page)",
    ]);
    expect(firstText(several).split("\n")).toEqual([
      "zden/level-5: 3 hints",
      "hints: 3",
      "\tofficial\t2018-12-24 10:19:06\tSum of two consecutive following rectangles areas creates one byte of the private key. Apply more operations to obtain the results in byte range.\tsource: https://twitter.com/Zd3N/status/1077146640090316800\tconfirmation: https://web.archive.org/web/20220129183939/https://twitter.com/Zd3N/status/1077146640090316800 (Wayback capture of the tweet, the BTCrypto L5 part of a hints bundle)",
      "\tofficial\t-\tThe new corrected version including new hints! UNSOLVED for over 3 years because the original release was uncomplete! Relaunched on 12th of December 2021. My excuses to everyone!\tsource: https://crypto.haluska.sk/\tconfirmation: https://web.archive.org/web/20220124172559/https://crypto.haluska.sk/ (Wayback capture of the puzzle page)",
      "\tofficial\t-\t(clarity edit: sum of two ~~consecutive~~ following rectangles...)\tsource: https://crypto.haluska.sk/\tconfirmation: https://web.archive.org/web/20220124172559/https://crypto.haluska.sk/ (Wayback capture of the puzzle page, which strikes consecutive out of the 2018 hint)",
    ]);
    expect(firstText(image).split("\n")).toEqual([
      "gsmg: 1 hint asset",
      `hint assets: ${ASSETS}/assets/gsmg/follow-the-white-rabbit.png`,
    ]);
    expect(firstText(bare)).toBe("weave/1: no hints recorded");
  });

  it("walks the stages of a puzzle with their pages and published answers", async () => {
    const staged = firstText(
      await client.callTool({ name: "puzzles_stages", arguments: { id: "gsmg" } }),
    ).split("\n");
    const bare = await client.callTool({ name: "puzzles_stages", arguments: { id: "b1000/71" } });

    expect(staged.slice(0, 2)).toEqual(["gsmg: 7 stages", "stages: 7"]);
    expect(staged.filter((line) => line.startsWith("\t\tanswer: "))).toHaveLength(5);
    expect(staged).toContain("\t\tthe seed is planted\thttps://gsmg.io/theseedisplanted");
    expect(firstText(bare)).toBe("b1000/71: no stages recorded");
  });

  it("lists Movie Enigma's official hints without extra confirmation links", async () => {
    const result = await client.callTool({
      name: "puzzles_hints",
      arguments: { id: "movie-enigma" },
    });

    expect(firstText(result).split("\n")).toEqual([
      "movie-enigma: 3 hints",
      "hints: 3",
      "\tofficial\t-\tGuess all the 34 movie titles, from the provided movie frames\tsource: https://bitcoinmovieenigma.com/rules",
      '\tofficial\t-\tTransform "somehow" each movie title into an English BIP-0039 seed word\tsource: https://bitcoinmovieenigma.com/rules',
      '\tofficial\t-\tThe seedphrase you have is 34 words long, but we should have a 24 words seedphrase instead. Some movies should not be in the sequence, and should be considered intruders, but which ones ? You will need additional informations about each movie to detect those intruders "somehow". Every information you need can be found on IMBD, on each movie\'s page\tsource: https://bitcoinmovieenigma.com/rules',
    ]);
  });

  it("limits list results and reports the match count", async () => {
    const result = await client.callTool({
      name: "puzzles_list",
      arguments: { collection: "b1000", status: "unsolved", limit: 3 },
    });

    expect(firstText(result)).toMatch(/^3 of \d+ matching puzzles:/);
  });

  it("advertises and follows list offsets through the MCP transport", async () => {
    const { tools } = await client.listTools();
    const list = tools.find((tool) => tool.name === "puzzles_list");
    expect(list?.inputSchema.properties?.["offset"]).toMatchObject(facts.parameters.offset);
    expect(list?.description).toBe(facts.tools.list.description);

    const result = await client.callTool({
      name: "puzzles_list",
      arguments: { collection: "b1000", offset: 1, limit: 1 },
    });
    expect(firstText(result).split("\n")).toEqual([
      "1 of 256 matching puzzles (offset 1):",
      "b1000/2\tsolved\t0.002 BTC\t1CUNEBjYrCn2y1SdiUMohaKUi4wpP326Lb",
      "Next page: offset=2. Keep the same filters.",
    ]);
    const rejected = await client.callTool({ name: "puzzles_list", arguments: { offset: -1 } });
    expect(rejected.isError).toBe(true);
    expect(firstText(rejected)).toContain("Invalid arguments");
  });

  it("rejects invalid arguments without throwing", async () => {
    const result = await client.callTool({ name: "puzzles_show", arguments: { id: "" } });

    expect(result.isError).toBe(true);
    expect(firstText(result)).toContain("Invalid arguments");
  });

  it("names an argument the tool does not take instead of ignoring it", async () => {
    const misspelled = await client.callTool({
      name: "puzzles_list",
      arguments: { collection: "b1000", with_pubkey: true },
    });
    const stray = await client.callTool({
      name: "puzzles_show",
      arguments: { id: "b1000/71", name: "71" },
    });

    expect(misspelled.isError).toBe(true);
    expect(firstText(misspelled)).toBe(
      'Invalid arguments: unknown property "with_pubkey"; takes address, collection, chain, status, technique, withPubkey, limit, offset',
    );
    expect(stray.isError).toBe(true);
    expect(firstText(stray)).toBe('Invalid arguments: unknown property "name"; takes id');
  });

  it("names the values an enum takes", async () => {
    const result = await client.callTool({ name: "puzzles_list", arguments: { status: "open" } });

    expect(result.isError).toBe(true);
    expect(firstText(result)).toBe(
      `Invalid arguments at /status: must be one of ${facts.statuses.join(", ")}`,
    );
  });

  it("reports every invalid argument in one answer", async () => {
    const result = await client.callTool({
      name: "puzzles_list",
      arguments: { colection: "b1000", status: "open", chain: "solana", limit: 0 },
    });

    expect(result.isError).toBe(true);
    expect(firstText(result).split("\n")).toEqual([
      `Invalid arguments: unknown property "colection"; takes address, collection, chain, status, technique, withPubkey, limit, offset`,
      `Invalid arguments at /chain: must be one of ${facts.chains.join(", ")}`,
      `Invalid arguments at /status: must be one of ${facts.statuses.join(", ")}`,
      "Invalid arguments at /limit: must be >= 1",
    ]);
  });

  it("leaves the tools without arguments open to a placeholder key", async () => {
    const result = await client.callTool({ name: "puzzles_stats", arguments: { _: "" } });

    expect(result.isError).toBeFalsy();
    expect(firstText(result)).toMatch(/^Total: /u);
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

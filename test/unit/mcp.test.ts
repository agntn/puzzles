import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { existsSync, readFileSync } from "node:fs";
import { beforeAll, describe, expect, it, vi } from "vite-plus/test";
import { createMcpServer } from "../../src/mcp.ts";
import { serverInfo } from "../../src/server-info.ts";
import { facts } from "../../src/tool-operations.ts";
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
  it("introduces itself with a description and icons the site serves", () => {
    expect(client.getServerVersion()).toEqual(serverInfo);
    for (const icon of serverInfo.icons) {
      const file = new URL(`../../docs/public${new URL(icon.src).pathname}`, import.meta.url);
      expect(existsSync(file), icon.src).toBe(true);
    }
  });

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

    expect(firstText(result)).toContain("Total: 551 puzzles in 47 collections");
    expect(firstText(result)).toMatch(
      /^Techniques: aes 3, ascii-private-key 1, atbash 14, .*, xor 7$/mu,
    );
  });

  it("lists collections with the same rows as the CLI", async () => {
    const result = await client.callTool({ name: "puzzles_collections", arguments: {} });
    const rows = firstText(result).split("\n");

    expect(rows).toHaveLength(47);
    expect(rows).toContain("weave: 12 puzzles, 0 solved, 3 unsolved, 9 claimed, by Tiamat");
    expect(rows).toContain(
      "bits: 256 puzzles, 83 solved, 77 unsolved, 96 swept, by saatoshi_rising",
    );
    expect(rows).toContain("warp: 6 puzzles, 4 solved, 0 unsolved, 2 expired, by Keybase");
    expect(rows).toContain("zden: 16 puzzles, 14 solved, 1 unsolved, 1 claimed, by Zden");
  });

  it("lists authors and shows one by author or collection key", async () => {
    const rows = firstText(await client.callTool({ name: "puzzles_authors", arguments: {} })).split(
      "\n",
    );
    expect(rows).toHaveLength(41);
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
      /^puzzles_author failed: Unknown author: nobody\. Known authors: ktimesg, bobby-lee, /u,
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
      arguments: { id: "bits/1" },
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
      "files: 1 file, 1 archived source; puzzles_assets lists them and reads one by its path",
    ]);
    expect(firstText(image).split("\n")).toEqual([
      "gsmg: 1 hint asset",
      "hint assets: assets/gsmg/follow-the-white-rabbit.png",
      "files: 6 files, 0 archived sources; puzzles_assets lists them and reads one by its path",
    ]);
    expect(firstText(bare)).toBe("weave/1: no hints recorded");
  });

  it("walks the stages of a puzzle with their pages and published answers", async () => {
    const staged = firstText(
      await client.callTool({ name: "puzzles_stages", arguments: { id: "gsmg" } }),
    ).split("\n");
    const bare = await client.callTool({ name: "puzzles_stages", arguments: { id: "bits/71" } });

    expect(staged.slice(0, 2)).toEqual(["gsmg: 7 stages", "stages: 7"]);
    expect(staged.filter((line) => line.startsWith("\t\tanswer: "))).toHaveLength(5);
    expect(staged).toContain("\t\tthe seed is planted\thttps://gsmg.io/theseedisplanted");
    expect(firstText(bare)).toBe("bits/71: no stages recorded");
  });

  it("lists a puzzle's files and the archived copies of the pages it cites", async () => {
    const files = firstText(
      await client.callTool({ name: "puzzles_assets", arguments: { id: "gsmg" } }),
    ).split("\n");
    const sources = firstText(
      await client.callTool({ name: "puzzles_assets", arguments: { id: "quizchain2/34" } }),
    ).split("\n");
    const bare = await client.callTool({ name: "puzzles_assets", arguments: { id: "bits/71" } });

    expect(files[0]).toBe("gsmg: 6 files, 0 archived sources");
    expect(files.map((line) => line.split("\t").slice(0, 2).join(" "))).toContain(
      "artifact assets/gsmg/phase3.txt",
    );
    expect(sources.slice(0, 2)).toEqual([
      "quizchain2/34: 0 files, 3 archived sources",
      "source\tassets/sources/quizchain2/aoinakamoto-2019-06-09-byqc7s.md\tpublished 2019-06-09\tcites https://www.reddit.com/r/Grycoin/comments/byqc7s/7_mbtc_quizchain2_block_34/\tscreenshot .png",
    ]);
    expect(sources).toHaveLength(4);
    expect(sources[2]).toMatch(/^source \(author\)\tassets\/sources\/satoshi-birthday-quiz\//);
    expect(firstText(bare)).toBe("bits/71: no files and no archived sources");
  });

  it("reads a file as text or as an image, only with the bytes the record pins", async () => {
    const requested: string[] = [];
    /* Neither the tag nor main holds puzzle.png, so the read falls back to the author's URL. */
    vi.stubGlobal("fetch", async (input: unknown) => {
      const url = String(input);
      requested.push(url);
      const path = /\/v[^/]+\/(assets\/.+)$/.exec(url)?.[1];
      if (url === "https://gsmg.io/puzzle") {
        return new Response(readFileSync("assets/gsmg/puzzle.png"));
      }
      return path === undefined || path === "assets/gsmg/puzzle.png"
        ? new Response(null, { status: 404 })
        : new Response(readFileSync(path));
    });
    const call = (id: string, file: string) =>
      client.callTool({ name: "puzzles_assets", arguments: { id, file } });

    const page = await call("gsmg", "assets/gsmg/phase2.txt");
    const image = await call("gsmg", "assets/gsmg/puzzle.png");
    const copy = await call(
      "quizchain2/34",
      "assets/sources/quizchain2/aoinakamoto-2019-06-09-byqc7s.md",
    );

    expect(firstText(page)).toMatch(
      /^assets\/gsmg\/phase2\.txt\t910 bytes\tsha256 5e583d5b\w+\tthe bytes the record pins\tfrom https:\/\/raw\.githubusercontent\.com\//,
    );
    expect(page.content[1]).toEqual({
      type: "text",
      text: readFileSync("assets/gsmg/phase2.txt", "utf8"),
    });
    expect(firstText(image)).toMatch(/\tfrom https:\/\/gsmg\.io\/puzzle$/);
    expect(image.content[1]).toEqual({
      type: "image",
      mimeType: "image/png",
      data: readFileSync("assets/gsmg/puzzle.png").toString("base64"),
    });
    expect(firstText(copy)).toMatch(/\tunpinned\tfrom https:\/\/raw\.githubusercontent\.com\//);
    expect((copy.content as { text: string }[])[1]?.text).toContain(
      "# [7 mbtc] Quizchain2 Block 34",
    );
    expect(
      requested.filter((url) => url.endsWith("/puzzle.png") || url.endsWith("/puzzle")),
    ).toEqual([
      expect.stringMatching(/\/v[^/]+\/assets\/gsmg\/puzzle\.png$/),
      "https://raw.githubusercontent.com/agntn/puzzles/main/assets/gsmg/puzzle.png",
      "https://gsmg.io/puzzle",
    ]);
  });

  it("refuses a copy with other bytes, a path the listing lacks and a file too large to return", async () => {
    const requested: string[] = [];
    vi.stubGlobal("fetch", async (input: unknown) => {
      requested.push(String(input));
      return new Response("not the page\n");
    });
    const call = (id: string, file: string) =>
      client.callTool({ name: "puzzles_assets", arguments: { id, file } });

    const changed = await call("gsmg", "assets/gsmg/phase2.txt");
    const unknown = await call("gsmg", "assets/gsmg/nope.txt");
    const large = await call("zden/codex-protocol", "assets/zden/codex-protocol/puzzle.png");

    expect(changed.isError).toBe(true);
    expect(firstText(changed)).toContain(
      "Could not read assets/gsmg/phase2.txt: https://raw.githubusercontent.com/agntn/puzzles/",
    );
    expect(firstText(changed)).toContain("holds other bytes, 13 with SHA-256 ");
    expect(unknown.isError).toBe(true);
    expect(firstText(unknown)).toBe(
      'puzzles_assets failed: Invalid file: "assets/gsmg/nope.txt" is not a file of gsmg; call puzzles_assets without file for the list',
    );
    expect(large.isError).toBe(true);
    expect(firstText(large)).toContain(
      "20434999 bytes is more than the 3932160 a read returns, so download it from https://raw.githubusercontent.com/",
    );
    expect(requested.some((url) => url.includes("codex-protocol"))).toBe(false);
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
      "files: 1 file, 1 archived source; puzzles_assets lists them and reads one by its path",
    ]);
  });

  it("limits list results and reports the match count", async () => {
    const result = await client.callTool({
      name: "puzzles_list",
      arguments: { collection: "bits", status: "unsolved", limit: 3 },
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
      arguments: { collection: "bits", offset: 1, limit: 1 },
    });
    expect(firstText(result).split("\n")).toEqual([
      "1 of 256 matching puzzles (offset 1):",
      "bits/2\tsolved\t0.002 BTC\t1CUNEBjYrCn2y1SdiUMohaKUi4wpP326Lb",
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
      arguments: { collection: "bits", with_pubkey: true },
    });
    const stray = await client.callTool({
      name: "puzzles_show",
      arguments: { id: "bits/71", name: "71" },
    });

    expect(misspelled.isError).toBe(true);
    expect(firstText(misspelled)).toBe(
      'Invalid arguments: unknown property "with_pubkey"; takes address, collection, chain, status, technique, withPubkey, limit, offset',
    );
    expect(stray.isError).toBe(true);
    expect(firstText(stray)).toBe(
      'Invalid arguments: unknown property "name"; takes id, allTransactions',
    );
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
      arguments: { colection: "bits", status: "open", chain: "solana", limit: 0 },
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

  it("verifies every puzzle a filter matches in one call", async () => {
    const result = await client.callTool({
      name: "puzzles_verify",
      arguments: { collection: "doges-gambit" },
    });

    expect(result.isError).toBeFalsy();
    expect(firstText(result)).toBe(
      "2 puzzles: 2 verified, 0 not verified, 0 unverifiable\nVerified: doges-gambit/eth, doges-gambit/doge",
    );
  });

  it("reports an unknown puzzle as a tool error", async () => {
    const result = await client.callTool({
      name: "puzzles_verify",
      arguments: { id: "bits/does-not-exist" },
    });

    expect(result.isError).toBe(true);
    expect(firstText(result)).toContain("Puzzle not found");
  });

  it("points a collection key at the puzzles it holds", async () => {
    const result = await client.callTool({ name: "puzzles_hints", arguments: { id: "quizchain" } });

    expect(result.isError).toBe(true);
    expect(firstText(result)).toContain(
      "quizchain is a collection of 77 puzzles, so ask for one of them, quizchain/1 to quizchain/77",
    );
  });

  it("treats Object prototype property names as unknown tools", async () => {
    const result = await client.callTool({ name: "toString", arguments: {} });

    expect(result.isError).toBe(true);
    expect(firstText(result)).toBe('Unknown puzzles tool: "toString"');
  });

  it("strips control characters from echoed error text", async () => {
    const result = await client.callTool({
      name: "puzzles_show",
      arguments: { id: "bits/\nforged line" },
    });

    expect(result.isError).toBe(true);
    expect(firstText(result)).not.toContain("\n");
    expect(firstText(result)).toContain("Puzzle not found");
  });

  it("strips C1 controls, line separators and bidi overrides from echoed error text", async () => {
    const hostile = [
      "bits/1",
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

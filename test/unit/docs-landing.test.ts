import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { authorFacts, authorRows } from "../../docs/app/utils/authors.ts";
import {
  collectionFacts,
  collectionFilterQuery,
  collectionRows,
  matchesCollection,
  NO_COLLECTION_FILTER,
  readCollectionFilter,
} from "../../docs/app/utils/collections.ts";
import {
  AUTHORS_STATIC,
  FACTS_STATIC,
  LANDING_STATIC,
  STATS_STATIC,
  WALK,
} from "../../docs/app/utils/landing.ts";
import { toPuzzleView } from "../../docs/app/utils/puzzle-view.ts";
import { keyLiteral, toSample } from "../../docs/app/utils/samples.ts";

/*
 * The docs helpers take the library as an argument, so the test hands them `src/` and the
 * site hands them the aliased `@agntn/puzzles`. A record change that isn't mirrored into the
 * static copy fails here, before the landing ships a stale value.
 */
describe("docs landing fixtures", () => {
  it("match what the library computes for every puzzle in the walk", async () => {
    const library = await import("../../src/index.ts");
    const { showTool } = await import("../../src/tool-operations.ts");

    expect(LANDING_STATIC.map((sample) => sample.id)).toEqual(WALK);
    for (const [position, id] of WALK.entries()) {
      const puzzle = await library.requirePuzzle(id);
      const tool = (await showTool(id)).content[0]?.text ?? "";
      expect(await toSample(library, puzzle, tool)).toEqual(LANDING_STATIC[position]);
    }
  });

  it("labels the solution file separately from its solver on the puzzle page", async () => {
    const library = await import("../../src/index.ts");
    const puzzle = await library.requirePuzzle("movie-enigma");
    const view = await toPuzzleView(library, puzzle, "", [], []);

    expect(view.solverName).toBe("rabbidbird");
    expect(view.solverUrl).toBe("https://github.com/rabbidbird");
    expect(view.assets).toEqual([
      {
        label: "solution",
        path: "assets/movie-enigma/solution.md",
        url: "/assets/movie-enigma/solution.md",
        image: false,
      },
    ]);
  });

  it("encodes file names in asset and stage links so a # or ? still reaches the file", async () => {
    const library = await import("../../src/index.ts");
    const puzzle = library.puzzle({
      id: "fixture/odd",
      chain: "bitcoin",
      address: library.p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      assets: library.assets({ puzzle: "grid #1.png", hints: ["odd/hint?.svg"] }),
      stages: [
        library.stage("one", "A blob.", [
          library.artifact("blob", "https://example.com/a", "blob #2.txt"),
        ]),
      ],
    });
    const view = await toPuzzleView(library, puzzle, "", [], []);

    expect(view.assets.map((asset) => asset.url)).toEqual([
      "/assets/fixture/grid%20%231.png",
      "/assets/fixture/odd/hint%3F.svg",
    ]);
    expect(view.assets.map((asset) => asset.path)).toEqual([
      "assets/fixture/grid #1.png",
      "assets/fixture/odd/hint?.svg",
    ]);
    expect(view.stages[0]?.artifacts[0]?.file).toBe("/assets/fixture/blob%20%232.txt");
  });

  it("cover every collection and every builder the key literal mirrors", async () => {
    const library = await import("../../src/index.ts");

    expect(new Set(LANDING_STATIC.map((sample) => sample.collection))).toEqual(
      new Set(library.collectionKeys()),
    );
    const literals = LANDING_STATIC.map((sample) => sample.keyLiteral ?? "");
    for (const builder of [
      "hex(",
      ".wif(",
      ".passphrase(",
      "bits(",
      "derivation(",
      ".xpub(",
      ".entropy(",
      ".shares(",
      ".derived(",
    ]) {
      expect(literals.some((literal) => literal.includes(builder))).toBe(true);
    }
    expect(keyLiteral(undefined)).toBeUndefined();
    expect(keyLiteral({ bits: 71 })).toBe("bits(71)");
    expect(keyLiteral({ seed: { phrase: "fortune … moon", path: "m/84'/0'/0'/0/0" } })).toBe(
      `seed("fortune … moon", "m/84'/0'/0'/0/0")`,
    );
    expect(
      keyLiteral({
        seed: { phrase: "fortune … moon", path: "m/84'/0'/0'/0/0", passphrase: "supernova" },
      }),
    ).toBe(`seed("fortune … moon", "m/84'/0'/0'/0/0", "supernova")`);
    expect(keyLiteral({ seed: { phrase: "fortune … moon", passphrase: "supernova" } })).toBe(
      `seed("fortune … moon", undefined, "supernova")`,
    );
  });

  it("pin the statistics and the collection facts", async () => {
    const library = await import("../../src/index.ts");
    const stats = await library.stats();

    expect(STATS_STATIC).toEqual({
      dataVersion: await library.dataVersion(),
      total: stats.total,
      solved: stats.solved,
      unsolved: stats.unsolved,
      claimed: stats.claimed,
      swept: stats.swept,
      expired: stats.expired,
      withPubkey: stats.with_pubkey,
      unsolvedPrize: stats.unsolved_prize,
      totalPrize: stats.total_prize,
    });
    expect(FACTS_STATIC).toEqual((await library.collections()).map(collectionFacts));
    expect(AUTHORS_STATIC).toEqual(authorRows(await library.authors()));
  });

  it("lists every collection, largest first, in README.md", async () => {
    const library = await import("../../src/index.ts");
    const text = readFileSync(new URL("../../README.md", import.meta.url), "utf8");
    const collections = await library.collections();
    const countsByKey = new Map(
      collections.map((collection) => [`\`${collection.key}\``, collection.count()]),
    );
    const counts = text
      .split("\n")
      .filter((line) => line.startsWith("|"))
      .map((line) => line.split("|").map((cell) => cell.trim()))
      .map((cells) => cells.find((cell) => countsByKey.has(cell)))
      .filter((key) => key !== undefined)
      .map((key) => countsByKey.get(key)!);
    expect(counts).toHaveLength(collections.length);
    expect(counts).toEqual([...counts].sort((left, right) => right - left));
  });

  it("list every collection on the index, largest first", async () => {
    const library = await import("../../src/index.ts");
    const rows = collectionRows(await library.collections());
    const counts = rows.map((row) => row.total);

    expect(rows.map((row) => row.key).toSorted()).toEqual([...library.collectionKeys()].toSorted());
    expect(counts).toEqual([...counts].sort((left, right) => right - left));
    expect(rows.find((row) => row.key === "zden")?.chains).toEqual(
      expect.arrayContaining(["bitcoin", "ethereum", "litecoin", "decred"]),
    );
    for (const row of rows) {
      const collection = await library.requireCollection(row.key);
      expect(row.open, row.key).toBe(collection.unsolved().length);
    }
  });

  it("filter the index by chain, state and every word of the search", async () => {
    const library = await import("../../src/index.ts");
    const rows = collectionRows(await library.collections());
    const keys = (filter: Partial<typeof NO_COLLECTION_FILTER>) =>
      rows
        .filter((row) => matchesCollection(row, { ...NO_COLLECTION_FILTER, ...filter }))
        .map((row) => row.key);

    expect(keys({})).toEqual(rows.map((row) => row.key));
    expect(keys({ chain: "arweave" })).toEqual(["weave"]);
    expect(keys({ chain: "ethereum" })).toContain("zden");
    expect(keys({ state: "open" })).toEqual(
      rows.filter((row) => row.open > 0).map((row) => row.key),
    );
    expect(keys({ state: "open" })).not.toContain("quizchain");
    expect(keys({ state: "closed" })).toContain("quizchain");
    expect(keys({ state: "open" }).length + keys({ state: "closed" }).length).toBe(rows.length);
    expect(keys({ text: "  ZDEN " })).toEqual(["zden"]);
    expect(keys({ text: "zden weave" })).toEqual([]);
    expect(
      matchesCollection(
        { key: "warp", total: 1, open: 0, chains: ["bitcoin"], blurb: "A scrypt brainwallet" },
        { ...NO_COLLECTION_FILTER, text: "Brainwallet scrypt" },
      ),
    ).toBe(true);
  });

  it("read and write the index filter as a link", () => {
    const chains = ["bitcoin", "ethereum"];

    expect(readCollectionFilter({}, chains)).toEqual(NO_COLLECTION_FILTER);
    expect(readCollectionFilter({ chain: "ethereum", state: "closed", q: "zden" }, chains)).toEqual(
      {
        chain: "ethereum",
        state: "closed",
        text: "zden",
      },
    );
    expect(readCollectionFilter({ chain: "solana", state: "solved", q: ["a"] }, chains)).toEqual(
      NO_COLLECTION_FILTER,
    );
    expect(readCollectionFilter({ q: "x".repeat(100) }, chains).text).toHaveLength(64);
    expect(collectionFilterQuery(NO_COLLECTION_FILTER)).toEqual({});
    expect(collectionFilterQuery({ chain: "bitcoin", state: "open", text: " key " })).toEqual({
      chain: "bitcoin",
      state: "open",
      q: "key",
    });
  });

  it("read a collection's facts strip without loading another collection", async () => {
    const library = await import("../../src/index.ts");
    const facts = collectionFacts(await library.requireCollection("hash-collision"));

    expect(facts.key).toBe("hash-collision");
    expect(facts.author).toBe("Peter Todd");
    expect(facts.total).toBe(6);
    expect(facts.chains).toEqual(["bitcoin"]);
    expect(facts.withKey).toBe(0);
    expect(facts.hints).toEqual([]);
  });

  it("count an author's techniques, most used first", async () => {
    const library = await import("../../src/index.ts");
    const entry = await library.requireAuthor("aoi-nakamoto");
    const collections = await Promise.all(entry.collections.map(library.requireCollection));
    const facts = authorFacts(entry, collections);

    expect(facts.techniques.map((row) => row.name)).toEqual([
      "md5-to-bip39-entropy",
      "sha256-to-bip39-entropy",
      "atbash",
      "caesar",
    ]);
    expect(facts.techniques.every((row) => row.count <= facts.puzzles)).toBe(true);
  });

  it("carry the hints every puzzle of the collection shares", () => {
    const bits = FACTS_STATIC.find((row) => row.key === "bits");

    expect(bits?.hints.map((hint) => [hint.kind, hint.source])).toEqual([
      ["official", "https://bitcointalk.org/index.php?topic=1306983.msg18765941#msg18765941"],
    ]);
  });
});

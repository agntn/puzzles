import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { authorRows } from "../../docs/app/utils/authors.ts";
import { collectionFacts, collectionRows } from "../../docs/app/utils/collections.ts";
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
    const puzzle = await library.requirePuzzle("movie_enigma");
    const view = await toPuzzleView(library, puzzle, "", []);

    expect(view.solverName).toBe("rabbidbird");
    expect(view.solverUrl).toBe("https://github.com/rabbidbird");
    expect(view.assets).toEqual([
      {
        label: "solution",
        path: "assets/movie_enigma/solution.md",
        url: "/assets/movie_enigma/solution.md",
        image: false,
      },
    ]);
  });

  it("encodes file names in asset and stage links so a # or ? still reaches the file", async () => {
    const library = await import("../../src/index.ts");
    const puzzle = library.bitcoinPuzzle({
      id: "fixture/odd",
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
    const view = await toPuzzleView(library, puzzle, "", []);

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

  it("read a collection's facts strip without loading another collection", async () => {
    const library = await import("../../src/index.ts");
    const facts = collectionFacts(await library.requireCollection("hash_collision"));

    expect(facts.key).toBe("hash_collision");
    expect(facts.author).toBe("Peter Todd");
    expect(facts.total).toBe(6);
    expect(facts.chains).toEqual(["bitcoin"]);
    expect(facts.withKey).toBe(0);
    expect(facts.hints).toEqual([]);
  });

  it("carry the hints every puzzle of the collection shares", () => {
    const b1000 = FACTS_STATIC.find((row) => row.key === "b1000");

    expect(b1000?.hints.map((hint) => [hint.kind, hint.source])).toEqual([
      ["official", "https://bitcointalk.org/index.php?topic=1306983.msg18765941#msg18765941"],
    ]);
  });
});

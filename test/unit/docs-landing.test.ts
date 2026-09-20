import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { collectionFacts } from "../../docs/app/utils/collections.ts";
import { FACTS_STATIC, LANDING_STATIC, STATS_STATIC, WALK } from "../../docs/app/utils/landing.ts";
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
      expect(toSample(library, puzzle, tool)).toEqual(LANDING_STATIC[position]);
    }
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
  });

  it.each(["README.md", "docs/content/index.md", "docs/app/app.config.ts", "docs/nuxt.config.ts"])(
    "keeps the advertised puzzle total current in %s",
    async (path) => {
      const library = await import("../../src/index.ts");
      const text = readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
      const advertised = text.match(/\b(\d+) (?:public crypto )?puzzles\b/u)?.[1];

      expect(advertised).toBe(String((await library.stats()).total));
    },
  );

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

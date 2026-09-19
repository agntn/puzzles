import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ArweaveCollection } from "../../src/collections/arweave.ts";
import { b1000, B1000Collection } from "../../src/collections/b1000.ts";
import { BalletCollection } from "../../src/collections/ballet.ts";
import { BitapsCollection } from "../../src/collections/bitaps.ts";
import { BitimageCollection } from "../../src/collections/bitimage.ts";
import { GsmgCollection } from "../../src/collections/gsmg.ts";
import { HashCollisionCollection } from "../../src/collections/hash_collision.ts";
import { MovieEnigmaCollection } from "../../src/collections/movie_enigma.ts";
import { rushwallet, RushwalletCollection } from "../../src/collections/rushwallet.ts";
import { WarpCollection } from "../../src/collections/warp.ts";
import { ZdenCollection } from "../../src/collections/zden.ts";
import {
  all,
  bitcoinPuzzle,
  builtins,
  Collection,
  collectionKeys,
  collections,
  collectionSummaries,
  community,
  confirmation,
  dataset,
  dataVersion,
  get,
  getCollection,
  hasCollection,
  NamedCollection,
  official,
  p2pkh,
  party,
  PuzzleNotFoundError,
  SingletonCollection,
  stats,
  Status,
} from "../../src/index.ts";

const concreteClasses = [
  ArweaveCollection,
  B1000Collection,
  BalletCollection,
  BitapsCollection,
  BitimageCollection,
  GsmgCollection,
  HashCollisionCollection,
  MovieEnigmaCollection,
  RushwalletCollection,
  WarpCollection,
  ZdenCollection,
] as const;

describe("lazy collection registry", () => {
  it("answers keys and aliases from the manifest without loading a collection", () => {
    expect(collectionKeys()).toEqual(concreteClasses.map((CollectionClass) => CollectionClass.key));
    expect(hasCollection("peter_todd")).toBe(true);
    expect(hasCollection("warpwallet")).toBe(true);
    expect(hasCollection("nope")).toBe(false);
  });

  it("loads one concrete subclass instance per collection, in manifest order", async () => {
    const registered = await collections();

    expect(registered).toHaveLength(concreteClasses.length);
    for (const [index, CollectionClass] of concreteClasses.entries()) {
      expect(registered[index]).toBeInstanceOf(Collection);
      expect(registered[index]).toBeInstanceOf(CollectionClass);
      expect(registered[index]?.key).toBe(CollectionClass.key);
      expect(CollectionClass.puzzles.length).toBeGreaterThan(0);
    }
    expect(await collections()).toBe(registered);
  });

  it("lists every collection module in the manifest and loads the matching instance", async () => {
    /* A collection written but never added to the manifest is the failure mode of a lazy registry. */
    const modules = readdirSync(new URL("../../src/collections/", import.meta.url))
      .filter((entry) => entry.endsWith(".ts") && entry !== "index.ts")
      .map((entry) => entry.slice(0, -3))
      .sort();

    expect(builtins.map((entry) => entry.key).sort()).toEqual(modules);
    for (const entry of builtins) {
      expect((await entry.load()).key).toBe(entry.key);
    }
  });

  it("preserves universal and historical collection lookups", async () => {
    expect((await get("b1000/90"))?.id()).toBe("b1000/90");
    expect((await get("gsmg"))?.id()).toBe("gsmg");
    expect((await get("movie_enigma"))?.id()).toBe("movie_enigma");
    expect((await getCollection("peter_todd"))?.key).toBe("hash_collision");
    expect((await getCollection("warpwallet"))?.key).toBe("warp");
    expect(await get("missing")).toBeUndefined();
  });

  it("resolves a collection query only in the spelling its identifier uses", () => {
    expect([71, "71", "b1000/71"].map((query) => b1000.get(query)?.id())).toEqual([
      "b1000/71",
      "b1000/71",
      "b1000/71",
    ]);
    /* Number() and replace() used to read all of these as 71 or 70, or die on the foreign types. */
    const spellings = ["0x47", "0b1000111", " 71 ", "71.0", "+71", "0071", "7e1"];
    const prefixed = ["b1000/7e1", "b1000/71.0", "b1000/ 71", "71b1000/"];
    const foreign = [undefined, null, true, 71n, {}] as never[];
    expect([...spellings, ...prefixed, ...foreign].map((query) => b1000.get(query))).toEqual(
      [...spellings, ...prefixed, ...foreign].map(() => undefined),
    );
    expect(() => b1000.require("7e1")).toThrow(PuzzleNotFoundError);
    expect(() => b1000.require("7e1")).toThrow("Puzzle not found: 7e1");

    expect(rushwallet.get("9")?.id()).toBe("rushwallet/9");
    expect(rushwallet.get("rushwallet/9")?.id()).toBe("rushwallet/9");
    expect(rushwallet.get(9 as never)).toBeUndefined();
    expect(() => rushwallet.require(9 as never)).toThrow(PuzzleNotFoundError);
  });

  it("hands a puzzle the collection's hints ahead of its own", () => {
    const shared = official(
      "Every key is a consecutive one from a deterministic wallet.",
      "https://example.com/thread",
      confirmation("https://archive.ph/thread"),
    );
    const own = community(
      "Number two sits in the upper half.",
      "https://example.com/thread#reply",
      confirmation("https://archive.ph/thread#reply"),
    );
    const plain = bitcoinPuzzle({
      id: "fixture/1",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
    });
    const hinted = bitcoinPuzzle({
      id: "fixture/2",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      hints: [own],
    });
    const collection = new NamedCollection("fixture", party("Fixture"), [plain, hinted], [shared]);
    const bare = new NamedCollection("bare", party("Bare"), [
      bitcoinPuzzle({
        id: "bare/1",
        address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
        sourceUrl: "https://example.com/puzzle",
        startedAt: "2026-01-01",
      }),
    ]);

    expect(collection.hints).toEqual([shared]);
    expect(Object.isFrozen(collection.hints)).toBe(true);
    expect(collection.hintsFor("1")).toEqual([shared]);
    expect(collection.hintsFor("2")).toEqual([shared, own]);
    expect(Object.isFrozen(collection.hintsFor("2"))).toBe(true);
    expect(collection.hintsById("fixture/2")).toEqual([shared, own]);
    expect(hinted.hints()).toEqual([own]);
    expect(plain.toJSON().hints).toBeUndefined();
    expect(bare.hints).toEqual([]);
    expect(bare.hintsFor("1")).toEqual([]);
    expect(Object.isFrozen(bare.hintsFor("1"))).toBe(true);
    expect(() => collection.hintsFor("3")).toThrow(PuzzleNotFoundError);
    const single = bitcoinPuzzle({
      id: "single",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
    });
    expect(new SingletonCollection("single", party("Single"), [single], [shared]).hints).toEqual([
      shared,
    ]);
  });

  it("summarizes collections with the fields every discovery surface shares", async () => {
    const summaries = await collectionSummaries();

    expect(summaries.map((entry) => entry.key)).toEqual(collectionKeys());
    expect(summaries.find((entry) => entry.key === "b1000")).toEqual({
      key: "b1000",
      author: "saatoshi_rising",
      total: 256,
      solved: 83,
      unsolved: 77,
    });
  });

  it("preserves the dataset statistics", async () => {
    expect(await all()).toHaveLength(333);
    expect(await stats()).toEqual({
      total: 333,
      claimed: 11,
      expired: 2,
      solved: 131,
      swept: 96,
      unsolved: 93,
      with_pubkey: 237,
      total_prize: {
        AR: 5550,
        ETH: 14.1337,
        DAI: 100,
        BTC: 1058.06919775,
        LTC: 230.8255,
        DCR: 460,
      },
      unsolved_prize: {
        AR: 1900,
        ETH: 1,
        BTC: 907.88130493,
      },
    });
  });

  it("derives a stable data version from class data alone", async () => {
    const first = await dataVersion();

    expect(first).toMatch(/^[a-f0-9]{12}$/);
    expect(await dataVersion()).toBe(first);
  });

  it("builds the dataset envelope from the registry", async () => {
    const envelope = await dataset();

    expect(envelope.data_version).toBe(await dataVersion());
    expect(envelope.collections).toHaveLength(concreteClasses.length);
    expect(envelope.collections.map((collection) => collection.name)).toEqual(collectionKeys());
    expect(
      envelope.collections.reduce((total, collection) => total + collection.puzzles.length, 0),
    ).toBe(333);
  });

  it("hands back the memoized views frozen through", async () => {
    const summaries = await collectionSummaries();
    const envelope = await dataset();
    const serialized = envelope.collections;
    const records = serialized.flatMap((entry) => entry.puzzles);
    const parts = [
      envelope,
      ...summaries,
      ...serialized,
      ...serialized.map((entry) => entry.puzzles),
      ...serialized.map((entry) => entry.author),
      ...records,
    ];

    expect(parts.map((part) => Object.isFrozen(part))).toEqual(parts.map(() => true));
    expect(summaries.map((row) => Reflect.set(row, "total", 0))).toEqual(
      summaries.map(() => false),
    );
    expect(records.map((record) => Reflect.set(record, "status", Status.Solved))).toEqual(
      records.map(() => false),
    );
    expect(summaries.map((row) => row.total)).toEqual(
      concreteClasses.map((CollectionClass) => CollectionClass.puzzles.length),
    );
    expect(records.filter((record) => record.status === Status.Solved)).toHaveLength(131);
  });
});

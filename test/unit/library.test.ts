import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ArweaveCollection } from "../../src/collections/arweave.ts";
import { B1000Collection } from "../../src/collections/b1000.ts";
import { BalletCollection } from "../../src/collections/ballet.ts";
import { BitapsCollection } from "../../src/collections/bitaps.ts";
import { BitimageCollection } from "../../src/collections/bitimage.ts";
import { GsmgCollection } from "../../src/collections/gsmg.ts";
import { HashCollisionCollection } from "../../src/collections/hash_collision.ts";
import { RushwalletCollection } from "../../src/collections/rushwallet.ts";
import { WarpCollection } from "../../src/collections/warp.ts";
import { ZdenCollection } from "../../src/collections/zden.ts";
import {
  all,
  builtins,
  Collection,
  collectionKeys,
  collections,
  collectionSummaries,
  dataset,
  dataVersion,
  get,
  getCollection,
  hasCollection,
  stats,
} from "../../src/index.ts";

const concreteClasses = [
  ArweaveCollection,
  B1000Collection,
  BalletCollection,
  BitapsCollection,
  BitimageCollection,
  GsmgCollection,
  HashCollisionCollection,
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
    expect((await getCollection("peter_todd"))?.key).toBe("hash_collision");
    expect((await getCollection("warpwallet"))?.key).toBe("warp");
    expect(await get("missing")).toBeUndefined();
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
    expect(await all()).toHaveLength(332);
    expect(await stats()).toEqual({
      total: 332,
      claimed: 11,
      expired: 2,
      solved: 130,
      swept: 96,
      unsolved: 93,
      with_pubkey: 236,
      total_prize: {
        AR: 5550,
        ETH: 14.1337,
        DAI: 100,
        BTC: 1058.06884913,
        LTC: 230.8255,
        DCR: 460,
      },
      unsolved_prize: {
        AR: 1900,
        ETH: 1,
        BTC: 907.88195631,
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
    ).toBe(332);
  });
});

import { createHash } from "node:crypto";
import { afterAll, describe, expect, it, vi } from "vitest";
import type * as Library from "../../src/index.ts";
import { getCollection, hasCollection } from "../../src/index.ts";

/* The registry has no unregister API on purpose, so mutations run against a fresh module graph. */
async function freshLibrary(): Promise<typeof Library> {
  vi.resetModules();
  return import("../../src/index.ts");
}

describe("registry consistency", () => {
  /* Test files share a worker's module cache, so the mutated graph must not outlive this file. */
  afterAll(() => {
    vi.resetModules();
  });

  it("loads a lazy entry once, however many callers ask", async () => {
    const lib = await freshLibrary();
    const puzzle = lib.bitcoinPuzzle({
      id: "lazyfixture/one",
      address: lib.p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
    });
    let loads = 0;
    lib.registerCollection({
      key: "lazyfixture",
      load: () => {
        loads += 1;
        return Promise.resolve(
          new lib.NamedCollection("lazyfixture", lib.party("fixture"), [puzzle]),
        );
      },
    });

    const [first, second] = await Promise.all([
      lib.getCollection("lazyfixture"),
      lib.getCollection("lazyfixture"),
    ]);
    const third = await lib.getCollection("lazyfixture");

    expect(loads).toBe(1);
    expect(second).toBe(first);
    expect(third).toBe(first);
    expect((await lib.get("lazyfixture/one"))?.id()).toBe("lazyfixture/one");
  });

  it("resolves a historical alias in the collection segment of an identifier", async () => {
    const lib = await freshLibrary();

    expect((await lib.get("peter_todd/sha1"))?.id()).toBe("hash_collision/sha1");
    expect((await lib.get("warpwallet/challenge_1"))?.id()).toBe("warp/challenge_1");
    expect(await lib.get("peter_todd/nope")).toBeUndefined();
  });

  it("refreshes every aggregate after registration and replacement", async () => {
    const lib = await freshLibrary();
    const originalPuzzles = await lib.all();
    const originalCollections = await lib.collections();
    const originalData = await lib.datasetCollections();
    const originalVersion = await lib.dataVersion();
    const makePuzzle = (name: string): Library.Puzzle =>
      lib.bitcoinPuzzle({
        id: `fixture/${name}`,
        address: lib.p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
        sourceUrl: "https://example.com/puzzle",
        startedAt: "2026-01-01",
      });
    const first = makePuzzle("first");
    const added = new lib.NamedCollection("fixture", lib.party("Fixture"), [first]);
    lib.registerCollection(added);

    expect(lib.hasCollection("fixture")).toBe(true);
    expect(await lib.getCollection("fixture")).toBe(added);
    expect(await lib.get("fixture/first")).toBe(first);
    expect(await lib.all()).toHaveLength(originalPuzzles.length + 1);
    expect((await lib.stats()).total).toBe((await lib.all()).length);
    expect(await lib.collections()).toHaveLength(originalCollections.length + 1);
    expect(await lib.datasetCollections()).toHaveLength(originalData.length + 1);
    expect(await lib.dataVersion()).not.toBe(originalVersion);
    /* Snapshots handed out earlier stay intact. */
    expect(originalPuzzles).toHaveLength(332);
    expect(originalCollections).toHaveLength(10);
    expect(originalData).toHaveLength(10);

    const snapshot = await lib.dataset();
    expect(snapshot.data_version).toBe(
      createHash("sha256").update(JSON.stringify(snapshot.collections)).digest("hex").slice(0, 12),
    );
    const cachedPuzzles = await lib.all();
    lib.registerCollection(added); // Registering the same instance is a no-op.
    expect(await lib.all()).toBe(cachedPuzzles);
    expect(await lib.datasetCollections()).toBe(snapshot.collections);

    const second = makePuzzle("second");
    const replacement = new lib.NamedCollection("fixture", lib.party("Fixture"), [second]);
    lib.registerCollection(replacement);
    expect(await lib.get("fixture/first")).toBeUndefined();
    expect(await lib.get("fixture/second")).toBe(second);
    expect(await lib.getCollection("fixture")).toBe(replacement);
    expect(await lib.collections()).toHaveLength(11);
    expect(await lib.all()).toHaveLength(333);
    expect(await lib.dataVersion()).not.toBe(snapshot.data_version);
    expect((await lib.dataset()).collections.at(-1)?.puzzles[0]?.id).toBe("fixture/second");

    for (const key of ["constructor", "toString", "__proto__", "hasOwnProperty"]) {
      const collection = new lib.NamedCollection(key, lib.party("Fixture"), []);
      lib.registerCollection(collection);
      expect(await lib.getCollection(key)).toBe(collection);
    }
  });

  it("registers a manifest entry that loads on first use", async () => {
    const lib = await freshLibrary();
    let loads = 0;
    lib.registerCollection({
      key: "lazy",
      load: () => {
        loads += 1;
        return Promise.resolve(
          new lib.NamedCollection("lazy", lib.party("Lazy"), [
            lib.bitcoinPuzzle({
              id: "lazy/one",
              address: lib.p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
              sourceUrl: "https://example.com/puzzle",
              startedAt: "2026-01-01",
            }),
          ]),
        );
      },
    });

    expect(lib.hasCollection("lazy")).toBe(true);
    expect(loads).toBe(0);
    expect((await lib.get("lazy/one"))?.id()).toBe("lazy/one");
    expect(loads).toBe(1);
  });

  it("does not resolve Object prototype properties as historical aliases", async () => {
    for (const name of ["constructor", "toString", "__proto__", "hasOwnProperty"]) {
      expect(hasCollection(name)).toBe(false);
      expect(await getCollection(name)).toBeUndefined();
    }
  });
});

import { createHash } from "node:crypto";
import { afterAll, describe, expect, it, vi } from "vite-plus/test";
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

  it("caches nothing for a loader that replaces its own key while running", async () => {
    const lib = await freshLibrary();
    const build = (name: string) =>
      new lib.NamedCollection("selffixture", lib.party(name), [
        lib.bitcoinPuzzle({
          id: `selffixture/${name}`,
          address: lib.p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
          sourceUrl: "https://example.com/puzzle",
          startedAt: "2026-01-01",
        }),
      ]);
    lib.registerCollection({
      key: "selffixture",
      load: () => {
        lib.registerCollection({
          key: "selffixture",
          load: () => Promise.resolve(build("second")),
        });
        return Promise.resolve(build("first"));
      },
    });

    expect((await lib.getCollection("selffixture"))?.author.name).toBe("first");
    expect((await lib.getCollection("selffixture"))?.author.name).toBe("second");
  });

  it("invalidates the aggregate when a loader registers another collection", async () => {
    const lib = await freshLibrary();
    const added = new lib.NamedCollection("addedfixture", lib.party("Added"), []);
    const loader = new lib.NamedCollection("loaderfixture", lib.party("Loader"), []);
    lib.registerCollection({
      key: loader.key,
      load: () => {
        lib.registerCollection(added);
        return Promise.resolve(loader);
      },
    });

    const first = await lib.collections();
    expect(first).toContain(loader);
    expect(first).not.toContain(added);
    expect(await lib.getCollection(added.key)).toBe(added);

    const second = await lib.collections();
    expect(second).toContain(added);
    expect(second).not.toBe(first);
    expect(await lib.collections()).toBe(second);
    expect((await lib.dataset()).collections.map((collection) => collection.name)).toContain(
      "addedfixture",
    );
  });

  it("refreshes the aggregate when a loader replaces its own collection", async () => {
    const lib = await freshLibrary();
    const first = new lib.NamedCollection("selffixture", lib.party("First"), []);
    const second = new lib.NamedCollection("selffixture", lib.party("Second"), []);
    lib.registerCollection({
      key: first.key,
      load: () => {
        lib.registerCollection(second);
        return Promise.resolve(first);
      },
    });

    expect(await lib.collections()).toContain(first);
    const refreshed = await lib.collections();
    expect(refreshed).toContain(second);
    expect(refreshed).not.toContain(first);
    expect(await lib.getCollection("selffixture")).toBe(second);
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
    const originalStats = await lib.stats();
    expect(await lib.stats()).toBe(originalStats);
    expect(Object.isFrozen(originalStats)).toBe(true);
    expect(Object.isFrozen(originalStats.total_prize)).toBe(true);
    expect(Object.isFrozen(originalStats.unsolved_prize)).toBe(true);
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
    const addedStats = await lib.stats();
    expect(addedStats).not.toBe(originalStats);
    expect(addedStats.total).toBe(originalStats.total + 1);
    expect(addedStats.unsolved).toBe(originalStats.unsolved + 1);
    expect(await lib.collections()).toHaveLength(originalCollections.length + 1);
    expect(await lib.datasetCollections()).toHaveLength(originalData.length + 1);
    expect(await lib.dataVersion()).not.toBe(originalVersion);
    /* Snapshots handed out earlier stay intact. */
    expect(originalPuzzles).toHaveLength(350);
    expect(originalCollections).toHaveLength(20);
    expect(originalData).toHaveLength(20);

    const snapshot = await lib.dataset();
    expect(snapshot.data_version).toBe(
      createHash("sha256").update(JSON.stringify(snapshot.collections)).digest("hex").slice(0, 12),
    );
    const cachedPuzzles = await lib.all();
    lib.registerCollection(added); // Registering the same instance is a no-op.
    expect(await lib.all()).toBe(cachedPuzzles);
    expect(await lib.stats()).toBe(addedStats);
    expect(await lib.datasetCollections()).toBe(snapshot.collections);

    const second = makePuzzle("second");
    const replacement = new lib.NamedCollection("fixture", lib.party("Fixture"), [second]);
    lib.registerCollection(replacement);
    expect(await lib.get("fixture/first")).toBeUndefined();
    expect(await lib.get("fixture/second")).toBe(second);
    expect(await lib.getCollection("fixture")).toBe(replacement);
    expect(await lib.collections()).toHaveLength(21);
    expect(await lib.all()).toHaveLength(351);
    expect(await lib.stats()).not.toBe(addedStats);
    expect(await lib.stats()).toEqual(addedStats);
    expect(originalStats.total).toBe(350);
    expect(await lib.dataVersion()).not.toBe(snapshot.data_version);
    expect((await lib.dataset()).collections.at(-1)?.puzzles[0]?.id).toBe("fixture/second");

    for (const key of ["constructor", "toString", "__proto__", "hasOwnProperty"]) {
      const collection = new lib.NamedCollection(key, lib.party("Fixture"), []);
      lib.registerCollection(collection);
      expect(await lib.getCollection(key)).toBe(collection);
    }
  });

  it.each([false, true])(
    "keeps an export on one snapshot when registration races it (cached version: %s)",
    async (cachedVersion) => {
      const lib = await freshLibrary();
      const original = await lib.datasetCollections();
      const expectedVersion = createHash("sha256")
        .update(JSON.stringify(original))
        .digest("hex")
        .slice(0, 12);
      if (cachedVersion) {
        expect(await lib.dataVersion()).toBe(expectedVersion);
      }

      const pending = lib.dataset();
      lib.registerCollection(new lib.NamedCollection("fixture", lib.party("Fixture"), []));
      const exported = await pending;

      expect(exported.collections).toBe(original);
      expect(exported.data_version).toBe(expectedVersion);
      const current = await lib.dataset();
      expect(current.collections).not.toBe(original);
      expect(current.collections.at(-1)?.name).toBe("fixture");
      expect(current.data_version).toBe(
        createHash("sha256").update(JSON.stringify(current.collections)).digest("hex").slice(0, 12),
      );
      expect(current.data_version).not.toBe(expectedVersion);
    },
  );

  it("keeps pending statistics on their acquired snapshot", async () => {
    const lib = await freshLibrary();
    const original = await lib.stats();
    const pending = lib.stats();
    const puzzle = lib.bitcoinPuzzle({
      id: "fixture/prize",
      address: lib.p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      prize: 2,
    });
    lib.registerCollection(new lib.NamedCollection("fixture", lib.party("Fixture"), [puzzle]));
    expect(await pending).toBe(original);
    const current = await lib.stats();
    expect(current.total).toBe(original.total + 1);
    expect(current.total_prize["BTC"]).toBe((original.total_prize["BTC"] ?? 0) + 2);
    expect(current.unsolved_prize["BTC"]).toBe((original.unsolved_prize["BTC"] ?? 0) + 2);
  });

  it("hashes the snapshot acquired before a concurrent registration", async () => {
    const lib = await freshLibrary();
    const original = await lib.datasetCollections();
    const expectedVersion = createHash("sha256")
      .update(JSON.stringify(original))
      .digest("hex")
      .slice(0, 12);

    const pending = lib.dataVersion();
    lib.registerCollection(new lib.NamedCollection("fixture", lib.party("Fixture"), []));

    expect(await pending).toBe(expectedVersion);
    expect(await lib.dataVersion()).not.toBe(expectedVersion);
  });

  it("serializes a collection's hints once and prints them ahead of a puzzle's own", async () => {
    const lib = await freshLibrary();
    const { hintsTool, showTool } = await import("../../src/tool-operations.ts");
    const shared = lib.official(
      "Every key is a consecutive one from a deterministic wallet.",
      "https://example.com/thread",
      lib.confirmation("https://archive.ph/thread"),
    );
    const own = lib.community(
      "Number one sits in the upper half.",
      "https://example.com/thread#reply",
      lib.confirmation("https://archive.ph/thread#reply"),
      { date: "2026-01-02" },
    );
    const puzzle = lib.bitcoinPuzzle({
      id: "hinted/one",
      address: lib.p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      hints: [own],
    });
    lib.registerCollection(
      new lib.NamedCollection("hinted", lib.party("Fixture"), [puzzle], [shared]),
    );

    const serialized = await lib.datasetCollections();
    const entry = serialized.at(-1);
    expect(entry?.hints).toEqual([shared]);
    expect(entry?.puzzles[0]?.hints).toEqual([own]);
    expect(serialized.filter((row) => "hints" in row).map((row) => row.name)).toEqual([
      "b1000",
      "dug",
      "rushwallet",
      "hinted",
    ]);
    expect(JSON.stringify(serialized)).not.toContain("null");

    const text = (await showTool("hinted/one")).content[0]?.text.split("\n") ?? [];
    expect(text.indexOf("collection hints: 1")).toBeLessThan(text.indexOf("hints: 1"));
    const listed = await hintsTool("hinted/one");
    expect(listed.content[0]?.text.split("\n").slice(0, 2)).toEqual([
      "hinted/one: 2 hints",
      "collection hints: 1",
    ]);
    expect(listed.details["hints"]).toEqual([shared, own]);
    expect(text).toContain(
      "\tofficial\t-\tEvery key is a consecutive one from a deterministic wallet.\tsource: https://example.com/thread\tconfirmation: https://archive.ph/thread",
    );
    expect(text).toContain(
      "\tcommunity\t2026-01-02\tNumber one sits in the upper half.\tsource: https://example.com/thread#reply\tconfirmation: https://archive.ph/thread#reply",
    );
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

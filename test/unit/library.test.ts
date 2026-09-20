import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ArweaveCollection } from "../../src/collections/arweave.ts";
import { b1000, B1000Collection } from "../../src/collections/b1000.ts";
import { BalletCollection } from "../../src/collections/ballet.ts";
import { BitapsCollection } from "../../src/collections/bitaps.ts";
import { BitimageCollection } from "../../src/collections/bitimage.ts";
import { DugCollection } from "../../src/collections/dug.ts";
import { GenesisCollection } from "../../src/collections/genesis.ts";
import { GsmgCollection } from "../../src/collections/gsmg.ts";
import { HashCollisionCollection } from "../../src/collections/hash_collision.ts";
import { LedgerDonjonCollection } from "../../src/collections/ledger_donjon.ts";
import { LuckyLurkerCollection } from "../../src/collections/luckylurker.ts";
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
  requireCollection,
  requirePuzzle,
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
  DugCollection,
  GenesisCollection,
  GsmgCollection,
  HashCollisionCollection,
  LedgerDonjonCollection,
  LuckyLurkerCollection,
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

  it("keeps the Genesis announcement without inventing a prize or key", async () => {
    const puzzle = await requirePuzzle("genesis/block");
    expect(puzzle.address()).toEqual({
      kind: "standard",
      value: "bc1qfkhx02v89u2qyyyljeczw6hu9sr437y44t7ae5yf09thrdukfqesnjg2wj",
    });
    expect(puzzle.startedAt()).toBe("2026-08-22 19:45:38");
    expect(puzzle.status()).toBe(Status.Unsolved);
    expect(puzzle.prize()).toBeUndefined();
    expect(puzzle.key()).toBeUndefined();
    expect(puzzle.pubkey()).toBeUndefined();
    expect(puzzle.transactions()).toEqual([]);
    expect(puzzle.hints()).toHaveLength(19);
    expect(puzzle.hints()[0]?.source).toBe(puzzle.sourceUrl());
    expect(puzzle.hints().at(-1)?.date).toBe("2026-09-19");
    expect(puzzle.hints().at(-1)?.confirmation.description).toContain("same input address");
    expect(puzzle.hints().some((hint) => hint.text === "It's a 128-bit digest.")).toBe(true);
    expect(
      puzzle.hints().some((hint) => hint.text.startsWith("BIP39: 12 words; Passphrase: Y;")),
    ).toBe(true);
    expect(puzzle.hints().some((hint) => hint.text.startsWith("How many keys,"))).toBe(false);
  });

  it("preserves universal and historical collection lookups", async () => {
    expect((await get("b1000/90"))?.id()).toBe("b1000/90");
    expect((await get("gsmg"))?.id()).toBe("gsmg");
    expect((await get("movie_enigma"))?.id()).toBe("movie_enigma");
    expect((await getCollection("peter_todd"))?.key).toBe("hash_collision");
    expect((await getCollection("warpwallet"))?.key).toBe("warp");
    expect(await get("missing")).toBeUndefined();
    const foreign = [undefined, null, true, 71n, {}] as never[];
    expect(await Promise.all(foreign.map((id) => get(id)))).toEqual(foreign.map(() => undefined));
  });

  it.each([
    ["2025-0", "bc1qych2me6h85j38s3xmfwdkcvpqakpld3yr2y5ss", 0.00075082, "2026-07-08 14:43:50"],
    ["2025-1", "bc1qphfklk568cf93267yetpngqsz0mthw4z4x2q69", 0.00063216, "2026-08-02 12:12:29"],
    ["2025-2", "bc1qnclravnmv7vta9fhnp44hu3y85z3tfgz0n33wl", 0.00020888, "2026-07-08 14:43:50"],
  ] as const)(
    "verifies Dug's %s target and its own prize",
    async (name, address, prize, solved) => {
      const collection = await requireCollection("dug");
      const puzzle = await requirePuzzle(`dug/${name}`);
      expect(puzzle.status()).toBe(Status.Solved);
      expect(puzzle.prize()).toBe(prize);
      expect(puzzle.solvedAt()).toBe(solved);
      expect(puzzle.claimTransaction()?.amount).toBe(prize);
      expect(await collection.verifyById(puzzle.id())).toMatchObject({
        verified: true,
        derivedAddress: address,
      });
      expect(collection.hintsById(puzzle.id())[0]?.source).toBe(
        "https://njump.me/note157473tjlhl8046c4uhxk6889nwgflwsjtlpwgzfuqp0lmq8vvzas0km4hc",
      );
      expect(puzzle.hints()).toHaveLength(0);
    },
  );

  it("keeps all three Dug targets with their shared hint and separate claims", async () => {
    const collection = await requireCollection("dug");
    expect(collection.author.name).toBe("Dug");
    expect(collection.all().map((puzzle) => puzzle.id())).toEqual([
      "dug/2025-0",
      "dug/2025-1",
      "dug/2025-2",
    ]);
    expect(collection.all().map((puzzle) => puzzle.key()?.data().seed?.path)).toEqual([
      "m/84'/0'/0'/0/0",
      "m/84'/0'/0'/0/1",
      "m/84'/0'/0'/0/2",
    ]);
    expect(collection.all().map((puzzle) => puzzle.claimTransaction()?.txid)).toEqual([
      "bcc2154f4eb33c361973313b9fe81131568b2f4ee3ef5a2c3e98dc327afd8074",
      "ee70de514686588173b64fc31fc317ae15f1e903c742cc99140d2cf1bb2e8db1",
      "bcc2154f4eb33c361973313b9fe81131568b2f4ee3ef5a2c3e98dc327afd8074",
    ]);
    expect(collection.all().map((puzzle) => puzzle.solver()?.name)).toEqual([
      undefined,
      "floflo777",
      undefined,
    ]);
    expect(collection.requireId("dug/2025-1").solver()?.profiles).toEqual([
      { name: "github", url: "https://github.com/floflo777" },
      { name: "twitter", url: "https://twitter.com/0xFlorent_" },
    ]);
    expect(collection.hints).toHaveLength(1);
    expect(collection.hints[0]?.confirmation.url).toBe(
      "https://blossom.primal.net/394004c70b8907504a2424865e866b10fe5746c89122899a968f3dbcd18ad6b3.jpg",
    );
  });

  it("records the solved LuckyLurker Vault with its derived key and published answers", async () => {
    const puzzle = await requirePuzzle("luckylurker/vault_1");

    expect(puzzle.address().value).toBe("bc1q32e3dxcd0n2tlzdmchraf2057d0ax4xdwrk3jq");
    expect(puzzle.status()).toBe(Status.Solved);
    expect(puzzle.prize()).toBe(0.0008);
    expect((await getCollection("luckylurker"))?.author.name).toBe("Paul Jones");
    expect(puzzle.claimTransaction()).toEqual({
      txid: "75e570a5ea243c492e2804916482f046b2392b463c51be15624e6e25a84119f7",
      date: "2026-08-17 18:08:09",
      amount: 0.00079638,
      tx_type: "claim",
    });
    expect(puzzle.pubkey()?.value).toBe(
      "024ad3b398bc9a95b4b8d44310e15a5355402dba3c784e60bf3b14821ca1622adb",
    );
    expect(puzzle.hints()).toHaveLength(12);
    expect(puzzle.hints()[0]?.text).toBe("Word #1: Presence without permanence.");
    expect(puzzle.hints()[0]?.answer).toEqual({
      text: "visit",
      source: "https://luckylurker.com/bitcoin-vault/",
    });
    expect(puzzle.hints()[11]?.date).toBe("2026-03-22 18:30:00");
    expect(puzzle.key()?.data().hex).toBe(
      "d82ce0eaffce690777d571b7943ca782a7c83f48a84269afd26148c3d5816a0a",
    );
    expect(puzzle.startedAt()).toBe("2026-03-16 17:54:03");
    expect(puzzle.solver()).toBeUndefined();
    expect(puzzle.solvedAt()).toBe("2026-08-17 18:08:09");
  });

  it("keeps the Vault's article URLs readable without a Markdown renderer", async () => {
    const puzzle = await requirePuzzle("luckylurker/vault_1");
    for (const [index, url] of [
      [2, "https://luckylurker.com/crypto-casinos-guide/"],
      [4, "https://luckylurker.com/casino/gamdom/"],
      [7, "https://luckylurker.com/casino/n1/"],
      [8, "https://luckylurker.com/fastest-crypto-casino-withdrawals-2026/"],
    ] as const) {
      expect(puzzle.hints()[index]?.text).toContain(`(${url})`);
      expect(puzzle.hints()[index]?.text).not.toContain("](");
    }
  });

  it("includes the funded second Vault without inventing key material", async () => {
    const puzzle = await requirePuzzle("luckylurker/vault_2");

    expect(puzzle.status()).toBe(Status.Unsolved);
    expect(puzzle.address().value).toBe("bc1qnepv9pcnqvndux9h9mcaxvk6u993rc0lew9fpp");
    expect(puzzle.startedAt()).toBe("2026-09-11 16:42:56");
    expect(puzzle.prize()).toBe(1);
    expect(puzzle.transactions()).toEqual([
      {
        txid: "2314d7f0b76c4f29ed1cfb949fd2882d648712f5c6cbaef9d7dff8ddee46f198",
        date: "2026-08-12 14:19:56",
        amount: 1,
        tx_type: "funding",
      },
    ]);
    expect(puzzle.pubkey()).toBeUndefined();
    expect(puzzle.key()).toBeUndefined();
    expect(puzzle.claimTransaction()).toBeUndefined();
  });

  it("includes Autonomy with its archived reward address and solution source", async () => {
    const puzzle = await requirePuzzle("zden/decred_autonomy");

    expect(puzzle.chain()).toBe("decred");
    expect(puzzle.address().value).toBe("DseEpHK49hHrTJhxwop3B86K1dryv4CYz8N");
    expect(puzzle.status()).toBe(Status.Solved);
    expect(puzzle.startedAt()).toBe("2017-04-25");
    expect(puzzle.sourceUrl()).toBe(
      "https://web.archive.org/web/20170430210807/https://decred.org/autonomy_puzzle/",
    );
    expect(puzzle.solver()?.profiles?.[0]?.url).toBe(
      "https://medium.com/blockcrushr-labs/solving-decreds-autonomy-puzzle-aedac18f18f3",
    );
    expect(puzzle.assetPath()).toBe("assets/zden/decred_autonomy/puzzle.jpg");
    expect(puzzle.claimTransaction()).toBeUndefined();
    expect(puzzle.prize()).toBeUndefined();
    expect(puzzle.toJSON()).not.toHaveProperty("solve_date");
    expect(puzzle.toJSON()).not.toHaveProperty("solve_time");
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
      claimed: 0,
      expired: 0,
      solved: 83,
      swept: 96,
      unsolved: 77,
    });
    for (const entry of summaries) {
      expect(entry.claimed + entry.expired + entry.solved + entry.swept + entry.unsolved).toBe(
        entry.total,
      );
    }
  });

  it("preserves the dataset statistics", async () => {
    expect(await all()).toHaveLength(341);
    expect(await stats()).toEqual({
      total: 341,
      claimed: 11,
      expired: 2,
      solved: 137,
      swept: 96,
      unsolved: 95,
      with_pubkey: 241,
      total_prize: {
        AR: 5550,
        ETH: 14.1337,
        DAI: 100,
        BTC: 1059.07158961,
        LTC: 230.8255,
        DCR: 460,
      },
      unsolved_prize: {
        AR: 1900,
        ETH: 1,
        BTC: 908.88130493,
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
    ).toBe(341);
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
    expect(records.filter((record) => record.status === Status.Solved)).toHaveLength(137);
  });
});

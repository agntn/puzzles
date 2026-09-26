import { createHash } from "node:crypto";
import { readdirSync } from "node:fs";
import { describe, expect, expectTypeOf, it, vi } from "vite-plus/test";
import { ArweaveCollection } from "../../src/collections/arweave.ts";
import { b1000, B1000Collection } from "../../src/collections/b1000.ts";
import { BalletCollection } from "../../src/collections/ballet.ts";
import { BitapsCollection } from "../../src/collections/bitaps.ts";
import { BitimageCollection } from "../../src/collections/bitimage.ts";
import { BookQuizCollection } from "../../src/collections/book_quiz.ts";
import { BraveNewWorldCollection } from "../../src/collections/brave_new_world.ts";
import { CoinArtistCollection } from "../../src/collections/coin_artist.ts";
import { DugCollection } from "../../src/collections/dug.ts";
import { GenesisCollection } from "../../src/collections/genesis.ts";
import { GsmgCollection } from "../../src/collections/gsmg.ts";
import { HashCollisionCollection } from "../../src/collections/hash_collision.ts";
import { iAmABananaAmaa, IAmABananaAmaaCollection } from "../../src/collections/iamabananaamaa.ts";
import { kTimesG, KTimesGCollection } from "../../src/collections/ktimesg.ts";
import { LedgerDonjonCollection } from "../../src/collections/ledger_donjon.ts";
import { LuckyLurkerCollection } from "../../src/collections/luckylurker.ts";
import { MineshopCollection } from "../../src/collections/mineshop.ts";
import { mini, MiniCollection } from "../../src/collections/mini.ts";
import { MovieEnigmaCollection } from "../../src/collections/movie_enigma.ts";
import { PicturePuzzleCollection } from "../../src/collections/picture_puzzle.ts";
import { quizchain, QuizchainCollection } from "../../src/collections/quizchain.ts";
import { rushwallet, RushwalletCollection } from "../../src/collections/rushwallet.ts";
import { SatoshiBirthdayQuizCollection } from "../../src/collections/satoshi_birthday_quiz.ts";
import { teikhos, TeikhosCollection } from "../../src/collections/teikhos.ts";
import { WarpCollection } from "../../src/collections/warp.ts";
import { wickex, WickexCollection } from "../../src/collections/wickex.ts";
import { ZdenCollection } from "../../src/collections/zden.ts";
import {
  all,
  authors,
  bitcoinPuzzle,
  builtins,
  Collection,
  collectionKeys,
  collections,
  collectionSummaries,
  community,
  confirmation,
  dataset,
  datasetCollections,
  dataVersion,
  get,
  getAuthor,
  getCollection,
  getSolver,
  hasCollection,
  NamedCollection,
  official,
  p2pkh,
  party,
  PuzzleNotFoundError,
  requireAuthor,
  requireCollection,
  requirePuzzle,
  requireSolver,
  SingletonCollection,
  solvers,
  stats,
  Status,
  type AnyCollection,
} from "../../src/index.ts";
import { prizeTotals } from "../../src/core/utils.ts";

const concreteClasses = [
  ArweaveCollection,
  B1000Collection,
  BalletCollection,
  BitapsCollection,
  BitimageCollection,
  BookQuizCollection,
  BraveNewWorldCollection,
  CoinArtistCollection,
  DugCollection,
  GenesisCollection,
  GsmgCollection,
  HashCollisionCollection,
  IAmABananaAmaaCollection,
  KTimesGCollection,
  LedgerDonjonCollection,
  LuckyLurkerCollection,
  MineshopCollection,
  MiniCollection,
  MovieEnigmaCollection,
  PicturePuzzleCollection,
  QuizchainCollection,
  RushwalletCollection,
  SatoshiBirthdayQuizCollection,
  TeikhosCollection,
  WarpCollection,
  WickexCollection,
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

  it("keeps TORCHED H34R7S's advertised prize separate from its claim", async () => {
    const puzzle = await requirePuzzle("coin_artist/torched-h34r7s");
    expect(puzzle.address().value).toBe("1FLAMEN6rq2BqMnkUmsJBqCGWdwgVKcegd");
    expect(puzzle.pubkey()?.format).toBe("uncompressed");
    expect(puzzle.status()).toBe(Status.Solved);
    expect(puzzle.startedAt()).toBe("2015-04-03");
    expect(puzzle.prize()).toBe(4.87);
    expect(puzzle.solvedAt()).toBe("2018-02-01 15:09:42");
    expect(puzzle.transactions()).toEqual([
      {
        tx_type: "claim",
        txid: "cb0156faa1716186b96f7e668a59204061a3419a746810ce151052d2860ac7cf",
        date: "2018-02-01 15:09:42",
        amount: 5.001337,
      },
    ]);
    expect(puzzle.solver()).toBeUndefined();
    expect(puzzle.assetPath()).toBe("assets/coin_artist/torched-h34r7s/puzzle.jpg");
    expect(puzzle.assetLinks().map((asset) => asset.path)).toEqual([
      "assets/coin_artist/torched-h34r7s/puzzle.jpg",
      "assets/coin_artist/torched-h34r7s/solution.md",
    ]);
  });

  it("credits Level 4's published solution without adopting its example WIF", async () => {
    const puzzle = await requirePuzzle("zden/level_4");
    expect(puzzle.solver()).toMatchObject({
      key: "mmorsl",
      name: "mmorsl",
      profiles: [{ name: "steemit", url: "https://steemit.com/@mmorsl" }],
    });
    expect(puzzle.solver()?.facts?.[0]?.source).toBe(
      "https://steemit.com/bitcoin/@mmorsl/solution-of-the-bitcoin-crypto-puzzle-level-4-by-zden",
    );
    expect(puzzle.assets()).toEqual({
      puzzle: "level_4/puzzle.png",
      solution: "level_4/solution.md",
      source_url: "https://crypto.haluska.sk/crypto4.png",
    });
    expect(puzzle.assetLinks().map((asset) => asset.path)).toEqual([
      "assets/zden/level_4/puzzle.png",
      "assets/zden/level_4/solution.md",
    ]);
    expect(puzzle.toJSON().solver).toEqual(puzzle.solver());
    expect(puzzle.key()).toBeUndefined();
    expect(puzzle.hasPrivateKey()).toBe(false);
  });

  it("keeps the Genesis announcement without inventing a prize or key", async () => {
    const puzzle = await requirePuzzle("genesis/block");
    expect(puzzle.address()).toEqual({
      kind: "p2wsh",
      value: "bc1qfkhx02v89u2qyyyljeczw6hu9sr437y44t7ae5yf09thrdukfqesnjg2wj",
    });
    expect(puzzle.startedAt()).toBe("2026-08-22 19:45:38");
    expect(puzzle.preGenesis()).toBe(true);
    expect(puzzle.toJSON().pre_genesis).toBe(true);
    expect(puzzle.status()).toBe(Status.Unsolved);
    expect(puzzle.prize()).toBeUndefined();
    expect(puzzle.key()).toBeUndefined();
    expect(puzzle.pubkey()).toBeUndefined();
    expect(puzzle.transactions()).toEqual([
      {
        tx_type: "funding",
        txid: "e2aaa928a965ee02b9c9a76227383113a62f350701a18d7792372712ce501ac7",
        date: "2026-08-22 02:45:22",
        amount: 0.0002,
      },
      {
        tx_type: "increase",
        txid: "b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77",
        date: "2026-08-22 19:45:38",
        amount: 0.00005,
      },
    ]);
    expect(puzzle.hints()).toHaveLength(19);
    expect(puzzle.hints()[0]?.source).toBe(puzzle.sourceUrl());
    expect(puzzle.hints().at(-1)?.date).toBe("2026-09-19");
    expect(puzzle.hints().at(-1)?.confirmation?.description).toContain("same input address");
    expect(puzzle.hints().some((hint) => hint.text === "It's a 128-bit digest.")).toBe(true);
    expect(
      puzzle.hints().some((hint) => hint.text.startsWith("BIP39: 12 words; Passphrase: Y;")),
    ).toBe(true);
    expect(puzzle.hints().some((hint) => hint.text.startsWith("How many keys,"))).toBe(false);
  });

  it("keeps Movie Enigma's original rules separate from its solution", async () => {
    const puzzle = await requirePuzzle("movie_enigma");
    const hints = [
      {
        kind: "official",
        text: "Guess all the 34 movie titles, from the provided movie frames",
        source: "https://bitcoinmovieenigma.com/rules",
      },
      {
        kind: "official",
        text: 'Transform "somehow" each movie title into an English BIP-0039 seed word',
        source: "https://bitcoinmovieenigma.com/rules",
      },
      {
        kind: "official",
        text: 'The seedphrase you have is 34 words long, but we should have a 24 words seedphrase instead. Some movies should not be in the sequence, and should be considered intruders, but which ones ? You will need additional informations about each movie to detect those intruders "somehow". Every information you need can be found on IMBD, on each movie\'s page',
        source: "https://bitcoinmovieenigma.com/rules",
      },
    ];
    expect(puzzle.hints()).toEqual(hints);
    expect(puzzle.toJSON().hints).toEqual(hints);
    const collection = await requireCollection("movie_enigma");
    expect(collection.hintsById("movie_enigma")).toEqual(hints);
    expect(puzzle.status()).toBe(Status.Solved);
  });

  it("types a built-in lookup by the queries its collection takes", async () => {
    const numeric = await requireCollection("b1000");
    expectTypeOf<Parameters<typeof numeric.get>[0]>().toEqualTypeOf<number | string>();
    expect(numeric.get(71)?.id()).toBe("b1000/71");
    const singleton = await getCollection("gsmg");
    expect(singleton.get()?.id()).toBe("gsmg");
    const alias = await getCollection("warpwallet");
    expectTypeOf<Parameters<typeof alias.get>[0]>().toEqualTypeOf<string>();
    // @ts-expect-error A named collection takes no number.
    expect(alias.get(1)).toBeUndefined();
    const key: string = "b1000";
    expectTypeOf(await getCollection(key)).toEqualTypeOf<AnyCollection | undefined>();
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
    expect(collection.hints[0]?.confirmation?.url).toBe(
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

    expect([1, "1", "quizchain/1"].map((query) => quizchain.get(query)?.id())).toEqual([
      "quizchain/1",
      "quizchain/1",
      "quizchain/1",
    ]);
    expect(quizchain.get("block-1")).toBeUndefined();
    const blocks = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(blocks.map((block) => quizchain.get(block)?.id())).toEqual(
      blocks.map((block) => `quizchain/${block}`),
    );

    /* Numbered as the author numbered them, not by the Bitcoin puzzle a few are built on. */
    expect([7, "7", "mini/7"].map((query) => mini.get(query)?.id())).toEqual([
      "mini/7",
      "mini/7",
      "mini/7",
    ]);
    expect(mini.all().map((puzzle) => [puzzle.id(), puzzle.chain()])).toEqual([
      ["mini/1", "bitcoincash"],
      ["mini/2", "bitcoincash"],
      ["mini/3", "bitcoincash"],
      ["mini/4", "bitcoin"],
      ["mini/5", "bitcoin"],
      ["mini/6", "bitcoin"],
      ["mini/7", "bitcoincash"],
    ]);
    expect(mini.get(135)).toBeUndefined();

    /* Numbered in deployment order from 0, the first contract, which cannot pay. */
    expect([4, "4", "teikhos/4"].map((query) => teikhos.get(query)?.id())).toEqual([
      "teikhos/4",
      "teikhos/4",
      "teikhos/4",
    ]);
    expect([0, "0", "teikhos/0"].map((query) => teikhos.get(query)?.id())).toEqual([
      "teikhos/0",
      "teikhos/0",
      "teikhos/0",
    ]);
    expect(["00", "04", "teikhos/00"].map((query) => teikhos.get(query))).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
    expect(teikhos.all().map((puzzle) => [puzzle.address().value, puzzle.status()])).toEqual([
      ["0xaec7e8c221c3fd24e75c996e32289235fd899ebf", Status.Unsolved],
      ["0x17e5e0910b9185b0ede564dcbf074ca910ad56a4", Status.Unsolved],
      ["0xd7c6d542f3dcdceda845112b8fd567b8f8655805", Status.Unsolved],
      ["0x973c2178b09225d1de3ab037d40b3f24af696255", Status.Unsolved],
      ["0x735ba26f91e1275fa4b504649b19ef74739fe7e7", Status.Solved],
    ]);
    expect(teikhos.get(5)).toBeUndefined();

    expect(["80_bit", "ktimesg/80_bit"].map((query) => kTimesG.get(query)?.id())).toEqual([
      "ktimesg/80_bit",
      "ktimesg/80_bit",
    ]);
    expect(kTimesG.get(80 as never)).toBeUndefined();

    expect(["gif", "iamabananaamaa/gif"].map((query) => iAmABananaAmaa.get(query)?.id())).toEqual([
      "iamabananaamaa/gif",
      "iamabananaamaa/gif",
    ]);
    expect(
      ["caesar", "iamabananaamaa/caesar"].map((query) => iAmABananaAmaa.get(query)?.id()),
    ).toEqual(["iamabananaamaa/caesar", "iamabananaamaa/caesar"]);

    expect(["youtube", "wickex/youtube"].map((query) => wickex.get(query)?.id())).toEqual([
      "wickex/youtube",
      "wickex/youtube",
    ]);

    expect(rushwallet.get("9")?.id()).toBe("rushwallet/9");
    expect(rushwallet.get("rushwallet/9")?.id()).toBe("rushwallet/9");
    expect(rushwallet.get(9 as never)).toBeUndefined();
    expect(() => rushwallet.require(9 as never)).toThrow(PuzzleNotFoundError);
  });

  it("names the one puzzle, collection or author a miss most likely meant", async () => {
    const miss = async (lookup: Promise<unknown>): Promise<string> =>
      lookup.then(
        () => "",
        (error: Readonly<Error>) => error.message.replace(/ (?:Known|Collection) .*$/u, ""),
      );

    /* Case, separators and a bare name each point at exactly one identifier. */
    await expect(miss(requirePuzzle("135"))).resolves.toBe(
      "Puzzle not found: 135. Did you mean b1000/135?",
    );
    await expect(miss(requirePuzzle("B1000/71"))).resolves.toBe(
      "Puzzle not found: B1000/71. Did you mean b1000/71?",
    );
    await expect(miss(requirePuzzle("b100/71"))).resolves.toBe(
      "Puzzle not found: b100/71. Did you mean b1000/71?",
    );
    await expect(miss(requirePuzzle("Zden/Level-5"))).resolves.toBe(
      "Puzzle not found: Zden/Level-5. Did you mean zden/level_5?",
    );
    await expect(miss(requirePuzzle("zden/level5"))).resolves.toBe(
      "Puzzle not found: zden/level5. Did you mean zden/level_5?",
    );
    await expect(miss(requirePuzzle("GSMG"))).resolves.toBe(
      "Puzzle not found: GSMG. Did you mean gsmg?",
    );
    await expect(miss(requirePuzzle("b100/99999"))).resolves.toBe(
      "Puzzle not found: b100/99999. Did you mean collection b1000?",
    );
    await expect(miss(requireCollection("hashcollision"))).resolves.toBe(
      "Unknown collection: hashcollision. Did you mean hash_collision?",
    );
    await expect(miss(requireAuthor("peter_todd"))).resolves.toBe(
      "Unknown author: peter_todd. Did you mean peter-todd?",
    );

    /* A number one digit off is another puzzle, and a name several collections share is a tie. */
    for (const id of ["b1000/999", "b1000/071", "1", "nope/1"]) {
      await expect(miss(requirePuzzle(id))).resolves.toBe(`Puzzle not found: ${id}.`);
    }
    await expect(miss(requireCollection("bitcoin"))).resolves.toBe("Unknown collection: bitcoin.");

    /* A blank key would vanish into the sentence, so the miss quotes it. */
    await expect(miss(requireCollection(" "))).resolves.toBe('Unknown collection: " ".');
    await expect(miss(requirePuzzle(" "))).resolves.toBe('Puzzle not found: " ".');
    await expect(miss(requireAuthor("peter-todd "))).resolves.toBe(
      'Unknown author: "peter-todd ". Did you mean peter-todd?',
    );
  });

  it("shares the archived RushWallet video clue with all 30 wallets", () => {
    const hints = [
      {
        kind: "official",
        text: "Search for clues in the RushWallet Fundraiser video to unlock each wallet and claim the bitcoins.",
        source: "https://rushwallet.com/contest",
        confirmation: {
          url: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
          description:
            "The contest page gives this instruction and embeds the Fundraiser video (https://www.youtube.com/watch?v=sr8lBrtd9U4).",
        },
      },
    ];
    expect(rushwallet.hints).toEqual(hints);
    expect(rushwallet.all()).toHaveLength(30);
    for (const puzzle of rushwallet.all()) {
      expect(puzzle.hints()).toEqual([]);
      expect(rushwallet.hintsById(puzzle.id())).toEqual(hints);
    }
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

  it("lists one author per key with the collections it published", async () => {
    const entries = await authors();
    const keys = [...new Set(concreteClasses.map((CollectionClass) => CollectionClass.author.key))];

    expect(entries).toHaveLength(keys.length);
    expect(entries.map((entry) => entry.key)).toEqual(keys);
    expect(entries.every((entry) => Object.isFrozen(entry))).toBe(true);

    const zden = await getAuthor("zden");
    expect(zden?.collections).toEqual(["zden"]);
    expect(zden?.puzzles).toBe(16);
    expect(zden?.author.kind).toBe("person");
    expect(zden?.author.aliases).toContain("Zden Hlinka");
    expect(zden?.author.facts?.every((entry) => entry.source.startsWith("https://"))).toBe(true);
    const aoi = await getAuthor("aoi-nakamoto");
    expect(aoi?.collections).toEqual(["book_quiz", "quizchain", "satoshi_birthday_quiz"]);
    expect(aoi?.puzzles).toBe(12);
    expect(await getAuthor("nobody")).toBeUndefined();
    expect(await getAuthor(7 as never)).toBeUndefined();
  });

  it("files a keyless author under its collection key", async () => {
    vi.resetModules();
    const lib = await import("../../src/index.ts");
    const puzzle = lib.bitcoinPuzzle({
      id: "keyless/one",
      address: lib.p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
    });
    lib.registerCollection(new lib.NamedCollection("keyless", lib.party("Keyless"), [puzzle]));

    const entry = await lib.getAuthor("keyless");
    expect(entry).toEqual({
      key: "keyless",
      author: { name: "Keyless" },
      collections: ["keyless"],
      puzzles: 1,
    });
    vi.resetModules();
  });

  it("joins the records of one solver by key, in the order of its first solve", async () => {
    const entries = await solvers();
    expect(entries.every((entry) => Object.isFrozen(entry))).toBe(true);
    expect(entries.map((entry) => entry.key)).toContain("retired-coder");

    const retired = await requireSolver("retired-coder");
    expect(retired.solves.map((solve) => solve.id)).toEqual([
      "b1000/120",
      "b1000/125",
      "b1000/130",
      "b1000/135",
    ]);
    expect(retired.solves[0]).toEqual({
      id: "b1000/120",
      chain: "bitcoin",
      status: "solved",
      solvedAt: "2023-02-27 09:40:55",
      prize: 1.2,
      currency: "BTC",
    });
    expect(retired.collections).toEqual(["b1000"]);
    expect(retired.authored).toEqual(["mini"]);
    /* The four records repeat the profiles; the joined record keeps each once. */
    expect(retired.solver.profiles).toHaveLength(2);
    expect(retired.solver.about).toMatch(/^Author of RCKangaroo/u);
    expect(retired.solver.facts?.length).toBeGreaterThan(2);

    const wickexSolver = await requireSolver("wickex");
    expect(wickexSolver.solves.map((solve) => solve.id)).toEqual(["iamabananaamaa/gif"]);
    expect(wickexSolver.authored).toEqual(["wickex"]);

    const decred = await requireSolver("blockcrushr-labs");
    expect(decred.solves[0]).toEqual({
      id: "zden/decred_autonomy",
      chain: "decred",
      status: "solved",
      currency: "DCR",
    });

    /* A solver known only by the address the prize went to has no entry. */
    expect(entries.flatMap((entry) => entry.solves).map((solve) => solve.id)).not.toContain(
      "b1000/66",
    );
    expect(await getSolver("nobody")).toBeUndefined();
    expect(await getSolver(7 as never)).toBeUndefined();
  });

  it("names the solver a miss most likely meant, or why a puzzle has none", async () => {
    const miss = async (lookup: Promise<unknown>): Promise<string> =>
      lookup.then(
        () => "",
        (error: Readonly<Error>) =>
          `${error.name}: ${error.message.replace(/ Known solvers: .*$/u, "")}`,
      );

    await expect(miss(requireSolver("retiredcoder"))).resolves.toBe(
      "UnknownSolverError: Unknown solver: retiredcoder. Did you mean retired-coder?",
    );
    await expect(miss(requireSolver("b1000/66"))).resolves.toBe(
      "UnknownSolverError: Unknown solver: b1000/66. b1000/66 knows its solver by address only.",
    );
    await expect(miss(requireSolver("b1000/71"))).resolves.toBe(
      "UnknownSolverError: Unknown solver: b1000/71. b1000/71 records no solver.",
    );
  });

  it("merges two records of one solver without repeating a list item", async () => {
    vi.resetModules();
    const lib = await import("../../src/index.ts");
    const solved = (name: string, solver: ReturnType<typeof lib.party>) =>
      lib.bitcoinPuzzle({
        id: `joined/${name}`,
        address: lib.p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
        sourceUrl: "https://example.com/puzzle",
        startedAt: "2026-01-01",
        solver,
      });
    lib.registerCollection(
      new lib.NamedCollection("joined", lib.party("Joined", { key: "joined" }), [
        solved("one", lib.party("Solver", { key: "solver", aliases: ["S"] })),
        solved(
          "two",
          lib.party("Solver", {
            key: "solver",
            about: "Solves.",
            aliases: ["S", "T"],
            profiles: [lib.profile("site", "https://example.com/")],
            facts: [lib.fact("Solved two.", "https://example.com/two")],
          }),
        ),
        solved(
          "three",
          lib.party("Solver", {
            key: "solver",
            profiles: [lib.profile("site", "https://example.com/")],
            facts: [lib.fact("Solved two.", "https://example.com/two")],
          }),
        ),
      ]),
    );

    expect(await lib.getSolver("solver")).toEqual({
      key: "solver",
      solver: {
        key: "solver",
        name: "Solver",
        aliases: ["S", "T"],
        about: "Solves.",
        profiles: [{ name: "site", url: "https://example.com/" }],
        facts: [{ text: "Solved two.", source: "https://example.com/two" }],
      },
      solves: ["one", "two", "three"].map((name) => ({
        id: `joined/${name}`,
        chain: "bitcoin",
        status: "unsolved",
        currency: "BTC",
      })),
      collections: ["joined"],
      authored: [],
    });
    vi.resetModules();
  });

  it("preserves the dataset statistics", async () => {
    expect(await all()).toHaveLength(373);
    expect(await stats()).toEqual({
      total: 373,
      claimed: 12,
      expired: 3,
      solved: 162,
      swept: 96,
      unsolved: 100,
      with_pubkey: 267,
      total_prize: {
        AR: 5550,
        ETH: 26.246241554256944,
        DAI: 100,
        BTC: 1064.46058961,
        BCH: 5.1,
        LTC: 230.8255,
        DCR: 460,
      },
      unsolved_prize: {
        AR: 1900,
        ETH: 12.612541554256945,
        BTC: 909.07574943,
      },
    });
  });

  it("sums prizes to every place they were recorded with", async () => {
    const prized = (id: string, prize: number) =>
      bitcoinPuzzle({
        id,
        address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
        sourceUrl: "https://example.com/puzzle",
        startedAt: "2026-01-01",
        prize,
      });

    expect(prizeTotals([await requirePuzzle("mineshop")])).toEqual({ ETH: 8.612541554256945 });
    expect(prizeTotals([prized("sum/1", 0.1), prized("sum/2", 0.2)])).toEqual({ BTC: 0.3 });
    expect(prizeTotals([prized("sum/1", 1e-8), prized("sum/2", 1057.06884912)])).toEqual({
      BTC: 1057.06884913,
    });
  });

  it("derives a stable data version from class data alone", async () => {
    const first = await dataVersion();

    expect(first).toMatch(/^[a-f0-9]{12}$/);
    expect(await dataVersion()).toBe(first);
    expect(first).toBe(
      createHash("sha256")
        .update(JSON.stringify(await datasetCollections()))
        .digest("hex")
        .slice(0, 12),
    );
  });

  it("builds the dataset envelope from the registry", async () => {
    const envelope = await dataset();

    expect(envelope.data_version).toBe(await dataVersion());
    expect(envelope.collections).toHaveLength(concreteClasses.length);
    expect(envelope.collections.map((collection) => collection.name)).toEqual(collectionKeys());
    expect(
      envelope.collections.reduce((total, collection) => total + collection.puzzles.length, 0),
    ).toBe(373);
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
    expect(records.filter((record) => record.status === Status.Solved)).toHaveLength(162);
  });
});

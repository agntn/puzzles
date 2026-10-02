import { describe, expect, it } from "vite-plus/test";
import {
  answer,
  artifact,
  assets,
  BitcoinPuzzle,
  Chain,
  chains,
  claim,
  community,
  compressed,
  confirmation,
  derivation,
  hex,
  official,
  p2pkh,
  party,
  p2sh,
  p2wpkh,
  p2wsh,
  passphrase,
  Puzzle,
  puzzle,
  type PuzzleSpec,
  stage,
  standard,
  Status,
} from "../../src/index.ts";
import { formatStageReport } from "../../src/core/utils.ts";
import { ASSETS } from "../support/assets.ts";

const required = {
  id: "fixture/1",
  chain: Chain.Bitcoin,
  address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
  sourceUrl: "https://example.com/puzzle",
  startedAt: "2026-01-01",
} satisfies PuzzleSpec;

/** A real address of each kind the factory reads from a string, with the record it reads into. */
const readable = [
  [
    Chain.Bitcoin,
    "1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe",
    p2pkh("1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe", "a9553269572a317e39f0f518cb87c1a0ee1dbae4"),
  ],
  [
    Chain.Bitcoin,
    "37k7toV1Nv4DfmQbmZ8KuZDQCYK9x5KpzP",
    p2sh("37k7toV1Nv4DfmQbmZ8KuZDQCYK9x5KpzP", "4266fc6f2c2861d7fe229b279a79803afca7ba34"),
  ],
  [
    Chain.Bitcoin,
    "bc1qyjwa0tf0en4x09magpuwmt2smpsrlaxwn85lh6",
    p2wpkh(
      "bc1qyjwa0tf0en4x09magpuwmt2smpsrlaxwn85lh6",
      "249dd7ad2fccea67977d4078edad50d8603ff4ce",
    ),
  ],
  [
    Chain.Bitcoin,
    "bc1qfkhx02v89u2qyyyljeczw6hu9sr437y44t7ae5yf09thrdukfqesnjg2wj",
    p2wsh("bc1qfkhx02v89u2qyyyljeczw6hu9sr437y44t7ae5yf09thrdukfqesnjg2wj"),
  ],
  [
    Chain.Litecoin,
    "LartGjF6UjmvmF1JXBhFf5wtM9uZX7LzeS",
    p2pkh("LartGjF6UjmvmF1JXBhFf5wtM9uZX7LzeS", "ab85f21bf9ca1126f3776f4686cf02737be7a2b7"),
  ],
  [
    Chain.Decred,
    "DsRaAja82UvgnqYaBHYFuyCKURFX2rCyEJ8",
    p2pkh("DsRaAja82UvgnqYaBHYFuyCKURFX2rCyEJ8"),
  ],
  [
    Chain.Ethereum,
    "0x635739254BDE27d28301f25aD57c3cAC3C3468f3",
    standard("0x635739254BDE27d28301f25aD57c3cAC3C3468f3"),
  ],
] as const;

describe("puzzle record factories", () => {
  it("exposes the documented passphrase-only key builder", () => {
    const record = puzzle({ ...required, key: passphrase("public fixture") });
    expect(record.keyData()).toEqual({ wif: { passphrase: "public fixture" } });
    expect(record.hasPrivateKey()).toBe(false);
  });

  it("marks a derived key only when the record has a secret", () => {
    expect(puzzle({ ...required, key: hex("1".padStart(64, "0")) }).hasDerivedKey()).toBe(false);
    const pathOnly = puzzle({ ...required, key: derivation("m/0").derived() });
    expect(pathOnly.keyData()).toEqual({ seed: { path: "m/0" }, derived: true });
    expect(pathOnly.hasDerivedKey()).toBe(false);
  });

  it("hands back a key builder that leaves the record alone", () => {
    const key = hex("1".padStart(64, "0"), 1);
    const record = puzzle({ ...required, key });
    const wif = "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn";

    const extended = record.key()?.wif(wif);

    expect(extended?.data()).toEqual({
      hex: "1".padStart(64, "0"),
      bits: 1,
      wif: { decrypted: wif },
    });
    expect(record.keyData()).toEqual({ hex: "1".padStart(64, "0"), bits: 1 });
    expect(record.key()).toBe(key);
  });

  it("freezes the record it builds, nested parts included", () => {
    const record = puzzle({
      ...required,
      key: hex("1".padStart(64, "0"), 1).wif(
        "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn",
      ),
      solver: party("Fixture", { addresses: ["1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"] }),
      transactions: [claim("0".repeat(64), "2026-01-02", 0)],
    });
    const parts = [
      record.address(),
      record.transactions(),
      record.transactions()[0],
      record.solver(),
      record.solver()?.addresses,
      record.keyData(),
      record.keyData()?.wif,
      record.toJSON(),
    ];

    expect(parts.map((part) => Object.isFrozen(part))).toEqual(parts.map(() => true));
    expect(Reflect.set(record.address(), "value", "1Mutated")).toBe(false);
    expect(Reflect.set(record.toJSON(), "status", Status.Solved)).toBe(false);
    expect(record.address().value).toBe(required.address.value);
  });

  it("freezes through what a handwritten subclass hands to toJSON()", () => {
    const transactions = [claim("0".repeat(64), "2026-01-02", 0)];
    class Handwritten extends BitcoinPuzzle {
      override id(): string {
        return "fixture/handwritten";
      }
      override address() {
        return p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
      }
      override sourceUrl(): string {
        return required.sourceUrl;
      }
      override startedAt(): string {
        return required.startedAt;
      }
      override transactions() {
        return transactions;
      }
    }

    const record = new Handwritten().toJSON();

    expect(Object.isFrozen(record.transactions)).toBe(true);
    expect(Object.isFrozen(record.address)).toBe(true);
    expect(Reflect.set(transactions, 0, undefined)).toBe(false);
  });

  it("keeps freezing below a record the caller froze shallowly", () => {
    const transactions = [claim("0".repeat(64), "2026-01-02", 0)];
    const record = puzzle(Object.freeze({ ...required, transactions }));

    expect(Object.isFrozen(record.transactions())).toBe(true);
    expect(Object.isFrozen(record.transactions()[0])).toBe(true);
    expect(Reflect.set(transactions, 0, undefined)).toBe(false);
  });

  it.each(chains)("preserves the minimal Puzzle contract for %s", (chain) => {
    /* An address record passes through as given, so any chain takes the fixture. */
    const record = puzzle({ ...required, chain });
    expect(record).toBeInstanceOf(Puzzle);
    expect(record.chain()).toBe(chain);
    expect(record.preGenesis()).toBe(false);
    expect(record.escrow()).toBeUndefined();
    expect(record.transactions()).toEqual([]);
    expect(Object.isFrozen(record.transactions())).toBe(true);
    expect(record.assetLinks()).toEqual([]);
    expect(Object.isFrozen(record.assetLinks())).toBe(true);
    expect(record.hints()).toEqual([]);
    expect(Object.isFrozen(record.hints())).toBe(true);
    expect(record.stages()).toEqual([]);
    expect(Object.isFrozen(record.stages())).toBe(true);
    expect(record.toJSON()).toEqual({
      id: required.id,
      address: required.address,
      source_url: required.sourceUrl,
      start_date: required.startedAt,
      chain,
      status: Status.Unsolved,
    });
  });

  it.each(readable)("reads a %s address %s into its kind and HASH160", (chain, value, expected) => {
    const read = puzzle({ ...required, chain, address: value, escrow: value });

    expect(read.address()).toEqual(expected);
    expect(read.escrow()).toEqual(expected);
  });

  it.each([
    [Chain.Bitcoin, "0x635739254BDE27d28301f25aD57c3cAC3C3468f3"],
    [Chain.Litecoin, "1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe"],
    [Chain.BitcoinCash, "bitcoincash:qz3yjg59ypg6jqpwhaxgvjj44jm4hdx0w5wsxw2qez"],
    [Chain.Bitcoin, "bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297"],
  ])("refuses a %s record whose address is %s", (chain, value) => {
    expect(() => puzzle({ ...required, chain, address: value })).toThrow(
      new TypeError(`${value} is not a ${chain} address kind a record can hold`),
    );
  });

  it("lists each stage artifact file once, after the files the asset block names", () => {
    const record = puzzle({
      ...required,
      assets: assets({ puzzle: "puzzle.png" }),
      stages: [
        stage("phase 1", "An image.", [
          artifact("image", "https://example.com/puzzle", "puzzle.png"),
          artifact("page", "https://example.com/next"),
        ]),
        stage(
          "phase 2",
          "A blob.",
          [artifact("ciphertext", "https://example.com/next", "phase2.txt")],
          answer("hunter2", "https://example.com/writeup", { date: "2026-01-02" }),
        ),
      ],
    });

    expect(record.assetLinks().map((link) => [link.kind, link.path])).toEqual([
      ["puzzle", "assets/fixture/puzzle.png"],
      ["artifact", "assets/fixture/phase2.txt"],
    ]);
    expect(record.stages()[0]?.artifacts[1]).toEqual({
      name: "page",
      url: "https://example.com/next",
    });
    expect(record.toJSON().stages?.map((item) => item.name)).toEqual(["phase 1", "phase 2"]);
    expect("answer" in (record.stages()[0] ?? {})).toBe(false);
    expect(record.stages()[1]?.answer).toEqual({
      text: "hunter2",
      source: "https://example.com/writeup",
      date: "2026-01-02",
    });
    expect(Object.isFrozen(record.stages()[1]?.artifacts[0])).toBe(true);
  });

  it("links stage artifact files on a record without an asset block", () => {
    const record = puzzle({
      ...required,
      stages: [
        stage("phase 1", "A blob.", [artifact("ciphertext", "https://example.com/a", "a.txt")]),
      ],
    });

    expect(record.assetLinks().map((link) => link.kind)).toEqual(["artifact"]);
  });

  it("keeps a stage copy under the collection when the image path is overridden", () => {
    class Mirrored extends BitcoinPuzzle {
      override id(): string {
        return "fixture/mirrored";
      }

      override address() {
        return required.address;
      }

      override sourceUrl(): string {
        return required.sourceUrl;
      }

      override startedAt(): string {
        return required.startedAt;
      }

      override assets() {
        return assets({ puzzle: "puzzle.png" });
      }

      override stages() {
        return [stage("one", "An image.", [artifact("image", required.sourceUrl, "puzzle.png")])];
      }

      override assetPath(): string {
        return "mirror/puzzle.png";
      }
    }

    const puzzle = new Mirrored();

    expect(puzzle.assetLinks().map((link) => [link.kind, link.path])).toEqual([
      ["puzzle", "mirror/puzzle.png"],
      ["artifact", "assets/fixture/puzzle.png"],
    ]);
    expect(formatStageReport(puzzle)).toContain(
      `\t\timage\t${required.sourceUrl}\t${ASSETS}/assets/fixture/puzzle.png`,
    );
  });

  it("keeps the solver separate from the solution file in the serialized record", () => {
    const record = puzzle({
      ...required,
      solver: party("Fixture"),
      assets: assets({ solution: "solution.md" }),
    });

    expect(record.solver()).toEqual({ name: "Fixture" });
    expect(record.assets()).toEqual({ solution: "solution.md" });
    expect(record.toJSON().solver).toEqual({ name: "Fixture" });
    expect(record.toJSON().assets).toEqual({ solution: "solution.md" });
    expect(assets({})).toEqual({});
  });

  it("encodes an asset file name for the URL and leaves the path alone", () => {
    const record = puzzle({ ...required, assets: assets({ solution: "notes #1?.md" }) });

    expect(record.assetUrl()).toBeUndefined();
    expect(record.assetLinks()).toEqual([
      {
        kind: "solution",
        file: "notes #1?.md",
        path: "assets/fixture/notes #1?.md",
        url: `${ASSETS}/assets/fixture/notes%20%231%3F.md`,
      },
    ]);
  });

  it("follows an overridden assetPath() into assetUrl() and assetLinks()", () => {
    class Mirrored extends BitcoinPuzzle {
      override id(): string {
        return "fixture/mirrored";
      }

      override address() {
        return required.address;
      }

      override sourceUrl(): string {
        return required.sourceUrl;
      }

      override startedAt(): string {
        return required.startedAt;
      }

      override assets() {
        return assets({ puzzle: "puzzle.png", hints: ["hint.png"] });
      }

      override assetPath(): string {
        return "mirror/puzzle.png";
      }
    }
    const puzzle = new Mirrored();

    expect(puzzle.assetUrl()).toBe(`${ASSETS}/mirror/puzzle.png`);
    expect(puzzle.assetLinks().map((link) => [link.kind, link.path])).toEqual([
      ["puzzle", "mirror/puzzle.png"],
      ["hint", "assets/fixture/hint.png"],
    ]);
  });

  it("keeps a published answer separate from the original hint and its date", () => {
    const solution = answer("visit", "https://example.com/answers", { date: "2026-04-01" });
    const proof = confirmation("https://archive.ph/puzzle");
    for (const build of [official, community]) {
      const hint = build("Presence without permanence.", "https://example.com/puzzle", proof, {
        date: "2026-03-17",
        answer: solution,
      });
      expect(hint.text).toBe("Presence without permanence.");
      expect(hint.date).toBe("2026-03-17");
      expect(hint.answer).toEqual({
        text: "visit",
        source: "https://example.com/answers",
        date: "2026-04-01",
      });
      const record = puzzle({ ...required, hints: [hint] });
      expect(record.toJSON().hints?.[0]?.answer).toEqual(solution);
      expect(Object.isFrozen(record.hints()[0]?.answer)).toBe(true);
    }
    expect(answer("visit", "https://example.com/answers")).not.toHaveProperty("date");
  });

  it("omits absent confirmation while retaining optional hint metadata", () => {
    for (const build of [official, community]) {
      const plain = build("Start at the top.", "https://example.com/rules");
      expect(plain).toEqual({
        kind: build === official ? "official" : "community",
        text: "Start at the top.",
        source: "https://example.com/rules",
      });
      const dated = build("Start at the top.", "https://example.com/rules", undefined, {
        date: "2026-01-01",
        answer: answer("Top left.", "https://example.com/answer"),
      });
      expect(dated).toEqual({
        ...plain,
        date: "2026-01-01",
        answer: { text: "Top left.", source: "https://example.com/answer" },
      });
      const record = puzzle({ ...required, hints: [plain, dated] });
      expect(record.toJSON().hints).toEqual([plain, dated]);
      expect(record.hints().every((hint) => Object.isFrozen(hint))).toBe(true);
      expect(JSON.stringify(record.toJSON())).not.toContain('"confirmation"');
    }
  });

  it("builds a hint with its kind, its provenance and nothing it was not given", () => {
    const proof = confirmation("https://web.archive.org/web/2026/https://example.com/puzzle");

    expect(proof).toEqual({ url: "https://web.archive.org/web/2026/https://example.com/puzzle" });
    expect(official("Start at the top.", "https://example.com/puzzle", proof)).toEqual({
      kind: "official",
      text: "Start at the top.",
      source: "https://example.com/puzzle",
      confirmation: proof,
    });
    expect(
      community(
        "The top is a decoy.",
        "https://example.com/thread",
        confirmation("https://archive.ph/thread", "capture of the thread"),
        { date: "2026-01-03 12:00:00" },
      ),
    ).toEqual({
      kind: "community",
      text: "The top is a decoy.",
      source: "https://example.com/thread",
      confirmation: { url: "https://archive.ph/thread", description: "capture of the thread" },
      date: "2026-01-03 12:00:00",
    });
  });

  it("serializes every optional record field and retains derived behavior", () => {
    const spec = {
      ...required,
      assets: assets({ puzzle: "puzzle.png", hints: ["hint.txt"] }),
      currency: "TEST",
      hints: [
        official(
          "Start at the top.",
          "https://example.com/puzzle",
          confirmation("https://web.archive.org/web/2026/https://example.com/puzzle"),
        ),
      ],
      key: hex("1".padStart(64, "0"), 1),
      preGenesis: true,
      prize: 0,
      pubkey: compressed("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
      solvedAt: "2026-01-02",
      solveTime: 0,
      solver: party("Fixture"),
      status: Status.Solved,
      transactions: [claim("0".repeat(64), "2026-01-02", 0)],
    } satisfies PuzzleSpec;
    const record = puzzle(spec);

    expect(record.toJSON()).toEqual({
      id: spec.id,
      chain: Chain.Bitcoin,
      address: spec.address,
      source_url: spec.sourceUrl,
      start_date: spec.startedAt,
      assets: spec.assets,
      currency: spec.currency,
      hints: spec.hints,
      key: spec.key.data(),
      pre_genesis: true,
      prize: 0,
      pubkey: spec.pubkey,
      solve_date: spec.solvedAt,
      solve_time: 0,
      solver: spec.solver,
      status: Status.Solved,
      transactions: spec.transactions,
    });
    expect(record.keyRange()).toEqual([1n, 1n]);
    expect(record.claimTransaction()).toEqual(spec.transactions[0]);
    expect(record.assetPath()).toBe("assets/fixture/puzzle.png");
    expect(record.assetLinks()).toEqual([
      {
        kind: "puzzle",
        file: "puzzle.png",
        path: "assets/fixture/puzzle.png",
        url: `${ASSETS}/assets/fixture/puzzle.png`,
      },
      {
        kind: "hint",
        file: "hint.txt",
        path: "assets/fixture/hint.txt",
        url: `${ASSETS}/assets/fixture/hint.txt`,
      },
    ]);
    expect(Object.isFrozen(record.assetLinks())).toBe(true);
    expect(Object.isFrozen(record.assetLinks()[0])).toBe(true);
    expect(record.hints()).toBe(spec.hints);
    expect(Object.isFrozen(record.hints())).toBe(true);
    expect(
      record.hints().map((hint) => [Object.isFrozen(hint), Object.isFrozen(hint.confirmation)]),
    ).toEqual([[true, true]]);
    expect(record.formattedSolveTime()).toBe("0s");
    expect(record.prizeCurrency()).toBe("TEST");
  });
});

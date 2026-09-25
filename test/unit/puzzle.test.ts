import { describe, expect, it } from "vite-plus/test";
import {
  artifact,
  arweavePuzzle,
  assets,
  BitcoinPuzzle,
  bitcoinPuzzle,
  Chain,
  claim,
  community,
  compressed,
  confirmation,
  decredPuzzle,
  derivation,
  ethereumPuzzle,
  hex,
  litecoinPuzzle,
  moneroPuzzle,
  official,
  answer,
  p2pkh,
  party,
  passphrase,
  Puzzle,
  type PuzzleSpec,
  stage,
  Status,
} from "../../src/index.ts";

const required = {
  id: "fixture/1",
  address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
  sourceUrl: "https://example.com/puzzle",
  startedAt: "2026-01-01",
} satisfies PuzzleSpec;

const factories = [
  [Chain.Arweave, arweavePuzzle],
  [Chain.Bitcoin, bitcoinPuzzle],
  [Chain.Decred, decredPuzzle],
  [Chain.Ethereum, ethereumPuzzle],
  [Chain.Litecoin, litecoinPuzzle],
  [Chain.Monero, moneroPuzzle],
] as const;

describe("puzzle record factories", () => {
  it("exposes the documented passphrase-only key builder", () => {
    const puzzle = bitcoinPuzzle({ ...required, key: passphrase("public fixture") });
    expect(puzzle.keyData()).toEqual({ wif: { passphrase: "public fixture" } });
    expect(puzzle.hasPrivateKey()).toBe(false);
  });

  it("marks a derived key only when the record has a secret", () => {
    expect(bitcoinPuzzle({ ...required, key: hex("1".padStart(64, "0")) }).hasDerivedKey()).toBe(
      false,
    );
    const pathOnly = bitcoinPuzzle({ ...required, key: derivation("m/0").derived() });
    expect(pathOnly.keyData()).toEqual({ seed: { path: "m/0" }, derived: true });
    expect(pathOnly.hasDerivedKey()).toBe(false);
  });

  it("hands back a key builder that leaves the record alone", () => {
    const key = hex("1".padStart(64, "0"), 1);
    const puzzle = bitcoinPuzzle({ ...required, key });
    const wif = "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn";

    const extended = puzzle.key()?.wif(wif);

    expect(extended?.data()).toEqual({
      hex: "1".padStart(64, "0"),
      bits: 1,
      wif: { decrypted: wif },
    });
    expect(puzzle.keyData()).toEqual({ hex: "1".padStart(64, "0"), bits: 1 });
    expect(puzzle.key()).toBe(key);
  });

  it("freezes the record it builds, nested parts included", () => {
    const puzzle = bitcoinPuzzle({
      ...required,
      key: hex("1".padStart(64, "0"), 1).wif(
        "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn",
      ),
      solver: party("Fixture", { addresses: ["1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"] }),
      transactions: [claim("0".repeat(64), "2026-01-02", 0)],
    });
    const parts = [
      puzzle.address(),
      puzzle.transactions(),
      puzzle.transactions()[0],
      puzzle.solver(),
      puzzle.solver()?.addresses,
      puzzle.keyData(),
      puzzle.keyData()?.wif,
      puzzle.toJSON(),
    ];

    expect(parts.map((part) => Object.isFrozen(part))).toEqual(parts.map(() => true));
    expect(Reflect.set(puzzle.address(), "value", "1Mutated")).toBe(false);
    expect(Reflect.set(puzzle.toJSON(), "status", Status.Solved)).toBe(false);
    expect(puzzle.address().value).toBe(required.address.value);
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
    const puzzle = bitcoinPuzzle(Object.freeze({ ...required, transactions }));

    expect(Object.isFrozen(puzzle.transactions())).toBe(true);
    expect(Object.isFrozen(puzzle.transactions()[0])).toBe(true);
    expect(Reflect.set(transactions, 0, undefined)).toBe(false);
  });

  it.each(factories)("preserves the minimal Puzzle contract for %s", (chain, factory) => {
    /* Factories assign chains. Address validation is a separate concern. */
    const puzzle = factory(required);
    expect(puzzle).toBeInstanceOf(Puzzle);
    expect(puzzle.chain()).toBe(chain);
    expect(puzzle.preGenesis()).toBe(false);
    expect(puzzle.transactions()).toEqual([]);
    expect(Object.isFrozen(puzzle.transactions())).toBe(true);
    expect(puzzle.assetLinks()).toEqual([]);
    expect(Object.isFrozen(puzzle.assetLinks())).toBe(true);
    expect(puzzle.hints()).toEqual([]);
    expect(Object.isFrozen(puzzle.hints())).toBe(true);
    expect(puzzle.stages()).toEqual([]);
    expect(Object.isFrozen(puzzle.stages())).toBe(true);
    expect(puzzle.toJSON()).toEqual({
      id: required.id,
      address: required.address,
      source_url: required.sourceUrl,
      start_date: required.startedAt,
      chain,
      status: Status.Unsolved,
    });
  });

  it("lists each stage artifact file once, after the files the asset block names", () => {
    const puzzle = bitcoinPuzzle({
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

    expect(puzzle.assetLinks().map((link) => [link.kind, link.path])).toEqual([
      ["puzzle", "assets/fixture/puzzle.png"],
      ["artifact", "assets/fixture/phase2.txt"],
    ]);
    expect(puzzle.stages()[0]?.artifacts[1]).toEqual({
      name: "page",
      url: "https://example.com/next",
    });
    expect(puzzle.toJSON().stages?.map((item) => item.name)).toEqual(["phase 1", "phase 2"]);
    expect("answer" in (puzzle.stages()[0] ?? {})).toBe(false);
    expect(puzzle.stages()[1]?.answer).toEqual({
      text: "hunter2",
      source: "https://example.com/writeup",
      date: "2026-01-02",
    });
    expect(Object.isFrozen(puzzle.stages()[1]?.artifacts[0])).toBe(true);
  });

  it("links stage artifact files on a record without an asset block", () => {
    const puzzle = bitcoinPuzzle({
      ...required,
      stages: [
        stage("phase 1", "A blob.", [artifact("ciphertext", "https://example.com/a", "a.txt")]),
      ],
    });

    expect(puzzle.assetLinks().map((link) => link.kind)).toEqual(["artifact"]);
  });

  it("keeps the solver separate from the solution file in the serialized record", () => {
    const puzzle = bitcoinPuzzle({
      ...required,
      solver: party("Fixture"),
      assets: assets({ solution: "solution.md" }),
    });

    expect(puzzle.solver()).toEqual({ name: "Fixture" });
    expect(puzzle.assets()).toEqual({ solution: "solution.md" });
    expect(puzzle.toJSON().solver).toEqual({ name: "Fixture" });
    expect(puzzle.toJSON().assets).toEqual({ solution: "solution.md" });
    expect(assets({})).toEqual({});
  });

  it("encodes an asset file name for the URL and leaves the path alone", () => {
    const puzzle = bitcoinPuzzle({ ...required, assets: assets({ solution: "notes #1?.md" }) });

    expect(puzzle.assetUrl()).toBeUndefined();
    expect(puzzle.assetLinks()).toEqual([
      {
        kind: "solution",
        file: "notes #1?.md",
        path: "assets/fixture/notes #1?.md",
        url: "https://raw.githubusercontent.com/agntn/puzzles/main/assets/fixture/notes%20%231%3F.md",
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

    expect(puzzle.assetUrl()).toBe(
      "https://raw.githubusercontent.com/agntn/puzzles/main/mirror/puzzle.png",
    );
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
      const puzzle = bitcoinPuzzle({ ...required, hints: [hint] });
      expect(puzzle.toJSON().hints?.[0]?.answer).toEqual(solution);
      expect(Object.isFrozen(puzzle.hints()[0]?.answer)).toBe(true);
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
      const puzzle = bitcoinPuzzle({ ...required, hints: [plain, dated] });
      expect(puzzle.toJSON().hints).toEqual([plain, dated]);
      expect(puzzle.hints().every((hint) => Object.isFrozen(hint))).toBe(true);
      expect(JSON.stringify(puzzle.toJSON())).not.toContain('"confirmation"');
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
    const puzzle = bitcoinPuzzle(spec);

    expect(puzzle.toJSON()).toEqual({
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
    expect(puzzle.keyRange()).toEqual([1n, 1n]);
    expect(puzzle.claimTransaction()).toEqual(spec.transactions[0]);
    expect(puzzle.assetPath()).toBe("assets/fixture/puzzle.png");
    expect(puzzle.assetLinks()).toEqual([
      {
        kind: "puzzle",
        file: "puzzle.png",
        path: "assets/fixture/puzzle.png",
        url: "https://raw.githubusercontent.com/agntn/puzzles/main/assets/fixture/puzzle.png",
      },
      {
        kind: "hint",
        file: "hint.txt",
        path: "assets/fixture/hint.txt",
        url: "https://raw.githubusercontent.com/agntn/puzzles/main/assets/fixture/hint.txt",
      },
    ]);
    expect(Object.isFrozen(puzzle.assetLinks())).toBe(true);
    expect(Object.isFrozen(puzzle.assetLinks()[0])).toBe(true);
    expect(puzzle.hints()).toBe(spec.hints);
    expect(Object.isFrozen(puzzle.hints())).toBe(true);
    expect(
      puzzle.hints().map((hint) => [Object.isFrozen(hint), Object.isFrozen(hint.confirmation)]),
    ).toEqual([[true, true]]);
    expect(puzzle.formattedSolveTime()).toBe("0s");
    expect(puzzle.prizeCurrency()).toBe("TEST");
  });
});

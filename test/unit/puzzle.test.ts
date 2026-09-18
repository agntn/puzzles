import { describe, expect, it } from "vitest";
import {
  arweavePuzzle,
  assets,
  bitcoinPuzzle,
  Chain,
  claim,
  compressed,
  decredPuzzle,
  ethereumPuzzle,
  hex,
  litecoinPuzzle,
  moneroPuzzle,
  p2pkh,
  party,
  passphrase,
  Puzzle,
  type PuzzleSpec,
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
    ];

    expect(parts.map((part) => Object.isFrozen(part))).toEqual(parts.map(() => true));
    expect(Reflect.set(puzzle.address(), "value", "1Mutated")).toBe(false);
    expect(puzzle.address().value).toBe(required.address.value);
  });

  it.each(factories)("preserves the minimal Puzzle contract for %s", (chain, factory) => {
    /* Factories assign chains. Address validation is a separate concern. */
    const puzzle = factory(required);
    expect(puzzle).toBeInstanceOf(Puzzle);
    expect(puzzle.chain()).toBe(chain);
    expect(puzzle.preGenesis()).toBe(false);
    expect(puzzle.transactions()).toEqual([]);
    expect(puzzle.toJSON()).toEqual({
      id: required.id,
      address: required.address,
      source_url: required.sourceUrl,
      start_date: required.startedAt,
      chain,
      status: Status.Unsolved,
    });
  });

  it("serializes every optional record field and retains derived behavior", () => {
    const spec = {
      ...required,
      assets: assets({ puzzle: "puzzle.png", hints: ["hint.txt"] }),
      currency: "TEST",
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
    expect(puzzle.formattedSolveTime()).toBe("0s");
    expect(puzzle.prizeCurrency()).toBe("TEST");
  });
});

import { describe, expect, it } from "vite-plus/test";
import { toPuzzleView } from "../../docs/app/utils/puzzle-view.ts";
import {
  literalTokens,
  recordLiteral,
  solvedText,
  transactionTicks,
} from "../../docs/app/utils/record.ts";

/**
 * The view of one record, the way the puzzle page and the playground read it.
 *
 * @param {string} id - The puzzle identifier.
 * @returns {Promise<import("../../docs/app/utils/puzzle-view.ts").PuzzleView>} The view.
 */
async function viewOf(id: string) {
  const library = await import("../../src/index.ts");
  return toPuzzleView(library, await library.requirePuzzle(id), "", [], []);
}

describe("docs record helpers", () => {
  it("print a solve date without a dangling separator when the record has no solve time", async () => {
    const view = await viewOf("luckylurker/vault-1");

    expect(view.solvedAt).toBeDefined();
    expect(view.solveTime).toBeUndefined();
    expect(solvedText(view)).toBe(view.solvedAt?.slice(0, 10));
  });

  it("label an Electrum seed and its extension apart from BIP39", async () => {
    const library = await import("../../src/index.ts");
    const view = await viewOf("luckylurker/vault-1");
    const extended = await toPuzzleView(
      library,
      library.puzzle({
        id: "test/electrum",
        chain: "bitcoin",
        address: "bc1q32e3dxcd0n2tlzdmchraf2057d0ax4xdwrk3jq",
        sourceUrl: "https://example.com",
        startedAt: "2020-01-01 00:00:00",
        key: library.seed("visit … spot", "m/0'/0/1", "extension").electrum(),
      }),
      "",
      [],
      [],
    );

    expect(view.derived).toBe(false);
    expect(view.keyRows.map((row) => [row.label, row.value])).toEqual([
      [
        "seed phrase",
        "visit kingdom unveil kangaroo deposit found great grid remind science umbrella spot",
      ],
      ["seed scheme", "Electrum, not BIP39"],
      ["derivation path", "m/0'/0/1"],
    ]);
    expect(extended.keyRows.map((row) => row.label)).toContain("Electrum seed extension");
    expect(extended.keyRows.map((row) => row.label)).not.toContain("BIP39 passphrase");
  });

  it("print the solve time after the date when the record has one", async () => {
    const view = await viewOf("bits/66");

    expect(solvedText(view)).toBe(`${view.solvedAt?.slice(0, 10)} · ${view.solveTime}`);
  });

  it("print the escrow beside the address, in the literal and with its explorer link", async () => {
    const view = await viewOf("powerful-moss");

    expect(view.escrow).toEqual({
      address: "0x831102C7eb86f9EC8f79dF891bDeA187D54344Dd",
      kind: "standard",
      explorer: "https://basescan.org/address/0x831102C7eb86f9EC8f79dF891bDeA187D54344Dd",
    });
    expect(recordLiteral(view).split("\n").slice(0, 4)).toEqual([
      "puzzle({",
      '  chain: "base",',
      '  address: "0x635739254BDE27d28301f25aD57c3cAC3C3468f3",',
      '  escrow: "0x831102C7eb86f9EC8f79dF891bDeA187D54344Dd",',
    ]);
    expect((await viewOf("bits/71")).escrow).toBeUndefined();
  });

  it("say `not yet` for an open puzzle", async () => {
    expect(solvedText(await viewOf("bits/71"))).toBe("not yet");
  });

  it("open one tick per outgoing transaction", async () => {
    const view = await viewOf("luckylurker/vault-1");

    expect(transactionTicks(view)).toEqual(
      view.transactionRows.map((row) => (row.type === "claim" ? "open" : "closed")),
    );
  });

  it("color the literal without dropping anything but the middle of long values", async () => {
    const literal = recordLiteral(await viewOf("bits/66"));
    const tokens = literalTokens(literal);

    expect(tokens.map((token) => token.text.replace(/"[^"]*"/u, '""')).join("")).toBe(
      literal.replaceAll(/"[^"]*"/gu, '""'),
    );
    expect(tokens.find((token) => token.cls === "tok-fn")?.text).toBe("puzzle");
  });

  it("write the address as a string unless a builder says more", async () => {
    const lines = async (id: string) => recordLiteral(await viewOf(id)).split("\n");

    expect((await lines("bits/71"))[2]).toBe('  address: "1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU",');
    expect((await lines("mini/1"))[1]).toBe('  chain: "bitcoincash",');
    expect((await lines("mini/1"))[2]).toMatch(/^ {2}address: p2pkh\("bitcoincash:q/u);
    expect((await lines("hash-collision/sha1"))[2]).toMatch(
      /^ {2}address: p2sh\(".*redeemScript\(/u,
    );
  });

  it("list the collection's techniques first, then the record's, then each stage's", async () => {
    const library = await import("../../src/index.ts");
    const scoped = async (id: string) => {
      const puzzle = await library.requirePuzzle(id);
      const collection = await library.requireCollection(puzzle.collection());
      const view = await toPuzzleView(library, puzzle, "", [], collection.techniques);
      return view.techniques.map((row) => [row.scope, row.name]);
    };

    expect(await scoped("bits/71")).toEqual([["collection", "masked-key-range"]]);
    expect(await scoped("gsmg")).toEqual([
      ["stage phase 1", "binary"],
      ["stage phase 2", "openssl-salted-sha256"],
      ["stage phase 3", "openssl-salted-sha256"],
      ["stage phase 3.2.1", "beaufort"],
      ["stage phase 3.2.2", "straddling-checkerboard"],
    ]);
    expect(await scoped("mini/3")).toEqual([]);
  });
});

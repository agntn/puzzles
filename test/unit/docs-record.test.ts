import { describe, expect, it } from "vite-plus/test";
import { toPuzzleView } from "../../docs/app/utils/puzzle-view.ts";
import {
  literalTokens,
  recordLiteral,
  solvedText,
  transactionTicks,
} from "../../docs/app/utils/record.ts";
import { factoryName } from "../../docs/app/utils/samples.ts";
import { chains } from "../../src/index.ts";

/**
 * The view of one record, the way the puzzle page and the playground read it.
 *
 * @param {string} id - The puzzle identifier.
 * @returns {Promise<import("../../docs/app/utils/puzzle-view.ts").PuzzleView>} The view.
 */
async function viewOf(id: string) {
  const library = await import("../../src/index.ts");
  return toPuzzleView(library, await library.requirePuzzle(id), "", []);
}

describe("docs record helpers", () => {
  it("print a solve date without a dangling separator when the record has no solve time", async () => {
    const view = await viewOf("luckylurker/vault-1");

    expect(view.solvedAt).toBeDefined();
    expect(view.solveTime).toBeUndefined();
    expect(solvedText(view)).toBe(view.solvedAt?.slice(0, 10));
  });

  it("print the solve time after the date when the record has one", async () => {
    const view = await viewOf("b1000/66");

    expect(solvedText(view)).toBe(`${view.solvedAt?.slice(0, 10)} · ${view.solveTime}`);
  });

  it("print the escrow beside the address, in the literal and with its explorer link", async () => {
    const view = await viewOf("powerful-moss");

    expect(view.escrow).toEqual({
      address: "0x831102C7eb86f9EC8f79dF891bDeA187D54344Dd",
      kind: "standard",
      explorer: "https://basescan.org/address/0x831102C7eb86f9EC8f79dF891bDeA187D54344Dd",
    });
    expect(recordLiteral(view).split("\n").slice(0, 3)).toEqual([
      "basePuzzle({",
      '  address: standard("0x635739254BDE27d28301f25aD57c3cAC3C3468f3"),',
      '  escrow: standard("0x831102C7eb86f9EC8f79dF891bDeA187D54344Dd"),',
    ]);
    expect((await viewOf("b1000/71")).escrow).toBeUndefined();
  });

  it("say `not yet` for an open puzzle", async () => {
    expect(solvedText(await viewOf("b1000/71"))).toBe("not yet");
  });

  it("open one tick per outgoing transaction", async () => {
    const view = await viewOf("luckylurker/vault-1");

    expect(transactionTicks(view)).toEqual(
      view.transactionRows.map((row) => (row.type === "claim" ? "open" : "closed")),
    );
  });

  it("color the literal without dropping anything but the middle of long values", async () => {
    const literal = recordLiteral(await viewOf("b1000/66"));
    const tokens = literalTokens(literal);

    expect(tokens.map((token) => token.text.replace(/"[^"]*"/u, '""')).join("")).toBe(
      literal.replaceAll(/"[^"]*"/gu, '""'),
    );
    expect(tokens.find((token) => token.cls === "tok-fn")?.text).toBe("bitcoinPuzzle");
  });

  it("name a factory the library exports for every chain", async () => {
    const library: Record<string, unknown> = await import("../../src/index.ts");

    for (const chain of chains) {
      expect(typeof library[factoryName(chain)], chain).toBe("function");
    }
    expect(recordLiteral(await viewOf("mini/1")).split("(")[0]).toBe("bitcoinCashPuzzle");
  });
});

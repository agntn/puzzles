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
  return toPuzzleView(library, await library.requirePuzzle(id), "", []);
}

describe("docs record helpers", () => {
  it("print a solve date without a dangling separator when the record has no solve time", async () => {
    const view = await viewOf("luckylurker/vault_1");

    expect(view.solvedAt).toBeDefined();
    expect(view.solveTime).toBeUndefined();
    expect(solvedText(view)).toBe(view.solvedAt?.slice(0, 10));
  });

  it("print the solve time after the date when the record has one", async () => {
    const view = await viewOf("b1000/66");

    expect(solvedText(view)).toBe(`${view.solvedAt?.slice(0, 10)} · ${view.solveTime}`);
  });

  it("say `not yet` for an open puzzle", async () => {
    expect(solvedText(await viewOf("b1000/71"))).toBe("not yet");
  });

  it("open one tick per outgoing transaction", async () => {
    const view = await viewOf("luckylurker/vault_1");

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
});

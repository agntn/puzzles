/** Live provider roundtrips for `Puzzle.balance()`. Run with `pnpm test:live`. */
import { describe, expect, it } from "vite-plus/test";
import { Balance, requirePuzzle } from "../../src/index.ts";

const etherscanKey = process.env["ETHERSCAN_API_KEY"];

describe("Puzzle.balance, live", () => {
  it("reads a Bitcoin balance through Mempool", async () => {
    const balance = await (await requirePuzzle("b1000/71")).balance();

    expect(balance).toBeInstanceOf(Balance);
    expect(balance.chain).toBe("bitcoin");
    expect(balance.confirmed).toBeGreaterThan(0n);
  });

  it("reads a Litecoin balance through Mempool", async () => {
    const balance = await (await requirePuzzle("zden/litecoin_segwit")).balance();

    expect(balance.chain).toBe("litecoin");
    expect(balance.confirmed).toBeGreaterThanOrEqual(0n);
  });

  it("reads a Decred balance through Dcrdata", async () => {
    /* dcrdata answers a fresh address in 6 to 11 seconds. The provider default is 15. */
    const balance = await (await requirePuzzle("zden/decred_janus")).balance({ timeout: 30_000 });

    expect(balance.chain).toBe("decred");
    expect(balance.confirmed).toBeGreaterThanOrEqual(0n);
  });

  it("reads an Arweave balance through the gateway", async () => {
    const balance = await (await requirePuzzle("arweave/weave3")).balance();

    expect(balance.chain).toBe("arweave");
    expect(balance.confirmed).toBeGreaterThanOrEqual(0n);
  });

  it.skipIf(etherscanKey === undefined)("reads an Ethereum balance through Etherscan", async () => {
    const balance = await (
      await requirePuzzle("arweave/weave11")
    ).balance({
      apiKey: etherscanKey,
    });

    expect(balance.chain).toBe("ethereum");
    expect(balance.confirmed).toBeGreaterThanOrEqual(0n);
  });
});

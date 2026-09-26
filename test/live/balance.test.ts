/** Live provider roundtrips for `Puzzle.balance()`. Run with `pnpm test:live`. */
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { Balance, requirePuzzle } from "../../src/index.ts";

const etherscanKey = process.env["ETHERSCAN_API_KEY"];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Puzzle.balance, live", () => {
  it("reads a Bitcoin balance through Mempool", async () => {
    const balance = await (await requirePuzzle("b1000/71")).balance();

    expect(balance).toBeInstanceOf(Balance);
    expect(balance.chain).toBe("bitcoin");
    expect(balance.confirmed).toBeGreaterThan(0n);
  });

  it("reads a Bitcoin balance through Blockstream when mempool.space gives no answer", async () => {
    const network = globalThis.fetch;
    const urls: string[] = [];
    /* `RequestInit` carries mutable members, so the stub takes both arguments as `unknown`. */
    vi.stubGlobal("fetch", async (input: unknown, init: unknown) => {
      const url = String(input);
      urls.push(url);
      if (url.startsWith("https://mempool.space/")) {
        throw new TypeError("fetch failed");
      }
      return network(url, init as RequestInit | undefined);
    });

    const balance = await (await requirePuzzle("b1000/71")).balance();

    expect(urls.map((url) => new URL(url).host)).toEqual(["mempool.space", "blockstream.info"]);
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

import { describe, expect, it } from "vitest";
import {
  addressExplorerUrl,
  Chain,
  chainDecimals,
  chainName,
  chains,
  chainSymbol,
  isValidAddress,
  isValidTransactionId,
  parseChain,
  transactionExplorerUrl,
} from "../../src/index.ts";

describe("chain metadata", () => {
  it("reads symbols, names, and decimals from @agntn/chains", () => {
    expect(
      chains.map((chain) => [chain, chainSymbol(chain), chainName(chain), chainDecimals(chain)]),
    ).toEqual([
      ["arweave", "AR", "Arweave", 12],
      ["bitcoin", "BTC", "Bitcoin", 8],
      ["decred", "DCR", "Decred", 8],
      ["ethereum", "ETH", "Ethereum", 18],
      ["litecoin", "LTC", "Litecoin", 8],
      ["monero", "XMR", "Monero", 12],
    ]);
  });

  it("parses keys, symbols, names, and aliases into supported chains only", () => {
    expect(parseChain("bitcoin")).toBe(Chain.Bitcoin);
    expect(parseChain(" BTC ")).toBe(Chain.Bitcoin);
    expect(parseChain("Decred")).toBe(Chain.Decred);
    expect(parseChain("xmr")).toBe(Chain.Monero);
    expect(parseChain("mainnet")).toBe(Chain.Ethereum);
    expect(parseChain("sol")).toBeUndefined();
    expect(parseChain("")).toBeUndefined();
    expect(parseChain("nope")).toBeUndefined();
    expect(parseChain("constructor")).toBeUndefined();
    expect(parseChain("__proto__")).toBeUndefined();
  });

  it("builds explorer links on each chain's default explorer", () => {
    expect(addressExplorerUrl(Chain.Bitcoin, "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH")).toBe(
      "https://blockstream.info/address/1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
    );
    expect(transactionExplorerUrl(Chain.Ethereum, "0xabc")).toBe("https://etherscan.io/tx/0xabc");
    expect(addressExplorerUrl(Chain.Monero, "4A B")).toBe(
      "https://xmrchain.net/search?value=4A%20B",
    );
    expect(transactionExplorerUrl(Chain.Arweave, "id/with?chars")).toBe(
      "https://viewblock.io/arweave/tx/id%2Fwith%3Fchars",
    );
  });

  it("checks address formats through @agntn/chains", () => {
    expect(isValidAddress(Chain.Bitcoin, "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh")).toBe(true);
    expect(isValidAddress(Chain.Bitcoin, "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")).toBe(false);
    expect(isValidAddress(Chain.Ethereum, "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")).toBe(true);
    expect(isValidAddress(Chain.Arweave, "not base64url!")).toBe(false);
  });

  it("checks transaction identifiers by chain family", () => {
    const hex64 = "a".repeat(64);
    expect(isValidTransactionId(Chain.Bitcoin, hex64)).toBe(true);
    expect(isValidTransactionId(Chain.Litecoin, `0x${hex64}`)).toBe(false);
    expect(isValidTransactionId(Chain.Ethereum, `0x${hex64}`)).toBe(true);
    expect(isValidTransactionId(Chain.Ethereum, hex64)).toBe(false);
    expect(isValidTransactionId(Chain.Arweave, "vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw")).toBe(
      true,
    );
    expect(isValidTransactionId(Chain.Monero, hex64)).toBe(true);
  });
});

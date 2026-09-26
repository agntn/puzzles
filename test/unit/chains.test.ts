import { describe, expect, it } from "vite-plus/test";
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
  sameAddress,
  transactionExplorerUrl,
} from "../../src/index.ts";

describe("chain metadata", () => {
  it("reads symbols, names, and decimals from @agntn/chains", () => {
    expect(
      chains.map((chain) => [chain, chainSymbol(chain), chainName(chain), chainDecimals(chain)]),
    ).toEqual([
      ["arweave", "AR", "Arweave", 12],
      ["bitcoin", "BTC", "Bitcoin", 8],
      ["bitcoincash", "BCH", "Bitcoin Cash", 8],
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
    /* Bitcoin Cash takes CashAddr; the base58 spelling of the same hash is Bitcoin's. */
    expect(
      isValidAddress(Chain.BitcoinCash, "bitcoincash:qz3yjg59ypg6jqpwhaxgvjj44jm4hdx0w5wsxw2qez"),
    ).toBe(true);
    expect(isValidAddress(Chain.BitcoinCash, "1Fo65aKq8s8iquMt6weF1rku1moWVEd5Ua")).toBe(false);
    expect(isValidAddress(Chain.Arweave, "not base64url!")).toBe(false);
  });

  it("compares addresses in the case each chain actually fixes", () => {
    /* EIP-55 spends letter case on a checksum, so the explorer's spelling is the record's. */
    expect(
      sameAddress(
        Chain.Ethereum,
        "0x5d663791e869ca70c71e0a5f4cfd707f596265aa",
        "0x5D663791E869Ca70C71E0A5F4cfD707f596265aa",
      ),
    ).toBe(true);
    /* Bech32 is defined in either case, and never in both at once. */
    expect(
      sameAddress(
        Chain.Bitcoin,
        "bc1q94ecsn0qk8lap2gefrycnms3ruepy889z969a6",
        "BC1Q94ECSN0QK8LAP2GEFRYCNMS3RUEPY889Z969A6",
      ),
    ).toBe(true);
    /* So is CashAddr. */
    expect(
      sameAddress(
        Chain.BitcoinCash,
        "bitcoincash:qz3yjg59ypg6jqpwhaxgvjj44jm4hdx0w5wsxw2qez",
        "BITCOINCASH:QZ3YJG59YPG6JQPWHAXGVJJ44JM4HDX0W5WSXW2QEZ",
      ),
    ).toBe(true);
    /* Base58 is not: a recased string is a different address, and fails its own checksum. */
    expect(
      sameAddress(
        Chain.Bitcoin,
        "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
        "1bggz9tcn4rm9kbzdn7kprqz87sz26samh",
      ),
    ).toBe(false);
    expect(
      sameAddress(
        Chain.Ethereum,
        "0x5d663791e869ca70c71e0a5f4cfd707f596265aa",
        "0x6b2560b34c7469c561a8fce581c88bfb8cce73b2",
      ),
    ).toBe(false);
    expect(sameAddress(Chain.Bitcoin, "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH", "")).toBe(false);
  });

  it("checks transaction identifiers through @agntn/chains", () => {
    const hex64 = "a".repeat(64);
    expect(isValidTransactionId(Chain.Bitcoin, hex64)).toBe(true);
    expect(isValidTransactionId(Chain.Litecoin, `0x${hex64}`)).toBe(false);
    expect(isValidTransactionId(Chain.Decred, hex64)).toBe(true);
    expect(isValidTransactionId(Chain.Ethereum, `0x${hex64}`)).toBe(true);
    expect(isValidTransactionId(Chain.Ethereum, hex64)).toBe(false);
    expect(isValidTransactionId(Chain.Arweave, "vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw")).toBe(
      true,
    );
    /* 43 base64url characters carry 258 bits, so the last one can only encode 256 with two zero bits. */
    expect(isValidTransactionId(Chain.Arweave, "a".repeat(43))).toBe(false);
    expect(isValidTransactionId(Chain.Monero, hex64)).toBe(true);
    expect(isValidTransactionId(Chain.Monero, hex64.slice(1))).toBe(false);
  });
});

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
      ["base", "ETH", "Base", 18],
      ["bitcoin", "BTC", "Bitcoin", 8],
      ["bitcoincash", "BCH", "Bitcoin Cash", 8],
      ["decred", "DCR", "Decred", 8],
      ["dogecoin", "DOGE", "Dogecoin", 8],
      ["ecash", "XEC", "eCash", 2],
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
    expect(parseChain("doge")).toBe(Chain.Dogecoin);
    expect(parseChain("mainnet")).toBe(Chain.Ethereum);
    /* Base pays in ETH too, and the symbol stays Ethereum's. */
    expect(parseChain("base")).toBe(Chain.Base);
    expect(parseChain("ETH")).toBe(Chain.Ethereum);
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
    expect(addressExplorerUrl(Chain.Base, "0x635739254BDE27d28301f25aD57c3cAC3C3468f3")).toBe(
      "https://basescan.org/address/0x635739254BDE27d28301f25aD57c3cAC3C3468f3",
    );
    expect(addressExplorerUrl(Chain.Dogecoin, "DFpN6QqFfUm3gKNaxN6tNcab1FArL9cZLE")).toBe(
      "https://blockchair.com/dogecoin/address/DFpN6QqFfUm3gKNaxN6tNcab1FArL9cZLE",
    );
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
    expect(isValidAddress(Chain.Base, "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")).toBe(true);
    expect(isValidAddress(Chain.Base, "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH")).toBe(false);
    /* Bitcoin Cash takes CashAddr; the base58 spelling of the same hash is Bitcoin's. */
    expect(
      isValidAddress(Chain.BitcoinCash, "bitcoincash:qz3yjg59ypg6jqpwhaxgvjj44jm4hdx0w5wsxw2qez"),
    ).toBe(true);
    expect(isValidAddress(Chain.BitcoinCash, "1Fo65aKq8s8iquMt6weF1rku1moWVEd5Ua")).toBe(false);
    /* eCash takes CashAddr under its own prefix; the Bitcoin Cash spelling is another chain's. */
    expect(isValidAddress(Chain.ECash, "ecash:qq5r308v2mkh6x5mkqpr6wytszz6f9r7qcnfttev0z")).toBe(
      true,
    );
    expect(
      isValidAddress(Chain.ECash, "bitcoincash:qq5r308v2mkh6x5mkqpr6wytszz6f9r7qc2ylqzkf4"),
    ).toBe(false);
    /* Dogecoin writes base58 under its own version byte; Bitcoin's P2PKH of the same hash is not one. */
    expect(isValidAddress(Chain.Dogecoin, "DFpN6QqFfUm3gKNaxN6tNcab1FArL9cZLE")).toBe(true);
    expect(isValidAddress(Chain.Dogecoin, "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH")).toBe(false);
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
    expect(
      sameAddress(
        Chain.Base,
        "0x635739254bde27d28301f25ad57c3cac3c3468f3",
        "0x635739254BDE27d28301f25aD57c3cAC3C3468f3",
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
    expect(
      sameAddress(
        Chain.ECash,
        "ecash:qq5r308v2mkh6x5mkqpr6wytszz6f9r7qcnfttev0z",
        "ECASH:QQ5R308V2MKH6X5MKQPR6WYTSZZ6F9R7QCNFTTEV0Z",
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

import {
  Arweave,
  Base,
  Bitcoin,
  BitcoinCash,
  type Chain as ChainClass,
  type ChainKey,
  Decred,
  Dogecoin,
  Ecash,
  Ethereum,
  getChain,
  InvalidAddressError,
  InvalidTxidError,
  Litecoin,
  Monero,
  UnknownChainError,
  UnsupportedChainError,
} from "@agntn/chains";
import { InvalidArgumentError } from "./errors.ts";

/** Supported blockchain identifiers, a subset of the `@agntn/chains` keys. */
export const Chain = {
  Arweave: "arweave",
  Base: "base",
  Bitcoin: "bitcoin",
  BitcoinCash: "bitcoincash",
  Decred: "decred",
  Dogecoin: "dogecoin",
  ECash: "ecash",
  Ethereum: "ethereum",
  Litecoin: "litecoin",
  Monero: "monero",
} as const satisfies Record<string, ChainKey>;

/** A blockchain supported by the puzzle data. */
export type Chain = (typeof Chain)[keyof typeof Chain];

/** Every supported blockchain identifier. */
export const chains = Object.freeze(Object.values(Chain));

/** What a reader sees of a chain, kept equal to `@agntn/chains` by a test. */
interface ChainInfo {
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly explorer: string;
}

/** Copied, not read off instances: one `new Decred()` drags BLAKE-256 in just to print `DCR`. */
const metadata: Readonly<Record<Chain, ChainInfo>> = Object.freeze({
  arweave: {
    name: "Arweave",
    symbol: "AR",
    decimals: 12,
    explorer: "https://viewblock.io/arweave",
  },
  base: { name: "Base", symbol: "ETH", decimals: 18, explorer: "https://basescan.org" },
  bitcoin: { name: "Bitcoin", symbol: "BTC", decimals: 8, explorer: "https://blockstream.info" },
  bitcoincash: {
    name: "Bitcoin Cash",
    symbol: "BCH",
    decimals: 8,
    explorer: "https://blockchair.com/bitcoin-cash",
  },
  decred: { name: "Decred", symbol: "DCR", decimals: 8, explorer: "https://dcrdata.decred.org" },
  dogecoin: {
    name: "Dogecoin",
    symbol: "DOGE",
    decimals: 8,
    explorer: "https://blockchair.com/dogecoin",
  },
  ecash: { name: "eCash", symbol: "XEC", decimals: 2, explorer: "https://explorer.e.cash" },
  ethereum: { name: "Ethereum", symbol: "ETH", decimals: 18, explorer: "https://etherscan.io" },
  litecoin: { name: "Litecoin", symbol: "LTC", decimals: 8, explorer: "https://litecoinspace.org" },
  monero: { name: "Monero", symbol: "XMR", decimals: 12, explorer: "https://xmrchain.net" },
});

/** Format checks, built on first use, so a bundle that never checks skips every chain class. */
let checkers: Readonly<Record<Chain, ChainClass>> | undefined;

function checker(chain: Chain): ChainClass {
  checkers ??= Object.freeze({
    arweave: new Arweave(),
    base: new Base(),
    bitcoin: new Bitcoin(),
    bitcoincash: new BitcoinCash(),
    decred: new Decred(),
    dogecoin: new Dogecoin(),
    ecash: new Ecash(),
    ethereum: new Ethereum(),
    litecoin: new Litecoin(),
    monero: new Monero(),
  });
  return checkers[chain];
}

function isSupported(key: string): key is Chain {
  return Object.hasOwn(metadata, key);
}

/**
 * The native currency symbol for a chain.
 *
 * @param {Chain} chain - Chain the value belongs to.
 * @returns {string} `BTC`, `ETH` and so on.
 */
export function chainSymbol(chain: Chain): string {
  return metadata[chain].symbol;
}

/**
 * The number of base unit decimal places in a chain's native token.
 *
 * @param {Chain} chain - Chain the value belongs to.
 * @returns {number} 8 for Bitcoin, 18 for Ethereum.
 */
export function chainDecimals(chain: Chain): number {
  return metadata[chain].decimals;
}

/**
 * The display name for a chain.
 *
 * @param {Chain} chain - Chain the value belongs to.
 * @returns {string} `Bitcoin`, `Ethereum` and so on.
 */
export function chainName(chain: Chain): string {
  return metadata[chain].name;
}

/**
 * Parses a chain key, display name, symbol, or `@agntn/chains` alias into a supported chain.
 *
 * @param {string} value - Chain key, display name, symbol, or alias.
 * @returns {Chain | undefined} The supported chain, or `undefined` when the value names none.
 */
export function parseChain(value: string): Chain | undefined {
  try {
    const key = getChain(value).key;
    return isSupported(key) ? key : undefined;
  } catch (error) {
    if (error instanceof UnsupportedChainError || error instanceof UnknownChainError) {
      return undefined;
    }
    throw error;
  }
}

/**
 * Builds a transaction explorer URL on the chain's default explorer.
 *
 * @param {Chain} chain - Chain the value belongs to.
 * @param {string} txid - Transaction identifier.
 * @returns {string} The transaction explorer URL.
 */
export function transactionExplorerUrl(chain: Chain, txid: string): string {
  return `${metadata[chain].explorer}/tx/${encodeURIComponent(txid)}`;
}

/**
 * Builds an address explorer URL on the chain's default explorer.
 *
 * @param {Chain} chain - Chain the value belongs to.
 * @param {string} address - Address to describe.
 * @returns {string} The address explorer URL.
 */
export function addressExplorerUrl(chain: Chain, address: string): string {
  const encoded = encodeURIComponent(address);
  const base = metadata[chain].explorer;
  return chain === Chain.Monero ? `${base}/search?value=${encoded}` : `${base}/address/${encoded}`;
}

/**
 * Whether an address matches its chain's format rules.
 *
 * @param {Chain} chain - Chain the value belongs to.
 * @param {string} address - Address to describe.
 * @returns {boolean} `true` when the chain's format check passes.
 */
export function isValidAddress(chain: Chain, address: string): boolean {
  try {
    checker(chain).assertAddress(address);
    return true;
  } catch (error) {
    if (error instanceof InvalidAddressError) {
      return false;
    }
    throw error;
  }
}

/**
 * Whether a transaction identifier matches its chain's encoding.
 *
 * @param {Chain} chain - Chain the value belongs to.
 * @param {string} txid - Transaction identifier.
 * @returns {boolean} `true` when the chain's format check passes.
 */
export function isValidTransactionId(chain: Chain, txid: string): boolean {
  try {
    checker(chain).assertTxid(txid);
    return true;
  } catch (error) {
    if (error instanceof InvalidTxidError) {
      return false;
    }
    throw error;
  }
}

/**
 * Bech32 human-readable parts the supported chains spend to. A bech32 address is defined in
 * either case, so only its prefix says whether the case carries meaning.
 */
const bech32Prefixes: Readonly<Partial<Record<Chain, readonly string[]>>> = Object.freeze({
  bitcoin: ["bc1"],
  litecoin: ["ltc1"],
});

/**
 * Whether a chain writes this address in a case that carries no meaning. Ethereum hex, on Base as
 * well, is one such case: EIP-55 spends letter case on a checksum, so the same address travels lowercased,
 * uppercased and mixed. Bech32 and CashAddr, on Bitcoin Cash and eCash, are defined in either case too.
 * Base58 and base64url are not: there a different case is a different string, and the checksum
 * would reject it anyway.
 *
 * @param {Chain} chain - Chain the address lives on.
 * @param {string} address - The address to weigh.
 * @returns {boolean} `true` when letter case does not distinguish two addresses.
 */
function caseFolds(chain: Chain, address: string): boolean {
  if (
    chain === Chain.Ethereum ||
    chain === Chain.Base ||
    chain === Chain.BitcoinCash ||
    chain === Chain.ECash
  ) {
    return true;
  }
  const prefixes = bech32Prefixes[chain];
  const lowered = address.toLowerCase();
  return prefixes !== undefined && prefixes.some((prefix) => lowered.startsWith(prefix));
}

/**
 * Whether two strings name the same address on one chain. Use it instead of `===` whenever one
 * side came from a person or a model: an Ethereum address pasted from a block explorer carries an
 * EIP-55 checksum the records do not, and a bech32 address is just as valid shouted in capitals.
 *
 * @param {Chain} chain - Chain both addresses live on.
 * @param {string} left - One address.
 * @param {string} right - The other address.
 * @returns {boolean} `true` when both name the same address.
 */
export function sameAddress(chain: Chain, left: string, right: string): boolean {
  return (
    left === right ||
    (caseFolds(chain, left) &&
      caseFolds(chain, right) &&
      left.toLowerCase() === right.toLowerCase())
  );
}

/**
 * Parses a chain filter, throwing on a value no supported chain answers to. A key, a display
 * name, a symbol and a `@agntn/chains` alias all resolve, so `bitcoin`, `Bitcoin` and `BTC` name
 * the same chain. Anything that is not a string is a rejected filter, not a `TypeError`, because
 * a host may hand the executors whatever a model wrote.
 *
 * @param {string | undefined} value - Chain text from a caller, when given.
 * @returns {Chain | undefined} The chain filter, or `undefined` when none was given.
 */
export function requireChain(value: string | undefined): Chain | undefined {
  const chain = typeof value === "string" ? parseChain(value) : undefined;
  if (chain === undefined && value !== undefined) {
    throw new InvalidArgumentError("chain", `expected one of ${chains.join(", ")}`);
  }
  return chain;
}

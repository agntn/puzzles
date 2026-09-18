import {
  Arweave,
  Bitcoin,
  type ChainKey,
  Decred,
  Ethereum,
  getChain,
  InvalidAddressError,
  InvalidTxidError,
  Litecoin,
  Monero,
  UnknownChainError,
  UnsupportedChainError,
} from "@agntn/chains";

/** Supported blockchain identifiers, a subset of the `@agntn/chains` keys. */
export const Chain = {
  Arweave: "arweave",
  Bitcoin: "bitcoin",
  Decred: "decred",
  Ethereum: "ethereum",
  Litecoin: "litecoin",
  Monero: "monero",
} as const satisfies Record<string, ChainKey>;

/** A blockchain supported by the puzzle data. */
export type Chain = (typeof Chain)[keyof typeof Chain];

/** Every supported blockchain identifier. */
export const chains = Object.freeze(Object.values(Chain));

/** Chain metadata, address and txid format checks, and explorer bases come from `@agntn/chains`. */
const metadata = Object.freeze({
  arweave: new Arweave(),
  bitcoin: new Bitcoin(),
  decred: new Decred(),
  ethereum: new Ethereum(),
  litecoin: new Litecoin(),
  monero: new Monero(),
}) satisfies Readonly<Record<Chain, unknown>>;

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
    metadata[chain].assertAddress(address);
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
    metadata[chain].assertTxid(txid);
    return true;
  } catch (error) {
    if (error instanceof InvalidTxidError) {
      return false;
    }
    throw error;
  }
}

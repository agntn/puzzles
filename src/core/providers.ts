import { InvalidAddressError as ChainAddressError } from "@agntn/chains";
import {
  type Balance as Snapshot,
  HTTPError,
  type Provider,
  type ProviderConfig,
  RateLimitError,
  type Transaction as ExplorerTransaction,
  TransportError,
} from "@agntn/explorers";
import { Arweave } from "@agntn/explorers/providers/arweave";
import { Blockchair } from "@agntn/explorers/providers/blockchair";
import { Blockscout } from "@agntn/explorers/providers/blockscout";
import { Blockstream } from "@agntn/explorers/providers/blockstream";
import { Dcrdata } from "@agntn/explorers/providers/dcrdata";
import { Etherscan } from "@agntn/explorers/providers/etherscan";
import { Mempool } from "@agntn/explorers/providers/mempool";
import {
  BalanceError,
  BalanceProviderError,
  HISTORY_LIMIT,
  HISTORY_PAGE,
  InvalidAddressError,
  UnsupportedChainError,
  type BalanceOptions,
} from "./balance.ts";
import { type Chain, sameAddress } from "./chains.ts";
import { defined } from "./parts.ts";
import type { Puzzle } from "./puzzle.ts";
import { Balance } from "./types.ts";

/**
 * The `@agntn/explorers` provider behind each chain's balance and transaction history.
 * `Puzzle.balance()` and `watch()` import this module on first use, so the providers stay out of
 * the package's load path.
 */

type Explorer = (config: Readonly<ProviderConfig>) => Provider;

/**
 * The config without its key, for a provider the key doesn't belong to.
 *
 * @param {Readonly<ProviderConfig>} config - Provider configuration.
 * @returns {ProviderConfig} The same configuration without `apiKey`.
 */
function keyless(config: Readonly<ProviderConfig>): ProviderConfig {
  const { apiKey: _, ...rest } = config;
  return rest;
}

/**
 * Ethereum goes to Etherscan when the caller has a key for it and to Blockscout, which needs none,
 * when not. Blockscout gets the config without the key, so an Etherscan key never reaches it.
 *
 * @param {Readonly<ProviderConfig>} config - Provider configuration.
 * @returns {Provider} The provider for this lookup.
 */
function ethereumExplorer(config: Readonly<ProviderConfig>): Provider {
  return config.apiKey === undefined || config.apiKey.length === 0
    ? new Blockscout({ ...keyless(config), defaultChain: "ethereum" })
    : new Etherscan({ ...config, defaultChain: "ethereum" });
}

/**
 * Base reads Blockscout alone: Etherscan V2 keeps Base behind its paid plans, so a free Etherscan
 * key would only turn a working lookup into a refusal. The key stays out of the config here too.
 */
const explorers: Readonly<Record<Chain, Explorer | undefined>> = {
  arweave: (config) => new Arweave(config),
  base: (config) => new Blockscout({ ...keyless(config), defaultChain: "base" }),
  bitcoin: (config) => new Mempool(config),
  bitcoincash: (config) => new Blockchair(config),
  decred: (config) => new Dcrdata(config),
  dogecoin: (config) => new Blockchair(config),
  ecash: (config) => new Blockchair(config),
  ethereum: ethereumExplorer,
  litecoin: (config) => new Mempool(keyless(config)),
  monero: undefined,
};

/**
 * A second provider a chain falls back to once, when the first gets no answer through: a timeout,
 * a refused connection, a rate limit or a 5xx. Blockstream serves Bitcoin's Esplora from another
 * host, and Blockchair stands in for litecoinspace.org, which has gone dark more than once.
 */
const fallbacks: Readonly<Partial<Record<Chain, Explorer>>> = {
  bitcoin: (config) => new Blockstream(config),
  litecoin: (config) => new Blockchair(config),
};

/**
 * The fallback one lookup may use. A `baseUrl` names one endpoint, so it has none, and a fallback
 * that can't read keys would answer "no key" for a host that never answered.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {Lookup} lookup - What the read is.
 * @param {Readonly<ProviderConfig>} config - Provider configuration.
 * @returns {Explorer | undefined} The fallback, when the lookup has one.
 */
function fallbackFor(
  chain: Chain,
  lookup: Lookup,
  config: Readonly<ProviderConfig>,
): Explorer | undefined {
  const fallback = config.baseUrl === undefined ? fallbacks[chain] : undefined;
  return lookup === "Public key" && fallback?.(config).capabilities.pubkeys !== true
    ? undefined
    : fallback;
}

/**
 * The failures another host can get past. An answer that rejects the address or the data would
 * fail the same way there.
 *
 * @param {unknown} error - The first provider's failure.
 * @returns {boolean} Whether the fallback may try.
 */
function isTransient(error: unknown): boolean {
  return (
    error instanceof RateLimitError ||
    error instanceof TransportError ||
    (error instanceof HTTPError && error.statusCode >= 500)
  );
}

function baseUnits(value: string, label: string): bigint {
  if (!/^-?\d+$/.test(value)) {
    throw new BalanceProviderError(`Invalid ${label} base unit value`);
  }
  return BigInt(value);
}

/**
 * Providers report the confirmed balance and, when they can, a separate signed mempool delta.
 *
 * @param {Chain} chain - Chain the value belongs to.
 * @param {Readonly<Snapshot>} snapshot - Balance snapshot from the provider.
 * @returns {Balance} The confirmed and unconfirmed balance in base units.
 */
function toBalance(chain: Chain, snapshot: Readonly<Snapshot>): Balance {
  const confirmed = baseUnits(snapshot.balance, "balance");
  if (confirmed < 0n) {
    throw new BalanceProviderError("Balance provider returned a negative confirmed balance");
  }
  const unconfirmed =
    snapshot.unconfirmed === undefined ? 0n : baseUnits(snapshot.unconfirmed, "unconfirmed");
  return new Balance(chain, confirmed, unconfirmed);
}

function redact(message: string, apiKey: string | undefined): string {
  return apiKey === undefined || apiKey.length === 0
    ? message
    : message.replaceAll(apiKey, "REDACTED");
}

/** What one lookup reads, named in the message of its failure. */
type Lookup = "Balance" | "Public key" | "Transaction history";

/**
 * Maps provider failures onto the balance errors; the original error is dropped so a key never leaks through `cause`.
 * A 400 or 422 means a refused address only for a balance: a history query can fail that way on
 * its own, and Arweave's gateway answers 400 to a GraphQL query it no longer takes.
 *
 * @param {Lookup} lookup - What the failed lookup read.
 * @param {unknown} error - The thrown value.
 * @param {string} address - Address to describe.
 * @param {string | undefined} apiKey - Provider API key, when the chain needs one.
 * @param {unknown} first - The first provider's failure, when this one comes from the fallback.
 * @returns {BalanceError} The balance error that stands in for the provider failure.
 */
function translate(
  lookup: Lookup,
  error: unknown,
  address: string,
  apiKey: string | undefined,
  first?: unknown,
): BalanceError {
  if (error instanceof BalanceError) {
    return error;
  }
  if (
    error instanceof ChainAddressError ||
    (lookup === "Balance" && error instanceof HTTPError && [400, 422].includes(error.statusCode))
  ) {
    return new InvalidAddressError(`Invalid address: ${address}`);
  }
  const failures = first === undefined ? [error] : [first, error];
  const message = failures
    .map((failure) => (failure instanceof Error ? failure.message : String(failure)))
    .join("; then ");
  return new BalanceProviderError(`${lookup} lookup failed: ${redact(message, apiKey)}`);
}

/** How long a primary that missed a read waits behind its fallback, about one long pass. */
const BENCH_MS = 10 * 60 * 1000;

/** When each chain's primary goes first again, set while its fallback answers in its place. */
const benched = new Map<Chain, number>();

/** Forgets every primary waiting behind its fallback, so the next read asks it first again. */
export function forgetFailedHosts(): void {
  benched.clear();
}

/**
 * Asks both hosts, a benched primary last. Missing a read benches it, answering frees it, and any
 * failure of a fallback that went first sends the read back to the primary.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {Readonly<[Explorer, Explorer]>} hosts - The chain's primary, then its fallback.
 * @param {(open: Explorer) => Promise<T>} read - The read itself, given the provider to open.
 * @param {(error: unknown, first?: unknown) => BalanceError} fail - Turns a failure into its error.
 * @returns {Promise<T>} What the first host to answer returned.
 */
async function inTurn<T>(
  chain: Chain,
  [primary, fallback]: Readonly<[Explorer, Explorer]>,
  read: (open: Explorer) => Promise<T>,
  fail: (error: unknown, first?: unknown) => BalanceError,
): Promise<T> {
  const primaryFirst = (benched.get(chain) ?? 0) <= Date.now();
  const [first, second] = primaryFirst ? [primary, fallback] : [fallback, primary];
  try {
    return await read(first);
  } catch (error) {
    if (primaryFirst && !isTransient(error)) {
      throw fail(error);
    }
    try {
      const value = await read(second);
      if (primaryFirst) {
        benched.set(chain, Date.now() + BENCH_MS);
      } else {
        benched.delete(chain);
      }
      return value;
    } catch (failure) {
      throw fail(failure, error);
    }
  }
}

/**
 * Reads one address through the chain's provider, and once through its fallback when that provider
 * gets no answer through.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {Lookup} lookup - What the read is, for the message of its failure.
 * @param {string} address - Address to read.
 * @param {Readonly<ProviderConfig>} config - Provider configuration.
 * @param {(open: Explorer) => Promise<T>} read - The read itself, given the provider to open.
 * @returns {Promise<T>} What the read returned.
 */
async function ask<T>(
  chain: Chain,
  lookup: Lookup,
  address: string,
  config: Readonly<ProviderConfig>,
  read: (open: Explorer) => Promise<T>,
): Promise<T> {
  const explorer = explorers[chain];
  if (explorer === undefined) {
    throw new UnsupportedChainError(`Unsupported ${lookup.toLowerCase()} chain: ${chain}`);
  }
  const fail = (error: unknown, first?: unknown) =>
    translate(lookup, error, address, config.apiKey, first);
  const fallback = fallbackFor(chain, lookup, config);
  if (fallback !== undefined) {
    return inTurn(chain, [explorer, fallback], read, fail);
  }
  try {
    return await read(explorer);
  } catch (error) {
    throw fail(error);
  }
}

/**
 * The provider config a lookup's options name.
 *
 * @param {BalanceOptions} options - Lookup options.
 * @returns {ProviderConfig} The config every provider of the lookup gets.
 */
function configOf(options: BalanceOptions): ProviderConfig {
  return defined<ProviderConfig>({
    apiKey: options.apiKey,
    baseUrl: options.baseUrl,
    timeout: options.timeout,
  });
}

/**
 * The addresses that hold a puzzle's prize: the target, and the escrow when the prize waits in one.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {string[]} The target address, then the escrow's.
 */
export function prizeAddresses(puzzle: Puzzle): string[] {
  const escrow = puzzle.escrow();
  return escrow === undefined ? [puzzle.address().value] : [puzzle.address().value, escrow.value];
}

/** What one address holds and has moved, as its chain's explorer read it. */
export interface AddressState {
  /** The address read. */
  readonly address: string;

  /** Confirmed balance in base units. */
  readonly confirmed: bigint;

  /** Everything the address ever received, in base units, when the explorer counts it. */
  readonly funded?: bigint;

  /** The `@agntn/explorers` provider that answered, a fallback too when it stood in. */
  readonly provider: string;

  /** When the provider completed the read, as ISO 8601. */
  readonly readAt: string;

  /** Everything the address ever spent, in base units, when the explorer counts it. */
  readonly spent?: bigint;

  /** Signed mempool delta in base units, zero when the explorer reports none. */
  readonly unconfirmed: bigint;
}

/**
 * A lifetime total, left unknown when unreadable, because a balance doesn't need it.
 *
 * @param {string | undefined} value - The total in base units, as the explorer wrote it.
 * @returns {bigint | undefined} The total, when it reads as a non-negative integer.
 */
function total(value: string | undefined): bigint | undefined {
  return value !== undefined && /^\d+$/u.test(value) ? BigInt(value) : undefined;
}

/**
 * Reads one address: its balance, and the lifetime totals no history page cap cuts short.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {string} address - Address to read.
 * @param {BalanceOptions} options - Lookup options.
 * @returns {Promise<AddressState>} What the address holds and has moved.
 */
export async function lookupAddress(
  chain: Chain,
  address: string,
  options: BalanceOptions,
): Promise<AddressState> {
  const config = configOf(options);
  return ask(chain, "Balance", address, config, async (open) => {
    const provider = open(config);
    const snapshot = await provider.getBalance(address, chain);
    const { confirmed, unconfirmed } = toBalance(chain, snapshot);
    return defined<AddressState>({
      address,
      confirmed,
      funded: total(snapshot.funded),
      provider: provider.name,
      readAt: snapshot.fetchedAt,
      spent: total(snapshot.spent),
      unconfirmed,
    });
  });
}

/**
 * Fetches a puzzle's native token balance through the provider registered for its chain. A puzzle
 * with an escrow gets the sum of both addresses, and a failure of either fails the lookup, since
 * half of the prize is not the prize.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {BalanceOptions} options - Lookup options.
 * @returns {Promise<Balance>} The puzzle's native token balance.
 */
export async function lookupBalance(puzzle: Puzzle, options: BalanceOptions): Promise<Balance> {
  const chain = puzzle.chain();
  const states = await Promise.all(
    prizeAddresses(puzzle).map((address) => lookupAddress(chain, address, options)),
  );
  return states.reduce(
    (sum, state) =>
      new Balance(chain, sum.confirmed + state.confirmed, sum.unconfirmed + state.unconfirmed),
    new Balance(chain, 0n, 0n),
  );
}

/** Which way a transaction moved coins, seen from the puzzle address. */
export type Direction = "in" | "out";

/** One transaction on a puzzle address, as its chain's explorer lists it. */
export interface ChainTransaction {
  /** The address of the puzzle it touched: the target, or the escrow. */
  readonly address: string;

  /** Base units moved to or from that address, zero when the transaction reverted. */
  readonly amount: bigint;

  /** When it confirmed, as ISO 8601; absent while it waits in the mempool. */
  readonly date?: string;

  /** `in` for a deposit, `out` for a spend, absent when the explorer can't tell. */
  readonly direction?: Direction;

  /** Whether it's still unconfirmed. */
  readonly pending: boolean;

  /** Transaction identifier. */
  readonly txid: string;
}

/** The fields of an explorer's transaction that a watch reads. */
type Listed = Readonly<
  Pick<ExplorerTransaction, "from" | "hash" | "status" | "timestamp" | "to" | "value">
>;

/**
 * The address's view of an explorer's transaction. Blockchair names neither side by the address,
 * so its direction can stay unknown.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {string} address - The address the history was read for.
 * @param {Listed} transaction - The explorer's transaction.
 * @returns {ChainTransaction} The transaction as the address sees it.
 */
function toChainTransaction(chain: Chain, address: string, transaction: Listed): ChainTransaction {
  const direction: Direction | undefined = sameAddress(chain, transaction.from, address)
    ? "out"
    : transaction.to !== null && sameAddress(chain, transaction.to, address)
      ? "in"
      : undefined;
  const pending = transaction.status === "pending";
  return defined<ChainTransaction>({
    address,
    amount: transaction.status === "failed" ? 0n : baseUnits(transaction.value, "transaction"),
    date: pending ? undefined : transaction.timestamp,
    direction,
    pending,
    txid: transaction.hash,
  });
}

/** One prize address's transactions, and whether they are all of them. */
export interface AddressHistory {
  /** The address read. */
  readonly address: string;

  /** Whether a short page ended the read, so no older transaction went unread. */
  readonly complete: boolean;

  /** Why a page after the first failed, when one did; the pages before it still count. */
  readonly failure?: string;

  /** Its transactions, newest first. */
  readonly transactions: ChainTransaction[];
}

/**
 * Reads one address a page at a time until a short page or `HISTORY_LIMIT`. A txid seen twice
 * counts once, and only a failed first page fails the read.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {string} address - Address to read.
 * @param {Readonly<ProviderConfig>} config - Provider configuration.
 * @returns {Promise<AddressHistory>} The transactions read and whether that was all of them.
 */
async function readHistory(
  chain: Chain,
  address: string,
  config: Readonly<ProviderConfig>,
): Promise<AddressHistory> {
  const transactions = new Map<string, ChainTransaction>();
  const read = (complete: boolean, failure?: string): AddressHistory =>
    defined<AddressHistory>({
      address,
      complete,
      failure,
      transactions: [...transactions.values()],
    });
  for (let page = 1; page * HISTORY_PAGE <= HISTORY_LIMIT; page += 1) {
    let rows: ExplorerTransaction[];
    try {
      rows = await ask(chain, "Transaction history", address, config, async (open) =>
        open(config).getTxHistory(address, chain, { limit: HISTORY_PAGE, page }),
      );
    } catch (error) {
      if (page === 1 || !(error instanceof BalanceError)) {
        throw error;
      }
      return read(
        false,
        `${error.message}, past the newest ${transactions.size} transactions at ${address}`,
      );
    }
    for (const row of rows) {
      const transaction = toChainTransaction(chain, address, row);
      if (!transactions.has(transaction.txid)) {
        transactions.set(transaction.txid, transaction);
      }
    }
    if (rows.length < HISTORY_PAGE) {
      return read(true);
    }
  }
  return read(false);
}

/**
 * Reads the transactions of a puzzle's target address, and of its escrow when it has one, up to
 * `HISTORY_LIMIT` per address, newest first.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {BalanceOptions} options - Lookup options.
 * @returns {Promise<AddressHistory[]>} The history of every prize address.
 */
export async function lookupHistory(
  puzzle: Puzzle,
  options: BalanceOptions,
): Promise<AddressHistory[]> {
  const chain = puzzle.chain();
  const config = configOf(options);
  return Promise.all(prizeAddresses(puzzle).map((address) => readHistory(chain, address, config)));
}

/** A public key an address gave away by spending, and the spend that showed it. */
export interface PubkeySighting {
  /** The key in hex, compressed or uncompressed as the spend wrote it. */
  readonly pubkey: string;

  /** The spend that showed it. */
  readonly txid: string;
}

/**
 * The key a spend from the address showed; a taproot output key is the address, not a reveal.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {string} address - Address to read.
 * @param {BalanceOptions} options - Lookup options.
 * @returns {Promise<PubkeySighting | undefined>} The key and its spend, when a spend showed one.
 */
export async function lookupPubkey(
  chain: Chain,
  address: string,
  options: BalanceOptions,
): Promise<PubkeySighting | undefined> {
  const config = configOf(options);
  return ask(chain, "Public key", address, config, async (open) => {
    const provider = open(config);
    if (!provider.capabilities.pubkeys || provider.getPubkey === undefined) {
      return undefined;
    }
    const { pubkey, source, txid } = await provider.getPubkey(address, chain);
    return source === "spend" && pubkey !== null && txid !== null ? { pubkey, txid } : undefined;
  });
}

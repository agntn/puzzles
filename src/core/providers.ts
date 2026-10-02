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
  litecoin: (config) => new Mempool(config),
  monero: undefined,
};

/**
 * A second provider a chain falls back to once, when the first one gets no answer through: a
 * timeout, a refused connection, a rate limit or a 5xx. mempool.space drops some Bitcoin lookups of
 * a long pass, and Blockstream reads the same Esplora data from another host.
 */
const fallbacks: Readonly<Partial<Record<Chain, Explorer>>> = {
  bitcoin: (config) => new Blockstream(config),
};

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
type Lookup = "Balance" | "Transaction history";

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

/**
 * Reads one address through the chain's provider, and once through its fallback when that provider
 * gets no answer through. A `baseUrl` names one endpoint, so it has no fallback.
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
  try {
    return await read(explorer);
  } catch (error) {
    const fallback = fallbacks[chain];
    if (fallback === undefined || config.baseUrl !== undefined || !isTransient(error)) {
      throw translate(lookup, error, address, config.apiKey);
    }
    try {
      return await read(fallback);
    } catch (second) {
      throw translate(lookup, second, address, config.apiKey, error);
    }
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
function prizeAddresses(puzzle: Puzzle): string[] {
  const escrow = puzzle.escrow();
  return escrow === undefined ? [puzzle.address().value] : [puzzle.address().value, escrow.value];
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
  const config = configOf(options);
  const balances = await Promise.all(
    prizeAddresses(puzzle).map((address) =>
      ask(chain, "Balance", address, config, async (open) =>
        toBalance(chain, await open(config).getBalance(address, chain)),
      ),
    ),
  );
  return balances.reduce(
    (sum, part) =>
      new Balance(chain, sum.confirmed + part.confirmed, sum.unconfirmed + part.unconfirmed),
  );
}

/** Which way a transaction moved coins, seen from the puzzle address. */
export type Direction = "in" | "out";

/** One transaction on a puzzle address, as its chain's explorer lists it. */
export interface ChainTransaction {
  /** The address of the puzzle it touched: the target, or the escrow. */
  readonly address: string;

  /** Base units moved to or from that address, as the explorer counts them. */
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
    amount: baseUnits(transaction.value, "transaction"),
    date: pending ? undefined : transaction.timestamp,
    direction,
    pending,
    txid: transaction.hash,
  });
}

/**
 * Reads the newest transactions of a puzzle's target address, and of its escrow when it has one,
 * up to `HISTORY_LIMIT` per address, newest first.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {BalanceOptions} options - Lookup options.
 * @returns {Promise<ChainTransaction[]>} The transactions of every prize address.
 */
export async function lookupHistory(
  puzzle: Puzzle,
  options: BalanceOptions,
): Promise<ChainTransaction[]> {
  const chain = puzzle.chain();
  const config = configOf(options);
  const histories = await Promise.all(
    prizeAddresses(puzzle).map((address) =>
      ask(chain, "Transaction history", address, config, async (open) =>
        (await open(config).getTxHistory(address, chain, { limit: HISTORY_LIMIT })).map(
          (transaction) => toChainTransaction(chain, address, transaction),
        ),
      ),
    ),
  );
  return histories.flat();
}

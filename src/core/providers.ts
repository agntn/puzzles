import { InvalidAddressError as ChainAddressError } from "@agntn/chains";
import {
  type Balance as Snapshot,
  HTTPError,
  type ProviderConfig,
  RateLimitError,
  TransportError,
} from "@agntn/explorers";
import { Arweave } from "@agntn/explorers/providers/arweave";
import { Blockchair } from "@agntn/explorers/providers/blockchair";
import { Blockstream } from "@agntn/explorers/providers/blockstream";
import { Dcrdata } from "@agntn/explorers/providers/dcrdata";
import { Etherscan } from "@agntn/explorers/providers/etherscan";
import { Mempool } from "@agntn/explorers/providers/mempool";
import {
  BalanceError,
  BalanceProviderError,
  InvalidAddressError,
  UnsupportedChainError,
  type BalanceOptions,
} from "./balance.ts";
import { Chain } from "./chains.ts";
import { defined } from "./parts.ts";
import type { Puzzle } from "./puzzle.ts";
import { Balance } from "./types.ts";

/**
 * The `@agntn/explorers` provider behind each chain's balance. `Puzzle.balance()` imports this
 * module on first use, so the providers stay out of the package's load path.
 */

type Lookup = (address: string, config: Readonly<ProviderConfig>) => Promise<Snapshot>;

const lookups: Readonly<Record<Exclude<Chain, typeof Chain.Monero>, Lookup>> = {
  arweave: (address, config) => new Arweave(config).getBalance(address, "arweave"),
  bitcoin: (address, config) => new Mempool(config).getBalance(address, "bitcoin"),
  bitcoincash: (address, config) => new Blockchair(config).getBalance(address, "bitcoincash"),
  decred: (address, config) => new Dcrdata(config).getBalance(address, "decred"),
  ethereum: (address, config) =>
    new Etherscan({ ...config, defaultChain: "ethereum" }).getBalance(address, "ethereum"),
  litecoin: (address, config) => new Mempool(config).getBalance(address, "litecoin"),
};

/**
 * A second provider a chain falls back to once, when the first one gets no answer through: a
 * timeout, a refused connection, a rate limit or a 5xx. mempool.space drops some Bitcoin lookups of
 * a long pass, and Blockstream reads the same Esplora data from another host.
 */
const fallbacks: Readonly<Partial<Record<Chain, Lookup>>> = {
  bitcoin: (address, config) => new Blockstream(config).getBalance(address, "bitcoin"),
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

/**
 * Maps provider failures onto the balance errors; the original error is dropped so a key never leaks through `cause`.
 *
 * @param {unknown} error - The thrown value.
 * @param {string} address - Address to describe.
 * @param {string | undefined} apiKey - Provider API key, when the chain needs one.
 * @param {unknown} first - The first provider's failure, when this one comes from the fallback.
 * @returns {BalanceError} The balance error that stands in for the provider failure.
 */
function translate(
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
    (error instanceof HTTPError && [400, 422].includes(error.statusCode))
  ) {
    return new InvalidAddressError(`Invalid address: ${address}`);
  }
  const failures = first === undefined ? [error] : [first, error];
  const message = failures
    .map((failure) => (failure instanceof Error ? failure.message : String(failure)))
    .join("; then ");
  return new BalanceProviderError(`Balance lookup failed: ${redact(message, apiKey)}`);
}

/**
 * Asks the chain's fallback after the first provider failed, when the failure lets it: a `baseUrl`
 * names one endpoint, so it has no fallback.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {string} address - Address to look up.
 * @param {Readonly<ProviderConfig>} config - Provider configuration.
 * @param {unknown} error - The first provider's failure.
 * @returns {Promise<Balance>} The balance from the fallback.
 */
async function fallBack(
  chain: Chain,
  address: string,
  config: Readonly<ProviderConfig>,
  error: unknown,
): Promise<Balance> {
  const fallback = fallbacks[chain];
  if (fallback === undefined || config.baseUrl !== undefined || !isTransient(error)) {
    throw translate(error, address, config.apiKey);
  }
  try {
    return toBalance(chain, await fallback(address, config));
  } catch (second) {
    throw translate(second, address, config.apiKey, error);
  }
}

/**
 * Fetches a puzzle's native token balance through the provider registered for its chain, and once
 * through its fallback when that provider gets no answer through.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {BalanceOptions} options - Lookup options.
 * @returns {Promise<Balance>} The puzzle's native token balance.
 */
export async function lookupBalance(puzzle: Puzzle, options: BalanceOptions): Promise<Balance> {
  const chain = puzzle.chain();
  if (chain === Chain.Monero) {
    throw new UnsupportedChainError(`Unsupported balance chain: ${chain}`);
  }
  if (chain === Chain.Ethereum && (options.apiKey === undefined || options.apiKey.length === 0)) {
    throw new BalanceProviderError("Ethereum balance lookup requires an Etherscan API key");
  }
  const address = puzzle.address().value;
  const config = defined<ProviderConfig>({
    apiKey: options.apiKey,
    baseUrl: options.baseUrl,
    timeout: options.timeout,
  });
  try {
    return toBalance(chain, await lookups[chain](address, config));
  } catch (error) {
    return fallBack(chain, address, config, error);
  }
}

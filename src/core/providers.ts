import { InvalidAddressError as ChainAddressError } from "@agntn/chains";
import { type Balance as Snapshot, HTTPError, type ProviderConfig } from "@agntn/explorers";
import { Arweave } from "@agntn/explorers/providers/arweave";
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
  decred: (address, config) => new Dcrdata(config).getBalance(address, "decred"),
  ethereum: (address, config) =>
    new Etherscan({ ...config, defaultChain: "ethereum" }).getBalance(address, "ethereum"),
  litecoin: (address, config) => new Mempool(config).getBalance(address, "litecoin"),
};

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
 * @returns {BalanceError} The balance error that stands in for the provider failure.
 */
function translate(error: unknown, address: string, apiKey: string | undefined): BalanceError {
  if (error instanceof BalanceError) {
    return error;
  }
  if (
    error instanceof ChainAddressError ||
    (error instanceof HTTPError && [400, 422].includes(error.statusCode))
  ) {
    return new InvalidAddressError(`Invalid address: ${address}`);
  }
  const message = error instanceof Error ? error.message : String(error);
  return new BalanceProviderError(`Balance lookup failed: ${redact(message, apiKey)}`);
}

/**
 * Fetches a puzzle's native token balance through the provider registered for its chain.
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
    throw translate(error, address, options.apiKey);
  }
}

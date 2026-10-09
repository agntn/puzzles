/** Options for an online balance lookup through `@agntn/explorers`. */
export interface BalanceOptions {
  /** API key for the chain's provider. On Ethereum it picks Etherscan over Blockscout. */
  readonly apiKey?: string | undefined;

  /** Overrides the provider's default base URL. */
  readonly baseUrl?: string | undefined;

  /** Request timeout in milliseconds; providers default to 15 seconds. */
  readonly timeout?: number | undefined;
}

import type { Chain } from "./chains.ts";
import { PuzzlesError } from "./errors.ts";

/**
 * The environment variable the CLI and the agent tools take a chain's provider key from when none
 * is passed. They read it themselves instead of leaving it to the provider, so the key travels as
 * `apiKey`, the one value every balance error redacts.
 */
export const apiKeyVariables: Readonly<Partial<Record<Chain, string>>> = Object.freeze({
  bitcoincash: "BLOCKCHAIR_API_KEY",
  dogecoin: "BLOCKCHAIR_API_KEY",
  ecash: "BLOCKCHAIR_API_KEY",
  ethereum: "ETHERSCAN_API_KEY",
  litecoin: "BLOCKCHAIR_API_KEY",
});

/** Transactions one history page holds, the page cap of `@agntn/explorers`. */
export const HISTORY_PAGE = 100;

/** Most transactions read per address: Esplora, Blockscout and Arweave page no further. */
export const HISTORY_LIMIT = 1000;

/** Base error for balance lookups. */
export class BalanceError extends PuzzlesError {
  override readonly name: string = "BalanceError";
}

/** Address rejected by a balance provider. */
export class InvalidAddressError extends BalanceError {
  override readonly name = "InvalidAddressError";
}

/** Chain without a balance provider. */
export class UnsupportedChainError extends BalanceError {
  override readonly name = "UnsupportedChainError";
}

/** Provider failed or returned an unexpected response. */
export class BalanceProviderError extends BalanceError {
  override readonly name = "BalanceProviderError";
}

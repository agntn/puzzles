/** Options for an online balance lookup through `@agntn/explorers`. */
export interface BalanceOptions {
  /** API key for providers that require one, such as Etherscan. */
  readonly apiKey?: string | undefined;

  /** Overrides the provider's default base URL. */
  readonly baseUrl?: string | undefined;

  /** Request timeout in milliseconds; providers default to 15 seconds. */
  readonly timeout?: number | undefined;
}

import { PuzzlesError } from "./errors.ts";

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

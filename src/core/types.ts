import { type Chain, chainDecimals } from "./chains.ts";

/** Immutable native token balance in base units. */
export class Balance {
  /** Confirmed base unit balance. */
  readonly confirmed: bigint;

  /** Chain whose native token is represented. */
  readonly chain: Chain;

  /** Number of decimal places in the native token, taken from the chain. */
  readonly decimals: number;

  /** Unconfirmed signed base unit balance. */
  readonly unconfirmed: bigint;

  /** Constructs a native token balance. */
  constructor(chain: Chain, confirmed: bigint, unconfirmed: bigint) {
    if (confirmed < 0n) {
      throw new RangeError("Confirmed balance must not be negative");
    }
    this.chain = chain;
    this.confirmed = confirmed;
    this.unconfirmed = unconfirmed;
    this.decimals = chainDecimals(chain);
    Object.freeze(this);
  }

  /**
   * Returns confirmed plus unconfirmed base units.
   *
   * @returns {bigint} Confirmed plus unconfirmed base units.
   */
  total(): bigint {
    return this.confirmed + this.unconfirmed;
  }

  /**
   * Returns the confirmed balance in whole native token units.
   *
   * @returns {number} The confirmed balance in whole native token units.
   */
  confirmedUnits(): number {
    return Number(this.confirmed) / 10 ** this.decimals;
  }

  /**
   * Returns the total balance in whole native token units.
   *
   * @returns {number} The total balance in whole native token units.
   */
  totalUnits(): number {
    return Number(this.total()) / 10 ** this.decimals;
  }
}

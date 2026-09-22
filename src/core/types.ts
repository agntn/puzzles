import { type Chain, chainDecimals } from "./chains.ts";

/**
 * Renders base units as an exact decimal string, because a chain with 18 decimal places
 * outruns a double: `Number(1n) / 1e18` prints `1e-18`, and a wei precise balance loses
 * its last digits.
 *
 * @param {bigint} units - Signed amount in base units.
 * @param {number} decimals - Base unit decimal places of the native token.
 * @returns {string} The amount in whole units, without an exponent.
 */
function formatUnits(units: bigint, decimals: number): string {
  const sign = units < 0n ? "-" : "";
  const digits = (units < 0n ? -units : units).toString().padStart(decimals + 1, "0");
  const whole = digits.slice(0, digits.length - decimals);
  const fraction = digits.slice(digits.length - decimals).replace(/0+$/u, "");
  return fraction === "" ? `${sign}${whole}` : `${sign}${whole}.${fraction}`;
}

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
   * Returns the confirmed balance in whole native token units. The double rounds a chain
   * with many decimal places; `confirmedAmount()` keeps every digit.
   *
   * @returns {number} The confirmed balance in whole native token units.
   */
  confirmedUnits(): number {
    return Number(this.confirmed) / 10 ** this.decimals;
  }

  /**
   * Returns the confirmed balance in whole native token units, exactly.
   *
   * @returns {string} The confirmed balance as a decimal string.
   */
  confirmedAmount(): string {
    return formatUnits(this.confirmed, this.decimals);
  }

  /**
   * Returns the total balance in whole native token units. The double rounds a chain with
   * many decimal places; `totalAmount()` keeps every digit.
   *
   * @returns {number} The total balance in whole native token units.
   */
  totalUnits(): number {
    return Number(this.total()) / 10 ** this.decimals;
  }

  /**
   * Returns the total balance in whole native token units, exactly.
   *
   * @returns {string} The total balance as a decimal string.
   */
  totalAmount(): string {
    return formatUnits(this.total(), this.decimals);
  }
}

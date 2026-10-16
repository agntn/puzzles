let amounts: Intl.NumberFormat | undefined;

/**
 * Writes an amount as a plain decimal, since `String(1e-8)` is `1e-8`. The formatter is built on
 * first use, because the first `Intl` formatter in a process loads ICU data, and importing the
 * package or printing `--help` formats no amount.
 *
 * @param {number} amount - The amount to write.
 * @returns {string} Every digit of the amount, without an exponent or grouping.
 */
export function decimal(amount: number): string {
  amounts ??= new Intl.NumberFormat("en-US", { maximumFractionDigits: 20, useGrouping: false });
  return amounts.format(amount);
}

/** An exact decimal: integer units and how many of their digits sit after the point. */
interface ExactSum {
  readonly units: bigint;
  readonly places: number;
}

/**
 * Adds an amount to an exact decimal sum.
 *
 * @param {ExactSum} sum - The sum so far.
 * @param {number} amount - The amount to add.
 * @returns {ExactSum} The new sum.
 */
function addExact(sum: ExactSum, amount: number): ExactSum {
  const [whole = "0", fraction = ""] = decimal(amount).split(".");
  const places = Math.max(sum.places, fraction.length);
  const units =
    sum.units * 10n ** BigInt(places - sum.places) + BigInt(whole + fraction.padEnd(places, "0"));
  return { units, places };
}

/**
 * Adds amounts digit by digit and rounds once, so `0.1` and `0.2` make `0.3`.
 *
 * @param {readonly number[]} values - The amounts to add.
 * @returns {number} The closest `number` to the exact sum.
 */
export function exactSum(values: readonly number[]): number {
  const sum = values.reduce(addExact, { units: 0n, places: 0 });
  return Number(`${sum.units}e-${sum.places}`);
}

import { type Chain, chainDecimals, chainSymbol } from "./chains.ts";

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

/**
 * Renders base units as an exact decimal string, because a chain with 18 decimal places
 * outruns a double: `Number(1n) / 1e18` prints `1e-18`, and a wei precise balance loses
 * its last digits.
 *
 * @param {bigint} units - Signed amount in base units.
 * @param {number} decimals - Base unit decimal places of the native token.
 * @returns {string} The amount in whole units, without an exponent.
 */
export function formatUnits(units: bigint, decimals: number): string {
  const sign = units < 0n ? "-" : "";
  const digits = (units < 0n ? -units : units).toString().padStart(decimals + 1, "0");
  const whole = digits.slice(0, digits.length - decimals);
  const fraction = digits.slice(digits.length - decimals).replace(/0+$/u, "");
  return fraction === "" ? `${sign}${whole}` : `${sign}${whole}.${fraction}`;
}

/**
 * An amount with the chain's coin, every digit kept.
 *
 * @param {bigint} units - Base units.
 * @param {Chain} chain - Chain whose coin they count.
 * @returns {string} Such as `0.00000371 BTC`.
 */
export function coinAmount(units: bigint, chain: Chain): string {
  return `${formatUnits(units, chainDecimals(chain))} ${chainSymbol(chain)}`;
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

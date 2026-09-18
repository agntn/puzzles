import type { CollectionSummary } from "./dataset.ts";
import { InvalidArgumentError } from "./errors.ts";
import { type Puzzle, Status } from "./puzzle.ts";

/**
 * Serializes a value as JSON, rendering `bigint` balances as decimal strings.
 *
 * @param {unknown} value - Value to serialize.
 * @param {unknown} [compact] - Whether to omit indentation.
 * @returns {string} JSON text.
 */
export function toJson(value: unknown, compact = false): string {
  return JSON.stringify(
    value,
    (_key, item: unknown) => (typeof item === "bigint" ? item.toString() : item),
    compact ? undefined : 2,
  );
}

/**
 * Formats a prize for display: `0.001 BTC`, or a dash when none is recorded.
 *
 * @param {number | undefined} prize - The prize amount, when the record has one.
 * @param {string} currency - The prize currency.
 * @returns {string} The amount and currency, or `-`.
 */
export function formatPrize(prize: number | undefined, currency: string): string {
  return prize === undefined ? "-" : `${prize} ${currency}`;
}

/**
 * Sums prizes per currency, rounded to the eight places every chain here settles in, so a
 * float carry never prints as `1058.0688491299998`.
 *
 * @param {readonly Puzzle[]} puzzles - The puzzles to sum over.
 * @returns {Record<string, number>} Amounts per currency, in first-seen order.
 */
export function prizeTotals(puzzles: readonly Puzzle[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const puzzle of puzzles) {
    const prize = puzzle.prize();
    if (prize === undefined) continue;
    const currency = puzzle.prizeCurrency();
    totals[currency] = Number(((totals[currency] ?? 0) + prize).toFixed(8));
  }
  return totals;
}

/**
 * Formats per currency totals: `1008.52911 BTC` or `1000 AR, 1 ETH`, a dash when empty.
 *
 * @param {Readonly<Record<string, number>>} totals - Amounts per currency.
 * @returns {string} The amounts joined for display.
 */
export function formatPrizeTotals(totals: Readonly<Record<string, number>>): string {
  const entries = Object.entries(totals);
  return entries.length === 0
    ? "-"
    : entries.map(([currency, amount]) => `${amount} ${currency}`).join(", ");
}

/**
 * Formats a puzzle as one tab-separated summary line.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {string} Identifier, status, prize and address separated by tabs.
 */
export function formatPuzzle(puzzle: Puzzle): string {
  return `${puzzle.id()}\t${puzzle.status()}\t${formatPrize(puzzle.prize(), puzzle.prizeCurrency())}\t${puzzle.address().value}`;
}

/**
 * Formats a collection summary as the one discovery row the CLI and the tools share.
 *
 * @param {CollectionSummary} summary - The collection summary.
 * @returns {string} `key: N puzzles, N solved, N unsolved, by author`.
 */
export function formatCollection(summary: CollectionSummary): string {
  return `${summary.key}: ${summary.total} puzzles, ${summary.solved} solved, ${summary.unsolved} unsolved, by ${summary.author ?? "unknown"}`;
}

/**
 * Parses a puzzle status filter, throwing on an unknown value.
 *
 * @param {string | undefined} value - Status text from the command line, when given.
 * @returns {Status | undefined} The puzzle status filter.
 */
export function parseStatus(value: string | undefined): Status | undefined {
  if (value === undefined) {
    return undefined;
  }
  const status = Object.values(Status).find((item) => item === value);
  if (status === undefined) {
    throw new InvalidArgumentError("status", `expected one of ${Object.values(Status).join(", ")}`);
  }
  return status;
}

/**
 * Filters puzzles by optional status and public key constraints.
 *
 * @param {readonly Puzzle[]} puzzles - Puzzles to work on.
 * @param {{ readonly status?: Status | undefined; readonly withPubkey?: boolean | undefined }} options - Lookup options.
 * @returns {readonly Puzzle[]} The puzzles that pass every given constraint.
 */
export function filterPuzzles(
  puzzles: readonly Puzzle[],
  options: { readonly status?: Status | undefined; readonly withPubkey?: boolean | undefined },
): readonly Puzzle[] {
  return puzzles.filter(
    (puzzle) =>
      (options.status === undefined || puzzle.status() === options.status) &&
      (options.withPubkey !== true || puzzle.hasPubkey()),
  );
}

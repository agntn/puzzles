import type { AnyCollection, Hint } from "../../../src/index.ts";
import { prizeTotals } from "../../../src/core/utils.ts";

/** The facts strip of a collection page: numbers, strings and the hint records, safe for the Nuxt payload. */
export interface CollectionFactsData {
  readonly key: string;
  readonly author: string | undefined;
  readonly authorKey: string;
  readonly authorUrl: string | undefined;
  readonly total: number;
  readonly statuses: Readonly<Record<string, number>>;
  readonly chains: readonly string[];
  readonly prize: Readonly<Record<string, number>>;
  readonly unsolvedPrize: Readonly<Record<string, number>>;
  readonly withPubkey: number;
  readonly withKey: number;
  readonly firstStarted: string;
  readonly lastStarted: string;
  /** The hints every puzzle of the collection shares, in record order. */
  readonly hints: readonly Hint[];
}

/**
 * Reads the facts strip off a loaded collection.
 *
 * @param {AnyCollection} collection - The collection instance.
 * @returns {CollectionFactsData} Counts, chains, prize sums, the date range and the shared hints.
 */
export function collectionFacts(collection: AnyCollection): CollectionFactsData {
  const puzzles = collection.all();
  const statuses: Record<string, number> = {};
  for (const puzzle of puzzles) {
    statuses[puzzle.status()] = (statuses[puzzle.status()] ?? 0) + 1;
  }
  const started = puzzles.map((puzzle) => puzzle.startedAt()).sort();
  return {
    key: collection.key,
    author: collection.author.name,
    authorKey: collection.author.key ?? collection.key,
    authorUrl: collection.author.profiles?.[0]?.url,
    total: collection.count(),
    statuses,
    chains: [...new Set(puzzles.map((puzzle) => puzzle.chain()))],
    prize: prizeTotals(puzzles),
    unsolvedPrize: prizeTotals(collection.unsolved()),
    withPubkey: collection.withPubkey().length,
    withKey: puzzles.filter((puzzle) => puzzle.hasPrivateKey()).length,
    firstStarted: started[0] ?? "",
    lastStarted: started.at(-1) ?? "",
    hints: collection.hints,
  };
}

/**
 * `83 solved · 77 unsolved · 96 swept`, in the order the statuses appear.
 *
 * @param {Readonly<Record<string, number>>} statuses - Counts per status.
 * @returns {string} The counts joined for display.
 */
export function statusList(statuses: Readonly<Record<string, number>>): string {
  return Object.entries(statuses)
    .map(([status, count]) => `${count} ${status}`)
    .join(" · ");
}

import type { AnyCollection, Hint } from "../../../src/index.ts";
import { prizeTotals } from "../../../src/core/utils.ts";

/** The dossier of a collection page: numbers, strings and the hint records, safe for the Nuxt payload. */
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
 * Reads the collection dossier off a loaded collection.
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

/** One row of the collections index: what the library says, without the presentation. */
export interface CollectionRow {
  readonly key: string;
  readonly total: number;
  readonly open: number;
  readonly chains: readonly string[];
}

/**
 * The rows of the collections index, largest collection first, manifest order between equals.
 *
 * @param {readonly AnyCollection[]} collections - Every collection, in manifest order.
 * @returns {readonly CollectionRow[]} Key, puzzle count, unsolved count and chains per collection.
 */
export function collectionRows(collections: readonly AnyCollection[]): readonly CollectionRow[] {
  return collections
    .map((collection) => ({
      key: collection.key,
      total: collection.count(),
      open: collection.unsolved().length,
      chains: [...new Set(collection.all().map((puzzle) => puzzle.chain()))],
    }))
    .sort((left, right) => right.total - left.total);
}

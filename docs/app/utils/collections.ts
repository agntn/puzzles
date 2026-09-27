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

/** Which collections the index keeps by what is left to win: any, some puzzle open, or none. */
export type CollectionState = "" | "open" | "closed";

/** What the collections index narrows its rows to. Empty values keep every row. */
export interface CollectionFilter {
  readonly chain: string;
  readonly state: CollectionState;
  readonly text: string;
}

/** The filter with nothing picked, so the index shows every collection. */
export const NO_COLLECTION_FILTER: CollectionFilter = { chain: "", state: "", text: "" };

/** The longest search a link can carry; a longer `q` is cut, not rejected. */
export const FILTER_TEXT_MAX = 64;

/**
 * Whether a row is in the state the filter asks for.
 *
 * @param {CollectionRow} row - The row with its unsolved count.
 * @param {CollectionState} state - Any, open or closed.
 * @returns {boolean} `true` for any state, or when the unsolved count agrees with it.
 */
function inState(row: CollectionRow, state: CollectionState): boolean {
  if (state === "open") return row.open > 0;
  if (state === "closed") return row.open === 0;
  return true;
}

/**
 * Whether one row of the index passes the filter. Every word of the text has to appear, in any
 * case, in the key, the display title or the blurb.
 *
 * @param {CollectionRow & { title?: string; blurb?: string }} row - The row with its presentation.
 * @param {CollectionFilter} filter - The chain, the state and the search text.
 * @returns {boolean} `true` when the row stays in the index.
 */
export function matchesCollection(
  row: CollectionRow & { readonly title?: string; readonly blurb?: string },
  filter: CollectionFilter,
): boolean {
  if (filter.chain !== "" && !row.chains.includes(filter.chain)) return false;
  if (!inState(row, filter.state)) return false;
  const words = filter.text.toLowerCase().split(/\s+/u).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = [row.key, row.title ?? "", row.blurb ?? ""].join(" ").toLowerCase();
  return words.every((word) => haystack.includes(word));
}

/**
 * Reads the filter from a route query. A chain the index doesn't list, an unknown state and any
 * value of another type are ignored, so a stale link opens on the whole index instead of an empty one.
 *
 * @param {Readonly<Record<string, unknown>>} query - The route query.
 * @param {readonly string[]} chains - The chains the index lists.
 * @returns {CollectionFilter} The filter the link asks for.
 */
export function readCollectionFilter(
  query: Readonly<Record<string, unknown>>,
  chains: readonly string[],
): CollectionFilter {
  return {
    chain: typeof query.chain === "string" && chains.includes(query.chain) ? query.chain : "",
    state: query.state === "open" || query.state === "closed" ? query.state : "",
    text: typeof query.q === "string" ? query.q.slice(0, FILTER_TEXT_MAX) : "",
  };
}

/**
 * Writes the filter as a route query, leaving out what isn't picked.
 *
 * @param {CollectionFilter} filter - The filter on screen.
 * @returns {Record<string, string>} `chain`, `state` and `q`, each only when set.
 */
export function collectionFilterQuery(filter: CollectionFilter): Record<string, string> {
  const query: Record<string, string> = {};
  if (filter.chain !== "") query.chain = filter.chain;
  if (filter.state !== "") query.state = filter.state;
  const text = filter.text.trim();
  if (text !== "") query.q = text;
  return query;
}

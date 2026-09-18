import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";
import { version } from "../version.ts";
import { PuzzleNotFoundError } from "./errors.ts";
import { type Party } from "./parts.ts";
import { type Puzzle, type PuzzleData, Status } from "./puzzle.ts";
import { type AnyCollection, collections, getCollection, requireCollection } from "./registry.ts";
import { filterPuzzles, prizeTotals } from "./utils.ts";

/** Aggregate puzzle statistics. */
export interface Stats {
  readonly claimed: number;
  readonly expired: number;
  readonly solved: number;
  readonly swept: number;
  readonly total: number;
  readonly total_prize: Readonly<Record<string, number>>;
  readonly unsolved: number;
  readonly unsolved_prize: Readonly<Record<string, number>>;
  readonly with_pubkey: number;
}

/** One collection as it appears in a serialized dataset. */
export interface DatasetCollection {
  readonly author: Party;
  readonly name: string;
  readonly puzzles: readonly PuzzleData[];
}

/** Serializable snapshot of every registered collection. */
export interface Dataset {
  readonly collections: readonly DatasetCollection[];
  readonly data_version: string;
  readonly version: string;
}

/** One registered collection as every discovery surface lists it. */
export interface CollectionSummary {
  readonly author: string | undefined;
  readonly key: string;
  readonly solved: number;
  readonly total: number;
  readonly unsolved: number;
}

/** Optional constraints for selecting puzzles across the registry. */
export interface PuzzleQuery {
  readonly collection?: string | undefined;
  readonly status?: Status | undefined;
  readonly withPubkey?: boolean | undefined;
}

/** Views derived from one loaded registry snapshot; a new snapshot starts an empty record. */
interface DerivedViews {
  dataVersion?: string;
  puzzles?: readonly Puzzle[];
  serialized?: readonly DatasetCollection[];
  summaries?: readonly CollectionSummary[];
}

const derived = new WeakMap<readonly AnyCollection[], DerivedViews>();

async function views(): Promise<[readonly AnyCollection[], DerivedViews]> {
  const snapshot = await collections();
  let record = derived.get(snapshot);
  if (record === undefined) {
    record = {};
    derived.set(snapshot, record);
  }
  return [snapshot, record];
}

/**
 * Loads every collection and returns all puzzles in stable collection and class order.
 *
 * @returns {Promise<readonly Puzzle[]>} Every puzzle, in stable collection and class order.
 */
export async function all(): Promise<readonly Puzzle[]> {
  const [snapshot, record] = await views();
  record.puzzles ??= Object.freeze(snapshot.flatMap((collection) => collection.all()));
  return record.puzzles;
}

/**
 * Lists every registered collection with its author and status counts, in registration order.
 *
 * @returns {Promise<readonly CollectionSummary[]>} One summary per registered collection.
 */
export async function collectionSummaries(): Promise<readonly CollectionSummary[]> {
  const [snapshot, record] = await views();
  record.summaries ??= Object.freeze(
    snapshot.map((collection) => ({
      key: collection.key,
      author: collection.author.name,
      total: collection.count(),
      solved: collection.solvedCount(),
      unsolved: collection.unsolvedCount(),
    })),
  );
  return record.summaries;
}

/**
 * Selects puzzles, optionally narrowed to one collection, a status, or a known public key.
 *
 * @param {PuzzleQuery} [query] - Query in the collection's own terms.
 * @returns {Promise<readonly Puzzle[]>} The puzzles that satisfy the query.
 */
export async function selectPuzzles(query: PuzzleQuery = {}): Promise<readonly Puzzle[]> {
  const source =
    query.collection === undefined
      ? await all()
      : (await requireCollection(query.collection)).all();
  return filterPuzzles(source, query);
}

/**
 * Looks up a puzzle by its universal identifier, loading only its collection. A historical
 * alias in the collection segment resolves too, so `peter_todd/sha1` finds `hash_collision/sha1`.
 *
 * @param {string} id - Universal puzzle identifier.
 * @returns {Promise<Puzzle | undefined>} The puzzle, or `undefined` when no collection claims the identifier.
 */
export async function get(id: string): Promise<Puzzle | undefined> {
  const [prefix, ...rest] = id.split("/");
  const collection = await getCollection(prefix ?? id);
  if (collection === undefined) {
    return undefined;
  }
  const canonical = rest.length === 0 ? collection.key : `${collection.key}/${rest.join("/")}`;
  const puzzle = collection.get(canonical);
  return puzzle?.id() === canonical ? puzzle : undefined;
}

/**
 * Looks up a puzzle or throws a typed not found error.
 *
 * @param {string} id - Universal puzzle identifier.
 * @returns {Promise<Puzzle>} The puzzle.
 */
export async function requirePuzzle(id: string): Promise<Puzzle> {
  const puzzle = await get(id);
  if (puzzle === undefined) {
    throw new PuzzleNotFoundError(id);
  }
  return puzzle;
}

/**
 * Aggregate statistics over every registered collection.
 *
 * @returns {Promise<Stats>} Counts per status, the pubkey count and prize totals.
 */
export async function stats(): Promise<Stats> {
  const puzzles = await all();
  const counts: Record<Status, number> = {
    claimed: 0,
    expired: 0,
    solved: 0,
    swept: 0,
    unsolved: 0,
  };
  let withPubkey = 0;
  for (const puzzle of puzzles) {
    counts[puzzle.status()] += 1;
    withPubkey += Number(puzzle.hasPubkey());
  }
  return {
    total: puzzles.length,
    ...counts,
    with_pubkey: withPubkey,
    total_prize: prizeTotals(puzzles),
    unsolved_prize: prizeTotals(filterPuzzles(puzzles, { status: Status.Unsolved })),
  };
}

/**
 * Every collection as serializable data, in registration order.
 *
 * @returns {Promise<readonly DatasetCollection[]>} One serializable entry per collection.
 */
export async function datasetCollections(): Promise<readonly DatasetCollection[]> {
  const [snapshot, record] = await views();
  record.serialized ??= Object.freeze(
    snapshot.map((collection) => ({
      name: collection.key,
      author: collection.author,
      puzzles: collection.all().map((puzzle) => puzzle.toJSON()),
    })),
  );
  return record.serialized;
}

/**
 * A deterministic 12-character hash of the serialized puzzle data. It changes with the records and
 * nowhere else, so a consumer can cache a snapshot and compare it later without a build step.
 *
 * @returns {Promise<string>} The first 12 hex characters of SHA-256 over the serialized collections.
 */
export async function dataVersion(): Promise<string> {
  const [, record] = await views();
  record.dataVersion ??= bytesToHex(
    sha256(utf8ToBytes(JSON.stringify(await datasetCollections()))),
  ).slice(0, 12);
  return record.dataVersion;
}

/**
 * The complete serializable dataset envelope.
 *
 * @returns {Promise<Dataset>} `{ version, data_version, collections }`.
 */
export async function dataset(): Promise<Dataset> {
  return {
    version,
    data_version: await dataVersion(),
    collections: await datasetCollections(),
  };
}

import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";
import { version } from "../version.ts";
import type { Chain } from "./chains.ts";
import { PuzzleNotFoundError, UnknownAuthorError } from "./errors.ts";
import { defined, frozen, type Hint, type Party } from "./parts.ts";
import { type Puzzle, type PuzzleData, Status } from "./puzzle.ts";
import {
  type AnyCollection,
  collectionKeys,
  collections,
  getCollection,
  knownCollections,
  requireCollection,
} from "./registry.ts";
import { closestKey, closestPuzzle } from "./suggest.ts";
import { filterPuzzles, prizeTotals, statusCounts } from "./utils.ts";

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

/** One collection as it appears in a serialized dataset. Absent hints are omitted, never null. */
export interface DatasetCollection {
  readonly author: Party;
  readonly hints?: readonly Hint[];
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
  readonly claimed: number;
  readonly expired: number;
  readonly key: string;
  readonly solved: number;
  readonly swept: number;
  readonly total: number;
  readonly unsolved: number;
}

/** One author as the registry sees it: the record and the collections it published. */
export interface AuthorEntry {
  readonly author: Party;
  readonly collections: readonly string[];
  readonly key: string;
  readonly puzzles: number;
}

/** Optional constraints for selecting puzzles across the registry. */
export interface PuzzleQuery {
  readonly address?: string | undefined;
  readonly chain?: Chain | undefined;
  readonly collection?: string | undefined;
  readonly status?: Status | undefined;
  readonly withPubkey?: boolean | undefined;
}

/**
 * Views derived from one loaded registry snapshot; a new snapshot starts an empty record. Each
 * view is shared by every later caller, so it is frozen before it is kept.
 */
interface DerivedViews {
  authors?: readonly AuthorEntry[];
  dataVersion?: string;
  puzzles?: readonly Puzzle[];
  serialized?: readonly DatasetCollection[];
  stats?: Stats;
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
  record.summaries ??= frozen(
    snapshot.map((collection) => ({
      key: collection.key,
      author: collection.author.name,
      total: collection.count(),
      ...statusCounts(collection.all()),
    })),
  );
  return record.summaries;
}

/**
 * Every author in registration order, one entry per author key. A collection whose author has no
 * key of its own is listed under the collection's key, so every collection has an author page.
 *
 * @returns {Promise<readonly AuthorEntry[]>} One entry per author.
 */
export async function authors(): Promise<readonly AuthorEntry[]> {
  const [snapshot, record] = await views();
  if (record.authors === undefined) {
    const entries = new Map<string, { author: Party; collections: string[]; puzzles: number }>();
    for (const collection of snapshot) {
      const key = collection.author.key ?? collection.key;
      const entry = entries.get(key) ?? { author: collection.author, collections: [], puzzles: 0 };
      entry.collections.push(collection.key);
      entry.puzzles += collection.count();
      entries.set(key, entry);
    }
    record.authors = frozen([...entries].map(([key, entry]) => ({ key, ...entry })));
  }
  return record.authors;
}

/**
 * Looks an author up by key, loading every collection.
 *
 * @param {string} key - The author key, or a collection key for an author without one.
 * @returns {Promise<AuthorEntry | undefined>} The author, or `undefined` when no collection names it.
 */
export async function getAuthor(key: string): Promise<AuthorEntry | undefined> {
  if (typeof key !== "string") {
    return undefined;
  }
  return (await authors()).find((entry) => entry.key === key);
}

/**
 * Looks an author up or throws, naming the keys that do resolve.
 *
 * @param {string} key - The author key.
 * @returns {Promise<AuthorEntry>} The author.
 */
export async function requireAuthor(key: string): Promise<AuthorEntry> {
  const entry = await getAuthor(key);
  if (entry !== undefined) {
    return entry;
  }
  const keys = (await authors()).map((row) => row.key);
  const known = `Known authors: ${keys.join(", ")}`;
  const guess = typeof key === "string" ? closestKey(key, keys) : undefined;
  throw new UnknownAuthorError(
    String(key),
    guess === undefined ? known : `Did you mean ${guess}? ${known}`,
  );
}

/**
 * Selects puzzles, optionally narrowed to one collection, a target address, a chain, a status,
 * or a known public key.
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
  if (typeof id !== "string") {
    return undefined;
  }
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
 * Looks up a puzzle or throws a typed not found error. The error says what the identifier's
 * collection does hold, or which collections exist when the identifier named none, so a caller
 * that guessed wrong recovers without a second lookup. When one puzzle explains the miss, the
 * error names it first: `B1000/71` and `b100/71` mean `b1000/71`, and a bare `135` means the one
 * puzzle of that name, `b1000/135`.
 *
 * @param {string} id - Universal puzzle identifier.
 * @returns {Promise<Puzzle>} The puzzle.
 */
export async function requirePuzzle(id: string): Promise<Puzzle> {
  const puzzle = await get(id);
  if (puzzle !== undefined) {
    return puzzle;
  }
  if (typeof id !== "string") {
    throw new PuzzleNotFoundError(id, knownCollections());
  }
  const [prefix = id, ...rest] = id.split("/");
  const collection = await getCollection(prefix);
  if (collection !== undefined) {
    /* The collection exists and the identifier is not one of its own, so this throws its shape. */
    return collection.requireId(id);
  }
  const key = closestKey(prefix, collectionKeys());
  const guess =
    (await guessPuzzle(key, prefix, rest.join("/"))) ??
    (key === undefined ? undefined : `collection ${key}`);
  const known = knownCollections();
  throw new PuzzleNotFoundError(
    id,
    guess === undefined ? known : `Did you mean ${guess}? ${known}`,
  );
}

/**
 * The puzzle an identifier whose collection segment missed most likely meant. A segment one typo
 * or a case away from a collection key reads as that key, with the name matched inside it; a
 * segment with no name behind it may instead be a puzzle name, which counts when exactly one
 * collection holds it.
 *
 * @param {string | undefined} key - The collection key the segment most likely meant.
 * @param {string} prefix - The collection segment that missed.
 * @param {string} name - The rest of the identifier, empty when it had no slash.
 * @returns {Promise<string | undefined>} The identifier to suggest.
 */
async function guessPuzzle(
  key: string | undefined,
  prefix: string,
  name: string,
): Promise<string | undefined> {
  const collection = key === undefined ? undefined : await getCollection(key);
  if (collection === undefined) {
    return name === "" ? closestPuzzle(prefix, await all()) : undefined;
  }
  return guessInCollection(collection, name);
}

/**
 * The puzzle a name most likely meant once its collection is settled: the singleton itself when
 * the identifier had no name, else the name as written or with case and separators folded.
 *
 * @param {AnyCollection} collection - The collection the identifier most likely meant.
 * @param {string} name - The rest of the identifier, empty when it had no slash.
 * @returns {string | undefined} The identifier to suggest.
 */
function guessInCollection(collection: AnyCollection, name: string): string | undefined {
  const puzzles = collection.all();
  if (name === "") {
    return puzzles.length === 1 && puzzles[0]?.id() === collection.key ? collection.key : undefined;
  }
  const id = `${collection.key}/${name}`;
  return collection.get(id)?.id() === id ? id : closestPuzzle(name, puzzles);
}

/**
 * Frozen aggregate statistics, cached for each registry snapshot.
 *
 * @returns {Promise<Stats>} Counts per status, the pubkey count and prize totals.
 */
export async function stats(): Promise<Stats> {
  const [snapshot, record] = await views();
  if (record.stats !== undefined) {
    return record.stats;
  }
  record.puzzles ??= Object.freeze(snapshot.flatMap((collection) => collection.all()));
  const puzzles = record.puzzles;
  record.stats = frozen({
    total: puzzles.length,
    ...statusCounts(puzzles),
    with_pubkey: puzzles.filter((puzzle) => puzzle.hasPubkey()).length,
    total_prize: prizeTotals(puzzles),
    unsolved_prize: prizeTotals(filterPuzzles(puzzles, { status: Status.Unsolved })),
  });
  return record.stats;
}

/**
 * Every collection as serializable data, in registration order.
 *
 * @returns {Promise<readonly DatasetCollection[]>} One serializable entry per collection.
 */
export async function datasetCollections(): Promise<readonly DatasetCollection[]> {
  const [snapshot, record] = await views();
  record.serialized ??= serializeSnapshot(snapshot);
  return record.serialized;
}

function serializeSnapshot(snapshot: readonly AnyCollection[]): readonly DatasetCollection[] {
  return frozen(
    snapshot.map((collection) =>
      defined<DatasetCollection>({
        name: collection.key,
        author: collection.author,
        hints: collection.hints.length === 0 ? undefined : collection.hints,
        puzzles: collection.all().map((puzzle) => puzzle.toJSON()),
      }),
    ),
  );
}

/**
 * A deterministic 12-character hash of the serialized puzzle data. It changes with the records and
 * nowhere else, so a consumer can cache a snapshot and compare it later without a build step.
 *
 * @returns {Promise<string>} The first 12 hex characters of SHA-256 over the serialized collections.
 */
export async function dataVersion(): Promise<string> {
  const [snapshot, record] = await views();
  record.serialized ??= serializeSnapshot(snapshot);
  record.dataVersion ??= serializedVersion(record.serialized);
  return record.dataVersion;
}

function serializedVersion(serialized: readonly DatasetCollection[]): string {
  return bytesToHex(sha256(utf8ToBytes(JSON.stringify(serialized)))).slice(0, 12);
}

/**
 * The complete serializable dataset envelope, frozen over the memoized collections.
 *
 * @returns {Promise<Dataset>} `{ version, data_version, collections }`.
 */
export async function dataset(): Promise<Dataset> {
  const [snapshot, record] = await views();
  record.serialized ??= serializeSnapshot(snapshot);
  record.dataVersion ??= serializedVersion(record.serialized);
  return Object.freeze({
    version,
    data_version: record.dataVersion,
    collections: record.serialized,
  });
}

import { version } from "../version.ts";
import type { Chain } from "./chains.ts";
import { PuzzleNotFoundError, UnknownAuthorError, UnknownSolverError } from "./errors.ts";
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

/** One puzzle on a solver's record, with what the puzzle says about the solve. */
export interface SolveEntry {
  readonly chain: Chain;
  /** The prize's unit, the chain symbol unless the puzzle names another. */
  readonly currency: string;
  readonly id: string;
  readonly prize?: number;
  readonly solvedAt?: string;
  readonly status: Status;
}

/**
 * One solver as the registry sees it: the records of every puzzle credited to its key, joined into
 * one, and those puzzles in dataset order.
 */
export interface SolverEntry {
  /** Collections published by an author with the same key, the same party on the other side. */
  readonly authored: readonly string[];
  readonly collections: readonly string[];
  readonly key: string;
  readonly solver: Party;
  readonly solves: readonly SolveEntry[];
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
  solvers?: readonly SolverEntry[];
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
 * Both lists as one, each item once by its identity, in the order the lists give them.
 *
 * @param {readonly T[] | undefined} a - The first list.
 * @param {readonly T[] | undefined} b - The second list.
 * @param {(item: T) => string} id - What makes two items the same.
 * @returns {T[] | undefined} The union, or `undefined` when both are empty.
 */
function union<T>(
  a: readonly T[] | undefined,
  b: readonly T[] | undefined,
  id: (item: T) => string,
): T[] | undefined {
  const seen = new Map<string, T>();
  for (const item of [...(a ?? []), ...(b ?? [])]) {
    if (!seen.has(id(item))) seen.set(id(item), item);
  }
  return seen.size === 0 ? undefined : [...seen.values()];
}

/**
 * Joins two records of the same party. Scalars keep the first value a record states; lists keep
 * every item once, in the order the records give them.
 *
 * @param {Party} first - The record seen first, in dataset order.
 * @param {Party} next - A later record with the same key.
 * @returns {Party} One record with absent fields omitted.
 */
function joinParties(first: Party, next: Party): Party {
  return defined({
    key: first.key ?? next.key,
    kind: first.kind ?? next.kind,
    name: first.name ?? next.name,
    aliases: union(first.aliases, next.aliases, (alias) => alias),
    about: first.about ?? next.about,
    addresses: union(first.addresses, next.addresses, (address) => address),
    profiles: union(first.profiles, next.profiles, (link) => link.url),
    facts: union(first.facts, next.facts, (item) => `${item.source}\n${item.text}`),
  });
}

/**
 * Every named solver in dataset order of its first solve, one entry per solver key. A solver
 * record without a key, which is every solver known only by the address it swept to, has no entry.
 *
 * @returns {Promise<readonly SolverEntry[]>} One entry per solver key.
 */
export async function solvers(): Promise<readonly SolverEntry[]> {
  const [snapshot, record] = await views();
  if (record.solvers === undefined) {
    const entries = new Map<
      string,
      { solver: Party; solves: SolveEntry[]; collections: string[] }
    >();
    for (const collection of snapshot) {
      for (const puzzle of collection.all()) {
        const solver = puzzle.solver();
        if (solver?.key === undefined) continue;
        const entry = entries.get(solver.key);
        const solve: SolveEntry = defined({
          id: puzzle.id(),
          chain: puzzle.chain(),
          status: puzzle.status(),
          solvedAt: puzzle.solvedAt(),
          prize: puzzle.prize(),
          currency: puzzle.prizeCurrency(),
        });
        if (entry === undefined) {
          entries.set(solver.key, { solver, solves: [solve], collections: [collection.key] });
          continue;
        }
        entry.solver = joinParties(entry.solver, solver);
        entry.solves.push(solve);
        if (!entry.collections.includes(collection.key)) entry.collections.push(collection.key);
      }
    }
    record.solvers = frozen(
      [...entries].map(([key, entry]) => ({
        key,
        ...entry,
        authored: snapshot
          .filter((collection) => collection.author.key === key)
          .map((collection) => collection.key),
      })),
    );
  }
  return record.solvers;
}

/**
 * Looks a solver up by key, loading every collection.
 *
 * @param {string} key - The solver key.
 * @returns {Promise<SolverEntry | undefined>} The solver, or `undefined` when no puzzle credits it.
 */
export async function getSolver(key: string): Promise<SolverEntry | undefined> {
  if (typeof key !== "string") {
    return undefined;
  }
  return (await solvers()).find((entry) => entry.key === key);
}

/**
 * The solver key a lookup means: the key itself, or the key of the solver a puzzle identifier
 * credits. A puzzle whose solver has no key leaves the query as it is, so the miss names it.
 *
 * @param {string} query - A solver key or a puzzle identifier.
 * @returns {Promise<string>} The key to look up.
 */
export async function resolveSolverKey(query: string): Promise<string> {
  if ((await getSolver(query)) !== undefined) {
    return query;
  }
  return (await get(query))?.solver()?.key ?? query;
}

/**
 * Looks a solver up or throws, naming the keys that do resolve.
 *
 * @param {string} key - The solver key.
 * @returns {Promise<SolverEntry>} The solver.
 */
export async function requireSolver(key: string): Promise<SolverEntry> {
  const entry = await getSolver(key);
  if (entry !== undefined) {
    return entry;
  }
  const keys = (await solvers()).map((row) => row.key);
  const known = `Known solvers: ${keys.join(", ")}`;
  const puzzle = await get(key);
  if (puzzle !== undefined) {
    const what =
      puzzle.solver() === undefined ? "records no solver" : "knows its solver by address only";
    throw new UnknownSolverError(key, `${puzzle.id()} ${what}. ${known}`);
  }
  const guess = typeof key === "string" ? closestKey(key, keys) : undefined;
  throw new UnknownSolverError(
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
 * alias in the collection segment resolves too, so `peter_todd/sha1` finds `hash-collision/sha1`.
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
  record.dataVersion ??= await serializedVersion(record.serialized);
  return record.dataVersion;
}

/**
 * Web Crypto is global on Node 24, in browsers and in Workers, so the hash needs no dependency.
 *
 * @param {readonly DatasetCollection[]} serialized The collections `dataset()` serializes.
 * @returns {Promise<string>} The first 12 hex characters of their SHA-256.
 */
async function serializedVersion(serialized: readonly DatasetCollection[]): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(serialized));
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return Array.from(digest.subarray(0, 6), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * The complete serializable dataset envelope, frozen over the memoized collections.
 *
 * @returns {Promise<Dataset>} `{ version, data_version, collections }`.
 */
export async function dataset(): Promise<Dataset> {
  const [snapshot, record] = await views();
  record.serialized ??= serializeSnapshot(snapshot);
  record.dataVersion ??= await serializedVersion(record.serialized);
  return Object.freeze({
    version,
    data_version: record.dataVersion,
    collections: record.serialized,
  });
}

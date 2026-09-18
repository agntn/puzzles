import { builtins } from "../collections/index.ts";
import { type Collection } from "./collection.ts";
import { UnknownCollectionError } from "./errors.ts";

/** Any concrete collection, regardless of its query type. */
export type AnyCollection =
  | Collection<number | string>
  | Collection<string>
  | Collection<string | void>;

/** One collection the registry knows: its key plus a loader for the canonical instance. */
export interface CollectionEntry {
  readonly key: string;
  /** Resolves the instance; for a built-in that's a literal `import()` of its module. */
  readonly load: () => Promise<AnyCollection>;
}

interface TableEntry extends CollectionEntry {
  /** Present when the entry was registered with an instance, so registering it again is a no-op. */
  readonly instance?: AnyCollection;
}

const aliases: ReadonlyMap<string, string> = new Map([
  ["peter_todd", "hash_collision"],
  ["warpwallet", "warp"],
]);

let entries: Map<string, TableEntry> | undefined;
let snapshot: Promise<readonly AnyCollection[]> | undefined;

/**
 * The registry table, seeded from the built-in manifest on first use rather than at module scope,
 * so a consumer that never resolves a collection lets a bundler drop the table too.
 *
 * @returns {Map<string, TableEntry>} The seeded table.
 */
function table(): Map<string, TableEntry> {
  entries ??= new Map(builtins.map((entry): [string, TableEntry] => [entry.key, entry]));
  return entries;
}

function canonical(name: string): string {
  return aliases.get(name) ?? name;
}

function isEntry(value: AnyCollection | CollectionEntry): value is CollectionEntry {
  return "load" in value && typeof value.load === "function";
}

/**
 * Registers a collection under its stable key, or replaces what the key held. Built-ins are listed
 * already. This is the door for collections outside the package.
 *
 * @param {AnyCollection | CollectionEntry} collection - Collection instance or lazy entry.
 */
export function registerCollection(collection: AnyCollection | CollectionEntry): void {
  const entry: TableEntry = isEntry(collection)
    ? collection
    : { key: collection.key, instance: collection, load: () => Promise.resolve(collection) };
  if (entry.instance !== undefined && table().get(entry.key)?.instance === entry.instance) {
    return;
  }
  table().set(entry.key, entry);
  snapshot = undefined;
}

/**
 * Every registered collection key in registration order, without loading anything.
 *
 * @returns {readonly string[]} The keys, nothing loaded.
 */
export function collectionKeys(): readonly string[] {
  return [...table().keys()];
}

/**
 * Whether a collection key or historical alias resolves, without loading anything.
 *
 * @param {string} name - Collection key or historical alias.
 * @returns {boolean} `true` for a known key or alias.
 */
export function hasCollection(name: string): boolean {
  return table().has(canonical(name));
}

/**
 * Loads a collection by canonical key or historical alias. A built-in's module is imported on the
 * first call for its key, and parallel callers share that one import.
 *
 * @param {string} name - Collection key or historical alias.
 * @returns {Promise<AnyCollection | undefined>} The collection, or `undefined` when no entry has that key.
 */
export async function getCollection(name: string): Promise<AnyCollection | undefined> {
  const entry = table().get(canonical(name));
  return entry === undefined ? undefined : entry.load();
}

/**
 * Loads a collection or throws a typed error.
 *
 * @param {string} name - Collection key or historical alias.
 * @returns {Promise<AnyCollection>} The collection.
 */
export async function requireCollection(name: string): Promise<AnyCollection> {
  const collection = await getCollection(name);
  if (collection === undefined) {
    throw new UnknownCollectionError(name);
  }
  return collection;
}

/**
 * Loads every registered collection, in registration order. The frozen array is shared until the
 * next registration, so callers can memoize on it.
 *
 * @returns {Promise<readonly AnyCollection[]>} Every collection, loaded once and frozen.
 */
export async function collections(): Promise<readonly AnyCollection[]> {
  const pending = (snapshot ??= Promise.all(
    [...table().values()].map((entry) => entry.load()),
  ).then((loaded) => Object.freeze(loaded)));
  try {
    return await pending;
  } catch (error) {
    if (snapshot === pending) {
      snapshot = undefined;
    }
    throw error;
  }
}

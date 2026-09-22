import type { AnyCollection, AuthorEntry, Fact, Profile } from "../../../src/index.ts";
import { prizeTotals } from "../../../src/core/utils.ts";

/** One collection row on an author page. */
export interface AuthorCollectionRow {
  readonly key: string;
  readonly to: string;
  readonly title: string;
  readonly total: number;
  readonly unsolved: number;
  readonly chains: readonly string[];
  readonly firstStarted: string;
}

/** Everything an author page shows, as plain data for the Nuxt payload. */
export interface AuthorFactsData {
  readonly key: string;
  readonly name: string | undefined;
  readonly kind: string | undefined;
  readonly about: string | undefined;
  readonly aliases: readonly string[];
  readonly profiles: readonly Profile[];
  readonly addresses: readonly string[];
  readonly facts: readonly Fact[];
  readonly collections: readonly AuthorCollectionRow[];
  readonly puzzles: number;
  readonly unsolved: number;
  readonly chains: readonly string[];
  readonly prize: Readonly<Record<string, number>>;
  readonly unsolvedPrize: Readonly<Record<string, number>>;
  /** One status per puzzle, in collection order, for the tick strip. */
  readonly ticks: readonly string[];
  readonly firstStarted: string;
  readonly lastStarted: string;
  /** Position among every author, one based, for the file number on the page. */
  readonly position: number;
  readonly total: number;
}

/**
 * Reads an author page off the author entry and its loaded collections.
 *
 * @param {AuthorEntry} entry - The author as the registry lists it.
 * @param {readonly AnyCollection[]} collections - The instances of `entry.collections`, in that order.
 * @param {readonly AuthorEntry[]} [roster] - Every author, for the position of this one.
 * @param {(key: string) => string} [title] - The display title of a collection key.
 * @returns {AuthorFactsData} The record, one row per collection and the totals across them.
 */
export function authorFacts(
  entry: AuthorEntry,
  collections: readonly AnyCollection[],
  roster: readonly AuthorEntry[] = [entry],
  title: (key: string) => string = (key) => key,
): AuthorFactsData {
  const puzzles = collections.flatMap((collection) => collection.all());
  const unsolved = collections.flatMap((collection) => collection.unsolved());
  const started = puzzles.map((puzzle) => puzzle.startedAt()).sort();
  return {
    key: entry.key,
    name: entry.author.name,
    kind: entry.author.kind,
    about: entry.author.about,
    aliases: entry.author.aliases ?? [],
    profiles: entry.author.profiles ?? [],
    addresses: entry.author.addresses ?? [],
    facts: entry.author.facts ?? [],
    collections: collections.map((collection) => {
      const started = collection
        .all()
        .map((puzzle) => puzzle.startedAt())
        .sort();
      return {
        key: collection.key,
        to: `/collections/${collection.key}`,
        title: title(collection.key),
        total: collection.count(),
        unsolved: collection.unsolved().length,
        chains: [...new Set(collection.all().map((puzzle) => puzzle.chain()))],
        firstStarted: started[0] ?? "",
      };
    }),
    puzzles: puzzles.length,
    unsolved: unsolved.length,
    chains: [...new Set(puzzles.map((puzzle) => puzzle.chain()))],
    prize: prizeTotals(puzzles),
    unsolvedPrize: prizeTotals(unsolved),
    ticks: puzzles.map((puzzle) => puzzle.status()),
    firstStarted: started[0] ?? "",
    lastStarted: started.at(-1) ?? "",
    position:
      Math.max(
        0,
        roster.findIndex((row) => row.key === entry.key),
      ) + 1,
    total: roster.length,
  };
}

/** One row of the authors index. */
export interface AuthorRow {
  readonly key: string;
  readonly to: string;
  readonly name: string;
  readonly kind: string | undefined;
  readonly about: string | undefined;
  readonly collections: readonly string[];
  readonly puzzles: number;
}

/**
 * The rows of the authors index, one per author key, in the registry's order.
 *
 * @param {readonly AuthorEntry[]} entries - Every author.
 * @returns {readonly AuthorRow[]} Name, kind, blurb and the collection keys per author.
 */
export function authorRows(entries: readonly AuthorEntry[]): readonly AuthorRow[] {
  return entries.map((entry) => ({
    key: entry.key,
    to: `/authors/${entry.key}`,
    name: entry.author.name ?? entry.key,
    kind: entry.author.kind,
    about: entry.author.about,
    collections: entry.collections,
    puzzles: entry.puzzles,
  }));
}

/**
 * The icon of an author page: a person, an organization, or a key nobody signed.
 *
 * @param {string | undefined} kind - The author's kind, when the record has one.
 * @returns {string} A Lucide icon name.
 */
export function authorIcon(kind: string | undefined): string {
  if (kind === "organization") return "i-lucide-building-2";
  if (kind === "person") return "i-lucide-user-round";
  return "i-lucide-circle-help";
}

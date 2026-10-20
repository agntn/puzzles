import { formatPrize } from "../../src/core/format.ts";
import { Status, type AnyCollection } from "../../src/index.ts";

/** One puzzle as the registry app lists it, plain data for the tool result. */
export interface RegistryPuzzle {
  readonly id: string;
  readonly name: string;
  readonly status: Status;
  readonly prize: string;
}

/** One collection row of the registry app, with every puzzle it holds in record order. */
export interface RegistryCollection {
  readonly key: string;
  readonly title: string;
  readonly author: string | undefined;
  readonly open: number;
  readonly puzzles: readonly RegistryPuzzle[];
}

/** Every collection, the largest first, as the collections index orders them. */
export interface RegistryView {
  readonly collections: readonly RegistryCollection[];
}

/** The totals the model reads, while the rows go to the app alone. */
export interface RegistryCounts {
  readonly collections: number;
  readonly puzzles: number;
  readonly open: number;
}

/**
 * Builds the registry the app browses from the loaded collections.
 *
 * @param {readonly AnyCollection[]} collections - Every collection, loaded.
 * @param {readonly { key: string; title: string }[]} entries - The site's titles by collection key.
 * @returns {RegistryView} One row per collection, the largest first, each with its puzzles.
 */
export function registryView(
  collections: readonly AnyCollection[],
  entries: readonly { readonly key: string; readonly title: string }[],
): RegistryView {
  const titles = new Map(entries.map((entry) => [entry.key, entry.title]));
  return {
    collections: collections
      .map((collection) => {
        const puzzles = collection.all();
        return {
          key: collection.key,
          title: titles.get(collection.key) ?? collection.key,
          author: collection.author.name,
          open: puzzles.filter((puzzle) => puzzle.status() === Status.Unsolved).length,
          puzzles: puzzles.map((puzzle) => ({
            id: puzzle.id(),
            name: puzzle.name(),
            status: puzzle.status(),
            prize: formatPrize(puzzle.prize(), puzzle.prizeCurrency()),
          })),
        };
      })
      .toSorted((left, right) => right.puzzles.length - left.puzzles.length),
  };
}

/**
 * Counts what the registry holds.
 *
 * @param {RegistryView} view - The registry.
 * @returns {RegistryCounts} Collections, puzzles and the puzzles still unsolved.
 */
export function registryCounts(view: RegistryView): RegistryCounts {
  return {
    collections: view.collections.length,
    puzzles: view.collections.reduce((sum, collection) => sum + collection.puzzles.length, 0),
    open: view.collections.reduce((sum, collection) => sum + collection.open, 0),
  };
}

/**
 * The one line a model gets in place of the rows it never needs to read.
 *
 * @param {RegistryCounts} counts - The registry totals.
 * @returns {string} The totals and where a single record comes from.
 */
export function registryText(counts: RegistryCounts): string {
  return `The registry is open for the user: ${counts.collections} collections, ${counts.puzzles} puzzles, ${counts.open} still unsolved. To read one record, call puzzles_show.`;
}

import type { Fact, Profile, Puzzle, SolverEntry } from "../../../src/index.ts";
import { formatPrize, prizeTotals } from "../../../src/core/utils.ts";

/** One solve on a solver page. */
export interface SolveRow {
  readonly id: string;
  readonly to: string;
  readonly status: string;
  readonly chain: string;
  /** The solve date, or an empty string when the record has none. */
  readonly solvedAt: string;
  readonly prize: string;
}

/** Everything a solver page shows, as plain data for the Nuxt payload. */
export interface SolverFactsData {
  readonly key: string;
  readonly name: string | undefined;
  readonly kind: string | undefined;
  readonly about: string | undefined;
  readonly aliases: readonly string[];
  readonly profiles: readonly Profile[];
  readonly addresses: readonly string[];
  readonly facts: readonly Fact[];
  readonly solves: readonly SolveRow[];
  readonly chains: readonly string[];
  readonly prize: Readonly<Record<string, number>>;
  /** The collections the same party published. */
  readonly authored: readonly {
    readonly key: string;
    readonly to: string;
    readonly title: string;
  }[];
  /** The author page of the same party, when it published a collection. */
  readonly authorPage: string | undefined;
  readonly firstSolved: string;
  readonly lastSolved: string;
  /** Position among every solver, one based, for the file number on the page. */
  readonly position: number;
  readonly total: number;
}

/**
 * The dates a solver's puzzles record for the solve, oldest first.
 *
 * @param {SolverEntry} entry - The solver.
 * @returns {string[]} One date per solve that has one.
 */
function solveDates(entry: SolverEntry): string[] {
  return entry.solves
    .flatMap((solve) => (solve.solvedAt === undefined ? [] : [solve.solvedAt]))
    .sort();
}

/**
 * The solver record's own fields, with an empty list where the record has none.
 *
 * @param {SolverEntry} entry - The solver.
 * @returns {Pick<SolverFactsData, "name" | "kind" | "about" | "aliases" | "profiles" | "addresses" | "facts">} Name, kind, prose, channels and facts.
 */
function identity(
  entry: SolverEntry,
): Pick<
  SolverFactsData,
  "name" | "kind" | "about" | "aliases" | "profiles" | "addresses" | "facts"
> {
  const { solver } = entry;
  return {
    name: solver.name,
    kind: solver.kind,
    about: solver.about,
    aliases: solver.aliases ?? [],
    profiles: solver.profiles ?? [],
    addresses: solver.addresses ?? [],
    facts: solver.facts ?? [],
  };
}

/**
 * Reads a solver page off the solver entry.
 *
 * @param {SolverEntry} entry - The solver as the registry lists it.
 * @param {readonly Puzzle[]} puzzles - The puzzles of `entry.solves`, in that order, for the prize sum.
 * @param {readonly SolverEntry[]} [roster] - Every solver, for the position of this one.
 * @param {(key: string) => string} [title] - The display title of a collection key.
 * @returns {SolverFactsData} The record, one row per solve and the totals across them.
 */
export function solverFacts(
  entry: SolverEntry,
  puzzles: readonly Puzzle[],
  roster: readonly SolverEntry[] = [entry],
  title: (key: string) => string = (key) => key,
): SolverFactsData {
  const dates = solveDates(entry);
  return {
    key: entry.key,
    ...identity(entry),
    solves: entry.solves.map((solve) => ({
      id: solve.id,
      to: `/collections/${solve.id}`,
      status: solve.status,
      chain: solve.chain,
      solvedAt: solve.solvedAt ?? "",
      prize: formatPrize(solve.prize, solve.currency),
    })),
    chains: [...new Set(entry.solves.map((solve) => solve.chain))],
    prize: prizeTotals(puzzles),
    authored: entry.authored.map((key) => ({ key, to: `/collections/${key}`, title: title(key) })),
    authorPage: entry.authored.length === 0 ? undefined : `/authors/${entry.key}`,
    firstSolved: dates[0] ?? "",
    lastSolved: dates.at(-1) ?? "",
    position:
      Math.max(
        0,
        roster.findIndex((row) => row.key === entry.key),
      ) + 1,
    total: roster.length,
  };
}

/** One row of the solvers index. */
export interface SolverRow {
  readonly key: string;
  readonly to: string;
  readonly name: string;
  readonly kind: string | undefined;
  readonly about: string | undefined;
  readonly solves: readonly string[];
}

/**
 * The rows of the solvers index, one per solver key, in the registry's order.
 *
 * @param {readonly SolverEntry[]} entries - Every named solver.
 * @returns {readonly SolverRow[]} Name, kind, blurb and the puzzle identifiers per solver.
 */
export function solverRows(entries: readonly SolverEntry[]): readonly SolverRow[] {
  return entries.map((entry) => ({
    key: entry.key,
    to: `/solvers/${entry.key}`,
    name: entry.solver.name ?? entry.key,
    kind: entry.solver.kind,
    about: entry.solver.about,
    solves: entry.solves.map((solve) => solve.id),
  }));
}

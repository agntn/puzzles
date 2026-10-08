import { setTimeout as sleep } from "node:timers/promises";
import { defineTool, Type } from "@agntn/tools";
import {
  apiKeyArg,
  closed,
  collectionArg,
  filterArgs,
  filterQuery,
  hasFilter,
  pause,
  plainWord,
} from "./filters.ts";
import { lines, oneLine, printLine, streams } from "./output.ts";
import { apiKeyVariables, BalanceError, type BalanceOptions } from "../core/balance.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import type { Puzzle } from "../core/puzzle.ts";
import type { Balance } from "../core/types.ts";

/** One puzzle of a filtered pass: its balance, or the error that took its place. */
type Row = Readonly<
  { puzzle: Puzzle; balance: Balance; error?: never } | { puzzle: Puzzle; error: string }
>;

/**
 * One row of a filtered pass as the command prints it.
 *
 * @param {Row} row - The puzzle with its balance or its error.
 * @param {(balance: Balance) => string} format - Writes a balance, from the lazily loaded utils.
 * @returns {string} The tab-separated line.
 */
function formatRow(row: Row, format: (balance: Balance) => string): string {
  return row.error === undefined
    ? `OK\t${row.puzzle.id()}\t${format(row.balance)}`
    : `FAIL\t${row.puzzle.id()}\t${oneLine(row.error)}`;
}

function jsonRow(row: Row): object {
  return row.error === undefined
    ? {
        id: row.puzzle.id(),
        chain: row.balance.chain,
        confirmed: row.balance.confirmed,
        unconfirmed: row.balance.unconfirmed,
        decimals: row.balance.decimals,
      }
    : { id: row.puzzle.id(), chain: row.puzzle.chain(), error: row.error };
}

/**
 * Lookup options for one puzzle. `--api-key` goes to every chain; without it a chain gets the key
 * of its own variable, so an Etherscan key never reaches Blockchair.
 *
 * @param {Puzzle} puzzle - The puzzle to look up.
 * @param {string | undefined} apiKey - The `--api-key` value, when given.
 * @returns {BalanceOptions} The options for its lookup.
 */
function optionsFor(puzzle: Puzzle, apiKey: string | undefined): BalanceOptions {
  const variable = apiKeyVariables[puzzle.chain()];
  return { apiKey: apiKey ?? (variable === undefined ? undefined : process.env[variable]) };
}

/**
 * Looks the puzzles up one after another. A refused or failed lookup becomes a row of its own
 * instead of ending the pass; any other error still does, because it is not the provider's.
 *
 * @param {readonly Puzzle[]} puzzles - The puzzles the filters picked.
 * @param {string | undefined} apiKey - The `--api-key` value, when given.
 * @param {(row: Row) => void} report - Called with each row as soon as it is known.
 * @returns {Promise<readonly Row[]>} Every row, in the order of the puzzles.
 */
async function lookUp(
  puzzles: readonly Puzzle[],
  apiKey: string | undefined,
  report: (row: Row) => void,
): Promise<readonly Row[]> {
  const rows: Row[] = [];
  for (const [index, puzzle] of puzzles.entries()) {
    if (index > 0) {
      await sleep(pause);
    }
    let row: Row;
    try {
      row = { puzzle, balance: await puzzle.balance(optionsFor(puzzle, apiKey)) };
    } catch (error) {
      if (!(error instanceof BalanceError)) {
        throw error;
      }
      row = { puzzle, error: error.message };
    }
    rows.push(row);
    report(row);
  }
  return rows;
}

export default defineTool({
  name: "puzzles_balance",
  title: "Puzzle balances",
  description: "Fetch the balance of one puzzle, or of every puzzle the filters pick",
  effect: "read",
  openWorld: true,
  input: closed({
    id: Type.Optional(Type.String({ description: "Puzzle identifier" })),
    ...collectionArg,
    ...filterArgs,
    ...apiKeyArg,
  }),
  cli: { command: "balance", positional: ["id"] },
  async execute(args, { host }) {
    plainWord(args.id);
    const { requirePuzzle, selectPuzzles } = await import("../core/dataset.ts");
    const { formatBalance } = await import("../core/utils.ts");
    const filtered = hasFilter(args);
    if (args.id !== undefined && filtered) {
      throw new InvalidArgumentError("id", "pass a puzzle identifier or filters, not both");
    }
    if (args.id !== undefined) {
      const puzzle = await requirePuzzle(args.id);
      const balance = await puzzle.balance(optionsFor(puzzle, args.apiKey));
      return lines([`${puzzle.id()}: ${formatBalance(balance)}`], balance);
    }
    if (!filtered) {
      throw new InvalidArgumentError("id", "pass a puzzle identifier or a filter such as --status");
    }
    const live = streams(host);
    const puzzles = await selectPuzzles(await filterQuery(args));
    const rows = await lookUp(puzzles, args.apiKey, (row) => {
      if (live) {
        printLine(formatRow(row, formatBalance));
      }
    });
    if (rows.some((row) => row.error !== undefined)) {
      process.exitCode = 1;
    }
    return lines(
      [],
      rows.map((row) => jsonRow(row)),
    );
  },
});

import { setTimeout as sleep } from "node:timers/promises";
import { defineCommand } from "citty";
import { filterArgs, filterQuery, hasFilter } from "./filters.ts";
import { jsonArg, oneLine, printLine } from "./output.ts";
import { BalanceError, type BalanceOptions } from "../core/balance.ts";
import { chainSymbol } from "../core/chains.ts";
import { requirePuzzle, selectPuzzles } from "../core/dataset.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import type { Puzzle } from "../core/puzzle.ts";
import type { Balance } from "../core/types.ts";
import { toJson } from "../core/utils.ts";

/**
 * The pause between two lookups of a filtered pass. Fired at once, a pass over the unsolved
 * puzzles lost 11 Bitcoin lookups to mempool.space in one burst.
 */
const pause = 250;

/** One puzzle of a filtered pass: its balance, or the error that took its place. */
type Row = Readonly<
  { puzzle: Puzzle; balance: Balance; error?: never } | { puzzle: Puzzle; error: string }
>;

function amount(balance: Balance): string {
  return `${balance.totalAmount()} ${chainSymbol(balance.chain)}`;
}

function formatRow(row: Row): string {
  return row.error === undefined
    ? `OK\t${row.puzzle.id()}\t${amount(row.balance)}`
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
 * Looks the puzzles up one after another. A refused or failed lookup becomes a row of its own
 * instead of ending the pass; any other error still does, because it is not the provider's.
 *
 * @param {readonly Puzzle[]} puzzles - The puzzles the filters picked.
 * @param {BalanceOptions} options - Lookup options.
 * @param {(row: Row) => void} report - Called with each row as soon as it is known.
 * @returns {Promise<readonly Row[]>} Every row, in the order of the puzzles.
 */
async function lookUp(
  puzzles: readonly Puzzle[],
  options: BalanceOptions,
  report: (row: Row) => void,
): Promise<readonly Row[]> {
  const rows: Row[] = [];
  for (const [index, puzzle] of puzzles.entries()) {
    if (index > 0) {
      await sleep(pause);
    }
    let row: Row;
    try {
      row = { puzzle, balance: await puzzle.balance(options) };
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

export default defineCommand({
  meta: {
    name: "balance",
    description: "Fetch the balance of one puzzle, or of every puzzle the filters pick",
  },
  args: {
    id: { type: "positional", required: false, description: "Puzzle identifier" },
    collection: { type: "string", description: "Filter by collection key, for example b1000" },
    ...filterArgs,
    "api-key": {
      type: "string",
      description: "Provider API key; Ethereum falls back to ETHERSCAN_API_KEY",
    },
    ...jsonArg,
  },
  async run({ args }) {
    const options = { apiKey: args["api-key"] ?? process.env["ETHERSCAN_API_KEY"] };
    const filtered = hasFilter(args);
    if (args.id !== undefined && filtered) {
      throw new InvalidArgumentError("id", "pass a puzzle identifier or filters, not both");
    }
    if (args.id !== undefined) {
      const puzzle = await requirePuzzle(args.id);
      const balance = await puzzle.balance(options);
      printLine(args.json ? toJson(balance) : `${puzzle.id()}: ${amount(balance)}`);
      return;
    }
    if (!filtered) {
      throw new InvalidArgumentError("id", "pass a puzzle identifier or a filter such as --status");
    }
    const puzzles = await selectPuzzles(filterQuery(args));
    const rows = await lookUp(puzzles, options, (row) => {
      if (!args.json) {
        printLine(formatRow(row));
      }
    });
    if (args.json) {
      printLine(toJson(rows.map((row) => jsonRow(row))));
    }
    if (rows.some((row) => row.error !== undefined)) {
      process.exitCode = 1;
    }
  },
});

import { setTimeout as sleep } from "node:timers/promises";
import { defineCommand } from "citty";
import { filterArgs, filterQuery, hasFilter, pause } from "./filters.ts";
import { jsonArg, printLine } from "./output.ts";
import { apiKeyVariables } from "../core/balance.ts";
import { requirePuzzle, selectPuzzles } from "../core/dataset.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import type { Puzzle } from "../core/puzzle.ts";
import { toJson } from "../core/utils.ts";
import { formatWatchReport, watcher, type WatchReport } from "../core/watch.ts";

/**
 * The provider key for one puzzle: `--api-key` for every chain, otherwise the chain's own variable,
 * so an Etherscan key never reaches Blockchair.
 *
 * @param {Puzzle} puzzle - The puzzle to check.
 * @param {string | undefined} apiKey - The `--api-key` value, when given.
 * @returns {string | undefined} The key for its lookups.
 */
function keyFor(puzzle: Puzzle, apiKey: string | undefined): string | undefined {
  const variable = apiKeyVariables[puzzle.chain()];
  return apiKey ?? (variable === undefined ? undefined : process.env[variable]);
}

/**
 * The puzzles one run checks: the one its id names, or every one its filters pick.
 *
 * @param {WatchArgs} args - The parsed flags.
 * @returns {Promise<readonly Puzzle[]>} The puzzles, in dataset order.
 */
async function selected(args: WatchArgs): Promise<readonly Puzzle[]> {
  const filtered = hasFilter(args);
  if (args.id !== undefined && filtered) {
    throw new InvalidArgumentError("id", "pass a puzzle identifier or filters, not both");
  }
  if (args.id === undefined && !filtered) {
    throw new InvalidArgumentError("id", "pass a puzzle identifier or a filter such as --status");
  }
  return args.id === undefined ? selectPuzzles(filterQuery(args)) : [await requirePuzzle(args.id)];
}

/**
 * The exit code a scheduled run reads: 1 for any finding, 2 when only lookups failed, 0 otherwise.
 *
 * @param {readonly WatchReport[]} reports - Every report of the run.
 * @returns {number} The exit code.
 */
function exitCode(reports: readonly WatchReport[]): number {
  if (reports.some((report) => report.findings.length > 0)) return 1;
  return reports.some((report) => report.errors.length > 0) ? 2 : 0;
}

/** The flags `selected()` reads. */
type WatchArgs = Readonly<{ id?: string | undefined } & Parameters<typeof hasFilter>[0]>;

export default defineCommand({
  meta: {
    name: "watch",
    description:
      "Compare puzzles with the chain, and with their source pages when --since is given, and report what the record misses",
  },
  args: {
    id: { type: "positional", required: false, description: "Puzzle identifier" },
    collection: { type: "string", description: "Filter by collection key, for example b1000" },
    ...filterArgs,
    since: {
      type: "string",
      description:
        "Also compare each source page's newest Wayback capture with the last one up to this date, YYYY-MM-DD or ISO 8601",
    },
    "api-key": {
      type: "string",
      description:
        "Provider API key; Ethereum falls back to ETHERSCAN_API_KEY, Bitcoin Cash, Dogecoin and eCash to BLOCKCHAIR_API_KEY",
    },
    ...jsonArg,
  },
  async run({ args }) {
    const puzzles = await selected(args);
    const check = watcher({ since: args.since });
    const reports: WatchReport[] = [];
    for (const [index, puzzle] of puzzles.entries()) {
      if (index > 0) {
        await sleep(pause);
      }
      const report = await check(puzzle, keyFor(puzzle, args["api-key"]));
      reports.push(report);
      if (!args.json) {
        for (const row of formatWatchReport(report)) {
          printLine(row);
        }
      }
    }
    if (args.json) {
      printLine(toJson(reports));
    }
    process.exitCode = exitCode(reports);
  },
});

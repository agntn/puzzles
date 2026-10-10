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
} from "./filters.ts";
import { lines, printLine, streams } from "./output.ts";
import { apiKeyVariables } from "../core/balance.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import type { Puzzle } from "../core/puzzle.ts";
import type { WatchReport } from "../core/watch.ts";

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

/** The flags `selected()` reads. */
type WatchArgs = Readonly<{ id?: string | undefined } & Parameters<typeof hasFilter>[0]>;

/**
 * The puzzles one run checks: the one its id names, or every one its filters pick.
 *
 * @param {WatchArgs} args - The parsed flags.
 * @returns {Promise<readonly Puzzle[]>} The puzzles, in dataset order.
 */
async function selected(args: WatchArgs): Promise<readonly Puzzle[]> {
  const { requirePuzzle, selectPuzzles } = await import("../core/dataset.ts");
  const filtered = hasFilter(args);
  if (args.id !== undefined && filtered) {
    throw new InvalidArgumentError("id", "pass a puzzle identifier or filters, not both");
  }
  if (args.id === undefined && !filtered) {
    throw new InvalidArgumentError("id", "pass a puzzle identifier or a filter such as --status");
  }
  return args.id === undefined
    ? selectPuzzles(await filterQuery(args))
    : [await requirePuzzle(args.id)];
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

export default defineTool({
  name: "puzzles_watch",
  title: "Watch puzzles",
  description:
    "Compare puzzles with the chain, and with their source pages when --since is given, and report what the record misses",
  effect: "read",
  openWorld: true,
  input: closed({
    id: Type.Optional(Type.String({ description: "Puzzle identifier" })),
    ...collectionArg,
    ...filterArgs,
    since: Type.Optional(
      Type.String({
        description:
          "Also compare each source page's newest Wayback capture with the last one up to this date, YYYY-MM-DD or ISO 8601",
      }),
    ),
    ...apiKeyArg,
  }),
  cli: { command: "watch", positional: ["id"], plain: ["id"] },
  async execute(args, { host }) {
    const { formatWatchReport, watcher } = await import("../core/watch.ts");
    const live = streams(host);
    const puzzles = await selected(args);
    const check = watcher({ since: args.since });
    const reports: WatchReport[] = [];
    for (const [index, puzzle] of puzzles.entries()) {
      if (index > 0) {
        await sleep(pause);
      }
      const report = await check(puzzle, keyFor(puzzle, args.apiKey));
      reports.push(report);
      if (live) {
        for (const row of formatWatchReport(report)) {
          printLine(row);
        }
      }
    }
    process.exitCode = exitCode(reports);
    return lines([], reports);
  },
});

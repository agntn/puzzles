import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { chains } from "../core/chains.ts";
import { selectPuzzles } from "../core/dataset.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import { Status } from "../core/puzzle.ts";
import { formatPuzzle, parseStatus, requireChain, toJson } from "../core/utils.ts";

/**
 * Reads a count the shell hands over as text, so `--limit abc` or `--offset -1` fails loudly
 * instead of paging by `NaN`.
 *
 * @param {string} argument - Name of the flag being read.
 * @param {string | undefined} value - What the shell passed, when the flag was given.
 * @param {number} minimum - The smallest value the flag accepts.
 * @returns {number | undefined} The count, or nothing when the flag was left out.
 */
function count(argument: string, value: string | undefined, minimum: number): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  const parsed = /^\d+$/u.test(value) ? Number(value) : Number.NaN;
  if (!Number.isSafeInteger(parsed) || parsed < minimum) {
    throw new InvalidArgumentError(argument, `expected an integer of ${minimum} or more`);
  }
  return parsed;
}

export default defineCommand({
  meta: {
    name: "list",
    description: "List puzzles, optionally filtered by collection, address, chain and status",
  },
  args: {
    collection: {
      type: "positional",
      required: false,
      description: "Collection key, for example b1000",
    },
    address: {
      type: "string",
      description: "The puzzle paying to this address, in any case the chain accepts",
    },
    chain: {
      type: "string",
      description: `Filter by chain: ${chains.join(", ")}`,
    },
    status: {
      type: "string",
      description: `Filter by status: ${Object.values(Status).join(", ")}`,
    },
    "with-pubkey": { type: "boolean", description: "Only puzzles with a known public key" },
    limit: {
      type: "string",
      description: "Print at most this many puzzles (default: every match)",
    },
    offset: { type: "string", description: "Skip this many matching puzzles (default 0)" },
    ...jsonArg,
  },
  async run({ args }) {
    const offset = count("offset", args.offset, 0) ?? 0;
    const limit = count("limit", args.limit, 1);
    const matched = await selectPuzzles({
      address: args.address,
      chain: requireChain(args.chain),
      collection: args.collection,
      status: parseStatus(args.status),
      withPubkey: args["with-pubkey"],
    });
    const puzzles = matched.slice(offset, limit === undefined ? undefined : offset + limit);
    if (args.json) {
      printLine(toJson(puzzles));
      return;
    }
    for (const puzzle of puzzles) {
      printLine(formatPuzzle(puzzle));
    }
  },
});

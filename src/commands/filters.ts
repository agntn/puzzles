import { chains } from "../core/chains.ts";
import type { PuzzleQuery } from "../core/dataset.ts";
import { Status } from "../core/puzzle.ts";
import { parseStatus, requireChain } from "../core/utils.ts";

/** The filters `list` and `balance` both take, besides the collection each declares its own way. */
export const filterArgs = {
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
} as const;

/** The filter flags as citty parses them, with the collection each command declares itself. */
type FilterFlags = Readonly<{
  address?: string | undefined;
  chain?: string | undefined;
  collection?: string | undefined;
  status?: string | undefined;
  "with-pubkey"?: boolean | undefined;
}>;

/**
 * Whether any filter flag was given.
 *
 * @param {FilterFlags} args - The parsed flags.
 * @returns {boolean} Whether the command should select puzzles by the filters.
 */
export function hasFilter(args: FilterFlags): boolean {
  return (
    args.address !== undefined ||
    args.chain !== undefined ||
    args.collection !== undefined ||
    args.status !== undefined ||
    args["with-pubkey"] === true
  );
}

/**
 * Turns the filter flags into a dataset query, throwing on a chain or status nothing answers to.
 *
 * @param {FilterFlags} args - The parsed flags.
 * @returns {PuzzleQuery} The query `selectPuzzles()` takes.
 */
export function filterQuery(args: FilterFlags): PuzzleQuery {
  return {
    address: args.address,
    chain: requireChain(args.chain),
    collection: args.collection,
    status: parseStatus(args.status),
    withPubkey: args["with-pubkey"],
  };
}

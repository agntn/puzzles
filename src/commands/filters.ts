import { ToolInputError, Type, type TObject, type TProperties } from "@agntn/tools";
import type { PuzzleQuery } from "../core/dataset.ts";
import { facts } from "../tool-operations.ts";

const { chains, statuses, techniques } = facts;

/**
 * The pause between two lookups of a filtered pass. Fired at once, a pass over the unsolved
 * puzzles lost 11 Bitcoin lookups to mempool.space in one burst.
 */
export const pause = 250;

/**
 * An object schema that takes no other key, so a misspelled flag fails instead of being dropped.
 *
 * @param {T} properties - The command's arguments.
 * @returns {TObject<T>} The closed object schema.
 */
export function closed<T extends TProperties>(properties: T): TObject<T> {
  return Type.Object(properties, { additionalProperties: false });
}

/**
 * `runCli` hands a dashed word that spells no option to the positional, and no identifier, key or
 * address starts with a dash, so `list --withPubkey` is a typo, not a collection.
 *
 * @param {string | undefined} value - The positional word, when given.
 * @returns {T} The same word.
 */
export function plainWord<T extends string | undefined>(value: T): T {
  if (value?.startsWith("-") === true) {
    throw new ToolInputError([`Invalid arguments: unknown option ${JSON.stringify(value)}`]);
  }
  return value;
}

/** Strings, not enums: a chain answers to its symbol too, and a miss lists what would match. */
export const filterArgs = {
  address: Type.Optional(
    Type.String({
      description: "The puzzle paying to this address, in any case the chain accepts",
    }),
  ),
  chain: Type.Optional(Type.String({ description: `Filter by chain: ${chains.join(", ")}` })),
  status: Type.Optional(Type.String({ description: `Filter by status: ${statuses.join(", ")}` })),
  technique: Type.Optional(
    Type.String({ description: `Filter by technique: ${techniques.join(", ")}` }),
  ),
  withPubkey: Type.Optional(Type.Boolean({ description: "Only puzzles with a known public key" })),
};

/** `--collection` for the commands whose positional is a puzzle identifier. */
export const collectionArg = {
  collection: Type.Optional(
    Type.String({ description: "Filter by collection key, for example bits" }),
  ),
};

/** The provider key flag of the commands that ask a chain. */
export const apiKeyArg = {
  apiKey: Type.Optional(
    Type.String({
      description:
        "Provider API key; Ethereum falls back to ETHERSCAN_API_KEY, Bitcoin Cash, Dogecoin and eCash to BLOCKCHAIR_API_KEY",
    }),
  ),
};

/** The filter flags as the command line hands them over, with the collection. */
type FilterFlags = Readonly<{
  address?: string | undefined;
  chain?: string | undefined;
  collection?: string | undefined;
  status?: string | undefined;
  technique?: string | undefined;
  withPubkey?: boolean | undefined;
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
    args.technique !== undefined ||
    args.withPubkey === true
  );
}

/**
 * Turns the filter flags into a dataset query, throwing on a chain or status nothing answers to.
 *
 * @param {FilterFlags} args - The parsed flags.
 * @returns {Promise<PuzzleQuery>} The query `selectPuzzles()` takes.
 */
export async function filterQuery(args: FilterFlags): Promise<PuzzleQuery> {
  const { parseStatus, parseTechnique, requireChain } = await import("../core/utils.ts");
  return {
    address: args.address,
    chain: requireChain(args.chain),
    collection: args.collection,
    status: parseStatus(args.status),
    technique: parseTechnique(args.technique),
    withPubkey: args.withPubkey,
  };
}

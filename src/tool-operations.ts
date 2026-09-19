import {
  collectionSummaries,
  dataVersion,
  requirePuzzle,
  selectPuzzles,
  stats,
} from "./core/dataset.ts";
import { InvalidArgumentError } from "./core/errors.ts";
import { Status } from "./core/puzzle.ts";
import { collectionKeys, requireCollection } from "./core/registry.ts";
import {
  formatCollection,
  formatHintReport,
  formatPrizeTotals,
  formatPuzzle,
  formatPuzzleRecord,
  parseStatus,
} from "./core/utils.ts";

/** Result shape shared by the MCP server and the Pi/OMP extensions. */
export interface ToolResult {
  content: Array<{ type: "text"; text: string }>;
  details: Record<string, unknown>;
}

/** Maximum number of puzzles a single list call may return. */
export const MAX_LIST_LIMIT = 500;

/** Default number of puzzles returned by the list tool. */
export const DEFAULT_LIST_LIMIT = 50;

/** What every tool surface registers about one tool; the schema is built per harness. */
export interface ToolFacts {
  readonly description: string;
  readonly name: string;
  /** Whether the tool reaches beyond the bundled dataset, for example a block explorer. */
  readonly openWorld: boolean;
  readonly promptGuidelines: readonly string[];
  readonly promptSnippet: string;
  readonly title: string;
}

/** Names, prose, parameter constraints, and status values shared by MCP, Pi, and OMP. */
export const facts = {
  tools: {
    stats: {
      name: "puzzles_stats",
      title: "Puzzle Statistics",
      description: "Report totals, status counts, and prize sums across every puzzle collection.",
      promptSnippet: "Use puzzles_stats for dataset-wide crypto puzzle and bounty totals.",
      promptGuidelines: ["Call it before listing puzzles to know how large the dataset is."],
      openWorld: false,
    },
    collections: {
      name: "puzzles_collections",
      title: "Puzzle Collections",
      description:
        "List every puzzle collection with its author and its solved and unsolved counts.",
      promptSnippet:
        "Use puzzles_collections to learn which collections exist before listing puzzles.",
      promptGuidelines: [
        "A collection key is the first segment of a puzzle identifier, for example b1000 in b1000/90.",
      ],
      openWorld: false,
    },
    show: {
      name: "puzzles_show",
      title: "Show Puzzle",
      description: "Show one puzzle's address, status, key material, hints, and explorer links.",
      promptSnippet: "Use puzzles_show to inspect a single puzzle by identifier.",
      promptGuidelines: ["Identifiers are collection/name, for example b1000/90, or gsmg."],
      openWorld: false,
    },
    hints: {
      name: "puzzles_hints",
      title: "Puzzle Hints",
      description:
        "List the hints recorded for one puzzle, its collection's and its own, each with where it was said and what confirms that.",
      promptSnippet:
        "Use puzzles_hints for what the author or the community said about a puzzle before searching for its key.",
      promptGuidelines: [
        "An official hint comes from the puzzle's author; a community hint comes from anyone else and may be wrong.",
        "The confirmation link shows the source said it, an archive capture for example; it does not vouch for the hint.",
      ],
      openWorld: false,
    },
    list: {
      name: "puzzles_list",
      title: "List Puzzles",
      description: "List puzzles filtered by collection, status, and public key availability.",
      promptSnippet: "Use puzzles_list to browse puzzles by collection or status.",
      promptGuidelines: [
        "Prefer a collection or status filter over listing everything.",
        "Raise limit only when the summary shows more matches than were returned.",
      ],
      openWorld: false,
    },
    verify: {
      name: "puzzles_verify",
      title: "Verify Puzzle Key",
      description: "Check that a puzzle's recorded key material derives its stored address.",
      promptSnippet: "Use puzzles_verify to confirm recorded key material before trusting it.",
      promptGuidelines: ["An expected failure is a result, not an error."],
      openWorld: false,
    },
    balance: {
      name: "puzzles_balance",
      title: "Puzzle Balance",
      description: "Fetch the current on-chain balance of a puzzle address.",
      promptSnippet: "Use puzzles_balance for the live balance of a puzzle address.",
      promptGuidelines: [
        "This call reaches a public block explorer.",
        "Ethereum needs an Etherscan key through apiKey or ETHERSCAN_API_KEY.",
      ],
      openWorld: true,
    },
  },
  parameters: {
    id: {
      minLength: 1,
      maxLength: 100,
      description: "Universal puzzle identifier, for example b1000/90 or gsmg",
    },
    collection: { maxLength: 50, description: "Collection key, for example b1000" },
    status: { description: "Puzzle lifecycle status" },
    withPubkey: { description: "Only puzzles with a known public key" },
    limit: {
      minimum: 1,
      maximum: MAX_LIST_LIMIT,
      description: `Maximum puzzles to return (default ${DEFAULT_LIST_LIMIT})`,
    },
    apiKey: {
      maxLength: 200,
      description: "Provider API key; Ethereum falls back to ETHERSCAN_API_KEY",
    },
  },
  statuses: Object.values(Status),
} as const satisfies {
  tools: Record<string, ToolFacts>;
  parameters: Record<string, object>;
  statuses: readonly Status[];
};

/** Parameters accepted by the list tool. */
export interface ListParams {
  readonly collection?: string;
  readonly limit?: number;
  readonly status?: string;
  readonly withPubkey?: boolean;
}

function text(value: string, details: Readonly<Record<string, unknown>>): ToolResult {
  return { content: [{ type: "text", text: value }], details };
}

/**
 * Enforces a text argument's length contract in the executor, so a host that skips
 * schema validation still hits the same limits as one that honors it.
 *
 * @param {string} argument - Name of the argument that failed.
 * @param {string} value - Text the caller passed.
 * @param {{ readonly minLength?: number; readonly maxLength?: number }} limits - Length limits from the facts table.
 * @returns {string} The same text, once it fits the limits.
 */
function assertLength(
  argument: string,
  value: string,
  limits: { readonly minLength?: number; readonly maxLength?: number },
): string {
  const minimum = limits.minLength ?? 0;
  if (
    value.length < minimum ||
    (limits.maxLength !== undefined && value.length > limits.maxLength)
  ) {
    throw new InvalidArgumentError(
      argument,
      `expected ${minimum} to ${limits.maxLength ?? "any"} characters`,
    );
  }
  return value;
}

/**
 * Rejects, rather than clamps, a list limit outside the contract the schemas declare.
 *
 * @param {number | undefined} value - Requested limit, when the caller gave one.
 * @returns {number} The requested limit, or the default when none was given.
 */
function assertLimit(value: number | undefined): number {
  if (value === undefined) {
    return DEFAULT_LIST_LIMIT;
  }
  const { minimum, maximum } = facts.parameters.limit;
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new InvalidArgumentError("limit", `expected an integer from ${minimum} to ${maximum}`);
  }
  return value;
}

/**
 * Dataset-wide puzzle statistics for a model.
 *
 * @returns {Promise<ToolResult>} The totals as text, with the stats and the data version in `details`.
 */
export async function statsTool(): Promise<ToolResult> {
  const [result, version] = await Promise.all([stats(), dataVersion()]);
  const lines = [
    `Total: ${result.total} puzzles in ${collectionKeys().length} collections`,
    `Solved: ${result.solved}  Unsolved: ${result.unsolved}  Claimed: ${result.claimed}  Swept: ${result.swept}  Expired: ${result.expired}`,
    `With public key: ${result.with_pubkey}`,
    `Total prize: ${formatPrizeTotals(result.total_prize)}`,
    `Unsolved prize: ${formatPrizeTotals(result.unsolved_prize)}`,
    `Data version: ${version}`,
  ];
  return text(lines.join("\n"), { ...result, data_version: version });
}

/**
 * Lists every collection with its author and status counts, the same rows the CLI prints.
 *
 * @returns {Promise<ToolResult>} One line per collection with its counts and author.
 */
export async function collectionsTool(): Promise<ToolResult> {
  const summaries = await collectionSummaries();
  return text(summaries.map(formatCollection).join("\n"), { collections: summaries });
}

/**
 * One puzzle's complete record for a model.
 *
 * @param {string} id - Universal puzzle identifier.
 * @returns {Promise<ToolResult>} The record as text, with the puzzle and every hint that holds for it in `details`.
 */
export async function showTool(id: string): Promise<ToolResult> {
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const collection = await requireCollection(puzzle.collection());
  return text(formatPuzzleRecord(puzzle, collection.hints), {
    puzzle,
    hints: collection.hintsById(puzzle.id()),
  });
}

/**
 * Every hint that holds for one puzzle, the collection's and its own, in the blocks `puzzles_show`
 * prints them in.
 *
 * @param {string} id - Universal puzzle identifier.
 * @returns {Promise<ToolResult>} The hints as text, with the joined list in `details`.
 */
export async function hintsTool(id: string): Promise<ToolResult> {
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const collection = await requireCollection(puzzle.collection());
  return text(formatHintReport(puzzle.id(), collection.hints, puzzle.hints()).join("\n"), {
    id: puzzle.id(),
    hints: collection.hintsById(puzzle.id()),
  });
}

/**
 * Lists puzzles filtered by collection, status, and public key availability.
 *
 * @param {ListParams} params - Validated tool parameters.
 * @returns {Promise<ToolResult>} The matching puzzles, up to the requested limit.
 */
export async function listTool(params: ListParams): Promise<ToolResult> {
  const limit = assertLimit(params.limit);
  const filtered = await selectPuzzles({
    collection:
      params.collection === undefined
        ? undefined
        : assertLength("collection", params.collection, facts.parameters.collection),
    status: parseStatus(params.status),
    withPubkey: params.withPubkey,
  });
  const page = filtered.slice(0, limit);
  const header =
    filtered.length > page.length
      ? `${page.length} of ${filtered.length} matching puzzles:`
      : `${filtered.length} matching puzzles:`;
  const body = page.length === 0 ? "(none)" : page.map((puzzle) => formatPuzzle(puzzle)).join("\n");
  return text(`${header}\n${body}`, {
    matched: filtered.length,
    returned: page.length,
    ids: page.map((puzzle) => puzzle.id()),
  });
}

/**
 * Verifies that a puzzle's known key material derives its stored address. The signing crypto loads
 * on the first call, like `Collection.verifyById()`, so registering the tools costs no secp256k1.
 *
 * @param {string} id - Universal puzzle identifier.
 * @returns {Promise<ToolResult>} The verification outcome for the puzzle.
 */
export async function verifyTool(id: string): Promise<ToolResult> {
  const [puzzle, { verifyPuzzle }] = await Promise.all([
    requirePuzzle(assertLength("id", id, facts.parameters.id)),
    import("./core/verify.ts"),
  ]);
  const result = verifyPuzzle(puzzle);
  const summary = result.verified
    ? `${result.id}: verified, derives ${result.derivedAddress}`
    : result.unavailable
      ? `${result.id}: unverifiable (${result.error})`
      : `${result.id}: not verified (${result.error})`;
  return text(summary, { ...result });
}

/**
 * Fetches a puzzle address balance from its chain.
 *
 * @param {string} id - Universal puzzle identifier.
 * @param {string} [apiKey] - Provider API key, when the chain needs one.
 * @returns {Promise<ToolResult>} The puzzle address balance.
 */
export async function balanceTool(id: string, apiKey?: string): Promise<ToolResult> {
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const key =
    apiKey === undefined ? undefined : assertLength("apiKey", apiKey, facts.parameters.apiKey);
  const balance = await puzzle.balance({
    apiKey: key ?? globalThis.process?.env["ETHERSCAN_API_KEY"],
  });
  return text(`${puzzle.id()}: ${balance.totalUnits()} on ${balance.chain}`, {
    id: puzzle.id(),
    chain: balance.chain,
    confirmed: balance.confirmed.toString(),
    unconfirmed: balance.unconfirmed.toString(),
    decimals: balance.decimals,
  });
}

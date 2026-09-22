import type { Chain } from "./core/chains.ts";
import { InvalidArgumentError } from "./core/errors.ts";
import { Status } from "./core/status.ts";

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
      description: "List every puzzle collection with its author and its puzzle count per status.",
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
        "List a puzzle's own and inherited hints with sources, optional confirmations, separately labeled published answers, and hint files.",
      promptSnippet:
        "Use puzzles_hints for what the author or the community said about a puzzle before searching for its key.",
      promptGuidelines: [
        "An official hint comes from the puzzle's author; a community hint comes from anyone else and may be wrong.",
        "The source is the published hint. An optional confirmation links to an archive or another publication of that same hint, not general information about the puzzle.",
        "An answer records a published response to one hint, not a verified puzzle solution or key.",
      ],
      openWorld: false,
    },
    list: {
      name: "puzzles_list",
      title: "List Puzzles",
      description:
        "List puzzles filtered by target address, collection, chain, status, and public key availability, in dataset order. When a next offset is returned, pass it as offset with the same filters to continue.",
      promptSnippet:
        "Use puzzles_list to browse puzzles by collection, chain or status, or to find the puzzle an address belongs to.",
      promptGuidelines: [
        "Prefer a collection, chain or status filter over listing everything.",
        "Almost every puzzle is on Bitcoin, so a chain filter is the way to find the few that are not.",
        "Given an address, pass it as address instead of listing the dataset and reading every row; an empty result means no puzzle pays to it.",
        "Follow the next offset with the same filters instead of raising limit and repeating earlier rows.",
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
    address: {
      minLength: 1,
      maxLength: 128,
      description:
        "The puzzle paying to this address. Case only matters where the chain says it does, so an EIP-55 Ethereum address and an uppercased bech32 one both resolve",
    },
    chain: { description: "Only puzzles on one blockchain" },
    collection: { maxLength: 50, description: "Collection key, for example b1000" },
    status: {
      description:
        "Lifecycle status: unsolved, solved, claimed (prize taken, key unpublished), swept (taken after the public key leaked), or expired (the author took it back)",
    },
    withPubkey: { description: "Only puzzles with a known public key" },
    limit: {
      minimum: 1,
      maximum: MAX_LIST_LIMIT,
      description: `Maximum puzzles to return (default ${DEFAULT_LIST_LIMIT})`,
    },
    offset: {
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
      description: "Number of matching puzzles to skip (default 0). Use the returned next offset.",
    },
    apiKey: {
      maxLength: 200,
      description: "Provider API key; Ethereum falls back to ETHERSCAN_API_KEY",
    },
  },
  /**
   * Spelled out rather than imported, because `core/chains.ts` pulls in `@agntn/chains` and tool
   * discovery loads this table. `test/unit/tool-schemas.test.ts` pins the list to the library's.
   */
  chains: ["arweave", "bitcoin", "decred", "ethereum", "litecoin", "monero"],
  statuses: Object.values(Status),
} as const satisfies {
  tools: Record<string, ToolFacts>;
  parameters: Record<string, object>;
  chains: readonly Chain[];
  statuses: readonly Status[];
};

/** Parameters accepted by the list tool. */
export interface ListParams {
  readonly address?: string;
  readonly chain?: string;
  readonly collection?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly status?: string;
  readonly withPubkey?: boolean;
}

function text(value: string, details: Readonly<Record<string, unknown>>): ToolResult {
  return { content: [{ type: "text", text: value }], details };
}

/**
 * Enforces a text argument's type and length contract in the executor, so a host that skips
 * schema validation still hits the same limits as one that honors it. A caller that sends
 * something other than text gets the same rejection, not whatever `.length` does to it.
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
    typeof value !== "string" ||
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

function assertOffset(value: number | undefined): number {
  if (value === undefined) {
    return 0;
  }
  const { minimum, maximum } = facts.parameters.offset;
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new InvalidArgumentError("offset", `expected an integer from ${minimum} to ${maximum}`);
  }
  return value;
}

/** The three core modules every tool reads, imported once. */
interface CoreModules {
  readonly dataset: typeof import("./core/dataset.ts");
  readonly registry: typeof import("./core/registry.ts");
  readonly utils: typeof import("./core/utils.ts");
}

let core: Promise<CoreModules> | undefined;

/**
 * Loads the core modules the tools read, one import after another, and keeps the one namespace
 * object every later call reuses.
 *
 * The imports are serial on purpose. The three modules share a dependency graph, and a host loader
 * that re-evaluates a module per importer, such as the jiti loader Pi runs extensions under,
 * re-enters those shared modules when the imports overlap: the second importer then reads a
 * half-initialized namespace, and every tool fails or, worse, reports the dataset as empty.
 *
 * @returns {Promise<CoreModules>} The dataset, registry, and formatting modules.
 */
function loadCore(): Promise<CoreModules> {
  return (core ??= (async (): Promise<CoreModules> => {
    const dataset = await import("./core/dataset.ts");
    const registry = await import("./core/registry.ts");
    const utils = await import("./core/utils.ts");
    return { dataset, registry, utils };
  })());
}

/**
 * Dataset-wide puzzle statistics for a model.
 *
 * @returns {Promise<ToolResult>} The totals as text, with the stats and the data version in `details`.
 */
export async function statsTool(): Promise<ToolResult> {
  const {
    dataset: { stats, dataVersion },
    registry: { collectionKeys },
    utils: { formatPrizeTotals },
  } = await loadCore();
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
  const {
    dataset: { collectionSummaries },
    utils: { formatCollection },
  } = await loadCore();
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
  const {
    dataset: { requirePuzzle },
    registry: { requireCollection },
    utils: { formatPuzzleRecord },
  } = await loadCore();
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const collection = await requireCollection(puzzle.collection());
  return text(formatPuzzleRecord(puzzle, collection.hints), {
    puzzle,
    hints: collection.hintsById(puzzle.id()),
  });
}

/**
 * Every hint that holds for one puzzle, the collection's and its own, in the blocks `puzzles_show`
 * prints them in, then the hint files the record ships.
 *
 * @param {string} id - Universal puzzle identifier.
 * @returns {Promise<ToolResult>} The hints as text, with the joined list and the hint links in `details`.
 */
export async function hintsTool(id: string): Promise<ToolResult> {
  const {
    dataset: { requirePuzzle },
    registry: { requireCollection },
    utils: { formatHintReport, hintAssets },
  } = await loadCore();
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const collection = await requireCollection(puzzle.collection());
  return text(formatHintReport(puzzle, collection.hints).join("\n"), {
    id: puzzle.id(),
    hints: collection.hintsById(puzzle.id()),
    hintAssets: hintAssets(puzzle),
  });
}

/**
 * Lists puzzles filtered by collection, status, and public key availability.
 *
 * @param {ListParams} params - Validated tool parameters.
 * @returns {Promise<ToolResult>} One page, with a next offset only when more matches remain.
 */
export async function listTool(params: ListParams): Promise<ToolResult> {
  const {
    dataset: { selectPuzzles },
    utils: { parseStatus, requireChain, formatPuzzle },
  } = await loadCore();
  const limit = assertLimit(params.limit);
  const offset = assertOffset(params.offset);
  const filtered = await selectPuzzles({
    address:
      params.address === undefined
        ? undefined
        : assertLength("address", params.address, facts.parameters.address),
    chain: requireChain(params.chain),
    collection:
      params.collection === undefined
        ? undefined
        : assertLength("collection", params.collection, facts.parameters.collection),
    status: parseStatus(params.status),
    withPubkey: params.withPubkey,
  });
  const page = filtered.slice(offset, offset + limit);
  const end = offset + page.length;
  const count =
    filtered.length > page.length ? `${page.length} of ${filtered.length}` : `${filtered.length}`;
  const position = offset === 0 ? "" : ` (offset ${offset})`;
  const body = page.length === 0 ? "(none)" : page.map((puzzle) => formatPuzzle(puzzle)).join("\n");
  const lines = [`${count} matching puzzles${position}:`, body];
  const more = end < filtered.length;
  if (more) {
    lines.push(`Next page: offset=${end}. Keep the same filters.`);
  }
  return text(lines.join("\n"), {
    matched: filtered.length,
    returned: page.length,
    offset,
    ...(more ? { nextOffset: end } : {}),
    ids: page.map((puzzle) => puzzle.id()),
  });
}

/**
 * Derives the stored address, loading crypto only after the puzzle is found.
 *
 * @param {string} id - Universal puzzle identifier.
 * @returns {Promise<ToolResult>} The verification outcome for the puzzle.
 */
export async function verifyTool(id: string): Promise<ToolResult> {
  const {
    dataset: { requirePuzzle },
  } = await loadCore();
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const { verifyPuzzle } = await import("./core/verify.ts");
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
  const {
    dataset: { requirePuzzle },
  } = await loadCore();
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const key =
    apiKey === undefined ? undefined : assertLength("apiKey", apiKey, facts.parameters.apiKey);
  const balance = await puzzle.balance({
    apiKey: key ?? globalThis.process?.env["ETHERSCAN_API_KEY"],
  });
  return text(`${puzzle.id()}: ${balance.totalAmount()} on ${balance.chain}`, {
    id: puzzle.id(),
    chain: balance.chain,
    confirmed: balance.confirmed.toString(),
    unconfirmed: balance.unconfirmed.toString(),
    decimals: balance.decimals,
  });
}

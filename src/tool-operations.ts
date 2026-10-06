import { apiKeyVariables } from "./core/balance.ts";
import type { Chain } from "./core/chains.ts";
import type { PuzzleQuery } from "./core/dataset.ts";
import { InvalidArgumentError } from "./core/errors.ts";
import { Status } from "./core/status.ts";
import type { Puzzle } from "./core/puzzle.ts";
import type { AnyCollection } from "./core/registry.ts";
import { oneLine } from "./core/text.ts";
import { type Technique, techniques } from "./core/technique.ts";
import type { RecipeResult, VerifyResult } from "./core/verify.ts";

/** A block of text, what every tool answers with. */
export interface TextBlock {
  type: "text";
  text: string;
}

/** An image as base64 with its MIME type, what `puzzles_assets` answers with for an image file. */
export interface ImageBlock {
  type: "image";
  data: string;
  mimeType: string;
}

/** Result shape shared by the MCP server and the Pi/OMP extensions; `Block` widens for an image. */
export interface ToolResult<Block extends TextBlock | ImageBlock = TextBlock> {
  content: Block[];
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

/**
 * `puzzles_verify` for one id, all a public server offers: a filter there would let one request
 * burn seconds of someone else's CPU.
 */
const verifyById = {
  name: "puzzles_verify",
  title: "Verify Puzzle Key",
  description:
    "Check that a puzzle's recorded key material derives its stored address, and rerun the recipe it holds: BIP39 entropy or a SHA-256 brainwallet.",
  promptSnippet: "Use puzzles_verify to confirm recorded key material before trusting it.",
  promptGuidelines: [
    "An expected failure is a result, not an error.",
    "The recipe gets its own verdict: one that misses is a data bug, even when the key verifies.",
  ],
  openWorld: false,
} as const satisfies ToolFacts;

/** Names, prose, parameter constraints, and status values shared by MCP, Pi, and OMP. */
export const facts = {
  tools: {
    stats: {
      name: "puzzles_stats",
      title: "Puzzle Statistics",
      description:
        "Report totals, status counts, prize sums, and how many puzzles use each technique across every puzzle collection.",
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
        "A collection key is the first segment of a puzzle identifier, for example bits in bits/90.",
      ],
      openWorld: false,
    },
    authors: {
      name: "puzzles_authors",
      title: "Puzzle Authors",
      description:
        "List every puzzle author with its kind, the collections it published and its puzzle count.",
      promptSnippet: "Use puzzles_authors to learn who published which collections.",
      promptGuidelines: [
        "An author key is kebab-case, for example peter-todd; a collection key also resolves to its author.",
      ],
      openWorld: false,
    },
    author: {
      name: "puzzles_author",
      title: "Show Author",
      description:
        "Show one author's record: name, kind, aliases, collections, profiles, addresses, the sourced facts public pages state about them, and how many of their puzzles use each technique.",
      promptSnippet:
        "Use puzzles_author for who is behind a collection and what public sources say about them, with the page that says it.",
      promptGuidelines: [
        "A fact is one sentence a public page states, with that page as its source; it is not a verified biography.",
        "A pseudonymous author is recorded under the handle; the record does not name the person behind it.",
        "The technique counts say what the author tends to reuse; pass one to puzzles_list as technique for the puzzles behind a count.",
      ],
      openWorld: false,
    },
    solvers: {
      name: "puzzles_solvers",
      title: "Puzzle Solvers",
      description:
        "List every named puzzle solver with its kind, the puzzles credited to it and the collections it also published.",
      promptSnippet: "Use puzzles_solvers to learn who solved which puzzles.",
      promptGuidelines: [
        "A solver key is kebab-case, for example retired-coder; a puzzle identifier also resolves to its solver.",
        "A solver known only by the address the prize went to has no key and is not listed.",
      ],
      openWorld: false,
    },
    solver: {
      name: "puzzles_solver",
      title: "Show Solver",
      description:
        "Show one solver's record: name, kind, every solve with its date and prize, profiles, addresses and the sourced facts public pages state about them.",
      promptSnippet:
        "Use puzzles_solver for who solved a puzzle, what else they solved, and what public sources say about them, with the page that says it.",
      promptGuidelines: [
        "A fact is one sentence a public page states, with that page as its source; it is not a verified biography.",
        "A pseudonymous solver is recorded under the handle; the record does not name the person behind it.",
      ],
      openWorld: false,
    },
    show: {
      name: "puzzles_show",
      title: "Show Puzzle",
      description:
        "Show one puzzle's address, status, key material, transactions, techniques, hints, explorer links, and the repository paths of its files.",
      promptSnippet:
        "Use puzzles_show to inspect a single puzzle by identifier, then puzzles_assets to read its files by path instead of downloading them.",
      promptGuidelines: [
        "Identifiers are collection/name, for example bits/90, or gsmg.",
        "More than three increases in a row, each under 1% of the largest transaction, print as one line with their count, dates and total; pass allTransactions for each one with its txid.",
        "A technique says how the key or a stage was built, with the page that says so; an unsolved puzzle has one only where its author stated it.",
      ],
      openWorld: false,
    },
    hints: {
      name: "puzzles_hints",
      title: "Puzzle Hints",
      description:
        "List a puzzle's own and inherited hints with sources, optional confirmations, separately labeled published answers, and the paths of its hint files.",
      promptSnippet:
        "Use puzzles_hints for what the author or the community said about a puzzle before searching for its key.",
      promptGuidelines: [
        "An official hint comes from the puzzle's author; a community hint comes from anyone else and may be wrong.",
        "The source is the published hint. An optional confirmation links to an archive or another publication of that same hint, not general information about the puzzle.",
        "An answer records a published response to one hint, not a verified puzzle solution or key.",
      ],
      openWorld: false,
    },
    stages: {
      name: "puzzles_stages",
      title: "Puzzle Stages",
      description:
        "List the stages of a puzzle that runs in several, in the author's order: what each one shows, the pages and files the author published for it, the paths of the repository copies, and the published answer when somebody solved it.",
      promptSnippet:
        "Use puzzles_stages to walk a multi-stage puzzle step by step and see which steps already have a public answer.",
      promptGuidelines: [
        "A stage's about line describes it and never gives its answer; the answer, when there is one, carries its own source and date.",
        "A stage without an answer is not proven unsolvable, only unsolved in public as far as the record knows.",
      ],
      openWorld: false,
    },
    assets: {
      name: "puzzles_assets",
      title: "Puzzle Files",
      description:
        "List the files a puzzle ships, its image, hint files, solution and stage artifacts, with the size and SHA-256 its record pins, and the repository's reading copies of the pages it cites, or read one of them by path: text comes back as text, an image as an image, and a pinned file only with the bytes the record pins.",
      promptSnippet:
        "Use puzzles_assets to read a puzzle's own files and the archived posts behind its hints and answers, instead of fetching pages that may have changed or vanished.",
      promptGuidelines: [
        "A read tries the repository copy its link names, this release's tag or the commit a checkout or puzzles.agntn.dev runs, then on main for a file merged since, then for a pinned file the author's URL and the archive capture, and returns the first copy whose bytes match the record.",
        "An archived source is a reading copy of a page the record cites, with its transcript and every comment that survived. Its screenshot is a recent render, not the original image, so analyze the puzzle's own files instead.",
        "A file over 3.75 MiB, or neither an image nor UTF-8 text, can't come back inline. The error names the URL to download it from.",
      ],
      openWorld: true,
    },
    list: {
      name: "puzzles_list",
      title: "List Puzzles",
      description:
        "List puzzles filtered by target address, collection, chain, status, technique, and public key availability, in dataset order. When a next offset is returned, pass it as offset with the same filters to continue.",
      promptSnippet:
        "Use puzzles_list to browse puzzles by collection, chain or status, or to find the puzzle an address belongs to.",
      promptGuidelines: [
        "Prefer a collection, chain or status filter over listing everything.",
        "Almost every puzzle is on Bitcoin, so a chain filter is the way to find the few that are not.",
        "Given an address, pass it as address instead of listing the dataset and reading every row. An empty result means no puzzle pays to it, unless the answer names a puzzle the other filters left out.",
        "Follow the next offset with the same filters instead of raising limit and repeating earlier rows.",
        "A technique filter finds the puzzles built the same way, across collections; puzzles_stats counts each technique.",
      ],
      openWorld: false,
    },
    verify: {
      ...verifyById,
      description: `${verifyById.description} Takes one id, or the puzzles_list filters to check every puzzle they match in one call.`,
      promptSnippet:
        "Use puzzles_verify to confirm recorded key material before trusting it, or to replay a whole technique or collection at once.",
      promptGuidelines: [
        ...verifyById.promptGuidelines,
        "Pass id or filters, not both. A filtered answer prints every miss in full and folds the rest into ids per reason, so one call replays a technique such as md5-to-bip39-entropy.",
      ],
    },
    balance: {
      name: "puzzles_balance",
      title: "Puzzle Balance",
      description: "Fetch the current on-chain balance of a puzzle address.",
      promptSnippet: "Use puzzles_balance for the live balance of a puzzle address.",
      promptGuidelines: [
        "This call reaches a public block explorer.",
        "Ethereum reads Blockscout, or Etherscan once apiKey or ETHERSCAN_API_KEY holds its key.",
        "It counts the chain's own coin, so a prize paid in a token such as DAI is not in it.",
      ],
      openWorld: true,
    },
    watch: {
      name: "puzzles_watch",
      title: "Watch Puzzle",
      description:
        "Compare one puzzle with its chain, and with its source page when since is given, and list what the record misses: deposits and spends it doesn't record, an unsolved prize the address no longer holds, a public key a spend showed that the record lacks or spells otherwise, a source page that changed after since.",
      promptSnippet:
        "Use puzzles_watch to check whether a puzzle's record is still current before relying on its prize or transactions.",
      promptGuidelines: [
        "This call reaches a block explorer, and the Wayback Machine when since is given, which can take a minute.",
        "A finding is a difference from the record for a person to review, not an edit: the tool never changes a record.",
        "It reads up to 1000 transactions per address, page by page, and leaves out incoming calls that move no coin. A PARTIAL row names an address with more, whose older transactions went unchecked.",
        "A FAIL row is a check that could not run, so the record is unconfirmed there, not confirmed.",
      ],
      openWorld: true,
    },
    eligibility: {
      name: "puzzles_eligibility",
      title: "Puzzle Eligibility",
      description:
        "Gather what to check before working on a puzzle in one record: identity and source, chain, address and script type, a live read of every prize address with what it received and spent, the status with its evidence, the carriers, what counts as a solution, and every field nobody can fill. Takes an identifier, or an address no record holds.",
      promptSnippet:
        "Use puzzles_eligibility before working on a prize puzzle, instead of assembling the checklist from puzzles_show, puzzles_balance and an explorer.",
      promptGuidelines: [
        "This call reaches a block explorer.",
        "A missing row is a field neither the record nor the explorer fills. It's never guessed, so treat it as unknown.",
        "A conflict row means the record and the chain disagree, such as a prize the addresses no longer hold. puzzles_watch lists the transactions behind it.",
        "An address that fits more than one chain, such as an Ethereum one that also reads on Base, needs chain.",
      ],
      openWorld: true,
    },
  },
  parameters: {
    id: {
      minLength: 1,
      maxLength: 100,
      description: "Universal puzzle identifier, for example bits/90 or gsmg",
    },
    file: {
      minLength: 1,
      maxLength: 200,
      description:
        "Path of one file to read, as the listing prints it, for example assets/gsmg/phase3.txt. Leave it out to list them",
    },
    address: {
      minLength: 1,
      maxLength: 128,
      description:
        "The puzzle paying to this address. Case only matters where the chain says it does, so an EIP-55 Ethereum address and an uppercased bech32 one both resolve",
    },
    chain: { description: "Only puzzles on one blockchain" },
    addressChain: {
      description: "Chain of an address whose format fits more than one, for example base",
    },
    query: {
      minLength: 1,
      maxLength: 128,
      description:
        "Puzzle identifier, for example bits/71, or an address, whether a record holds it or not",
    },
    collection: { minLength: 1, maxLength: 50, description: "Collection key, for example bits" },
    author: {
      minLength: 1,
      maxLength: 50,
      description: "Author key, for example peter-todd, or a collection key such as hash-collision",
    },
    solver: {
      minLength: 1,
      maxLength: 100,
      description: "Solver key, for example retired-coder, or a puzzle identifier such as bits/135",
    },
    status: {
      description:
        "Lifecycle status: unsolved, solved, claimed (prize taken, key unpublished), swept (taken after the public key leaked), or expired (the author took it back)",
    },
    technique: {
      description:
        "Only puzzles built with this technique, by their collection, their record or one of their stages, for example md5-to-bip39-entropy",
    },
    withPubkey: { description: "Only puzzles with a known public key" },
    allTransactions: {
      description:
        "List every transaction with its txid, instead of folding runs of small increases into one line",
    },
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
    since: {
      minLength: 10,
      maxLength: 40,
      description:
        "Also compare the source page's newest Wayback capture with the last one up to this moment, YYYY-MM-DD or ISO 8601, usually the date of the previous check",
    },
    apiKey: {
      maxLength: 200,
      description:
        "Provider API key; Ethereum falls back to ETHERSCAN_API_KEY, Bitcoin Cash, Dogecoin and eCash to BLOCKCHAIR_API_KEY",
    },
  },
  /**
   * Spelled out rather than imported, because `core/chains.ts` pulls in `@agntn/chains` and tool
   * discovery loads this table. `test/unit/tool-schemas.test.ts` pins the list to the library's.
   */
  chains: [
    "arweave",
    "base",
    "bitcoin",
    "bitcoincash",
    "decred",
    "dogecoin",
    "ecash",
    "ethereum",
    "litecoin",
    "monero",
  ],
  statuses: Object.values(Status),
  techniques,
  /** The tools the public server at puzzles.agntn.dev narrows, under the name they keep. */
  publicTools: { verify: verifyById },
} as const satisfies {
  tools: Record<string, ToolFacts>;
  publicTools: Record<string, ToolFacts>;
  parameters: Record<string, object>;
  chains: readonly Chain[];
  statuses: readonly Status[];
  techniques: readonly Technique[];
};

/** Parameters accepted by the list tool. */
export interface ListParams {
  readonly address?: string;
  readonly chain?: string;
  readonly collection?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly status?: string;
  readonly technique?: string;
  readonly withPubkey?: boolean;
}

/** Parameters accepted by the verify tool: one id, or the list filters without paging. */
export interface VerifyParams extends Omit<ListParams, "limit" | "offset"> {
  readonly id?: string;
}

/**
 * The arguments each tool takes, in the order an error names them. The tools without arguments
 * take any object, like their open schemas. `test/unit/tool-schemas.test.ts` pins the table to
 * the schemas.
 */
export const toolArguments = {
  stats: [],
  collections: [],
  authors: [],
  author: ["key"],
  solvers: [],
  solver: ["key"],
  show: ["id", "allTransactions"],
  hints: ["id"],
  stages: ["id"],
  assets: ["id", "file"],
  list: [
    "address",
    "chain",
    "collection",
    "limit",
    "offset",
    "status",
    "technique",
    "withPubkey",
  ] satisfies (keyof ListParams)[],
  verify: [
    "id",
    "address",
    "chain",
    "collection",
    "status",
    "technique",
    "withPubkey",
  ] satisfies (keyof VerifyParams)[],
  balance: ["id", "apiKey"],
  watch: ["id", "since", "apiKey"],
  eligibility: ["query", "chain", "apiKey"],
} as const satisfies Record<keyof typeof facts.tools, readonly string[]>;

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
 * Rejects a flag that isn't a boolean, so `"true"` doesn't quietly read as false.
 *
 * @param {string} argument - Name of the flag.
 * @param {boolean | undefined} value - The flag the caller passed, when it passed one.
 * @returns {boolean} The flag, or false when it was left out.
 */
function assertFlag(argument: string, value: boolean | undefined): boolean {
  if (value === undefined) return false;
  if (typeof value !== "boolean") {
    throw new InvalidArgumentError(argument, "expected true or false");
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
 * Rejects an argument the tool does not declare, so a host that skips schema validation still
 * refuses `with_pubkey` instead of listing every puzzle as if the filter held. The Pi and OMP
 * wrappers call it before they pick their arguments out of the object.
 *
 * @param {keyof typeof toolArguments} tool - The tool's short name, such as `show`.
 * @param {unknown} params - The arguments the caller passed.
 */
export function assertArguments(tool: keyof typeof toolArguments, params: unknown): void {
  const known: readonly string[] = toolArguments[tool];
  if (known.length === 0) {
    return;
  }
  if (typeof params !== "object" || params === null || Array.isArray(params)) {
    throw new InvalidArgumentError("arguments", "expected an object");
  }
  const unknown = Object.keys(params).find((key) => !known.includes(key));
  if (unknown !== undefined) {
    throw new InvalidArgumentError(
      "arguments",
      `unknown property ${JSON.stringify(unknown)}, expected one of ${known.join(", ")}`,
    );
  }
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
    utils: { countOf, formatPrizeTotals, formatTechniqueCounts },
  } = await loadCore();
  const [result, version] = await Promise.all([stats(), dataVersion()]);
  const lines = [
    `Total: ${countOf(result.total, "puzzle")} in ${countOf(collectionKeys().length, "collection")}`,
    `Solved: ${result.solved}  Unsolved: ${result.unsolved}  Claimed: ${result.claimed}  Swept: ${result.swept}  Expired: ${result.expired}`,
    `With public key: ${result.with_pubkey}`,
    `Total prize: ${formatPrizeTotals(result.total_prize)}`,
    `Unsolved prize: ${formatPrizeTotals(result.unsolved_prize)}`,
    `Techniques: ${formatTechniqueCounts(result.techniques)}`,
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
 * Lists every author with its collections, the same rows the CLI prints.
 *
 * @returns {Promise<ToolResult>} One line per author, with the entries in `details`.
 */
export async function authorsTool(): Promise<ToolResult> {
  const {
    dataset: { authors },
    utils: { formatAuthor },
  } = await loadCore();
  const entries = await authors();
  return text(entries.map(formatAuthor).join("\n"), { authors: entries });
}

/**
 * One author's complete record for a model.
 *
 * @param {string} key - Author key, or a collection key.
 * @returns {Promise<ToolResult>} The record as text, with the author entry in `details`.
 */
export async function authorTool(key: string): Promise<ToolResult> {
  const {
    dataset: { getAuthor, requireAuthor },
    registry: { getCollection },
    utils: { formatAuthorRecord },
  } = await loadCore();
  const wanted = assertLength("key", key, facts.parameters.author);
  const byCollection =
    (await getAuthor(wanted)) === undefined ? await getCollection(wanted) : undefined;
  const entry = await requireAuthor(byCollection?.author.key ?? wanted);
  return text(formatAuthorRecord(entry), { author: entry });
}

/**
 * Lists every named solver with its solves, the same rows the CLI prints.
 *
 * @returns {Promise<ToolResult>} One line per solver, with the entries in `details`.
 */
export async function solversTool(): Promise<ToolResult> {
  const {
    dataset: { solvers },
    utils: { formatSolver },
  } = await loadCore();
  const entries = await solvers();
  return text(entries.map(formatSolver).join("\n"), { solvers: entries });
}

/**
 * One solver's complete record for a model.
 *
 * @param {string} key - Solver key, or a puzzle identifier.
 * @returns {Promise<ToolResult>} The record as text, with the solver entry in `details`.
 */
export async function solverTool(key: string): Promise<ToolResult> {
  const {
    dataset: { requireSolver, resolveSolverKey },
    utils: { formatSolverRecord },
  } = await loadCore();
  const wanted = assertLength("key", key, facts.parameters.solver);
  const entry = await requireSolver(await resolveSolverKey(wanted));
  return text(formatSolverRecord(entry), { solver: entry });
}

/**
 * Sends a model to `puzzles_assets`, which hands back only the bytes the record pins.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {AnyCollection} collection - Its collection, whose hints cite archived sources too.
 * @returns {Promise<string[]>} The line, or nothing when the puzzle has no file to read.
 */
async function filesLine(puzzle: Puzzle, collection: AnyCollection): Promise<string[]> {
  const {
    utils: { countOf },
  } = await loadCore();
  const { citedArchivedSources } = await import("./core/archived-sources.ts");
  const shipped = puzzle.assetLinks().length;
  const sources = citedArchivedSources(puzzle, collection).length;
  if (shipped + sources === 0) {
    return [];
  }
  const counts = `${countOf(shipped, "file")}, ${countOf(sources, "archived source")}`;
  return [`files: ${counts}; ${facts.tools.assets.name} lists them and reads one by its path`];
}

/**
 * A report with the `files` line under it, even under a bare `no hints recorded`.
 *
 * @param {readonly string[]} report - The header, then the lines under it.
 * @param {Puzzle} puzzle - The puzzle.
 * @param {AnyCollection} collection - Its collection.
 * @returns {Promise<string>} The answer text.
 */
async function withFilesLine(
  report: readonly string[],
  puzzle: Puzzle,
  collection: AnyCollection,
): Promise<string> {
  return [...report, ...(await filesLine(puzzle, collection))].join("\n");
}

/**
 * One puzzle's complete record for a model.
 *
 * @param {string} id - Universal puzzle identifier.
 * @param {boolean} [allTransactions] - List every transaction instead of folding the dust.
 * @returns {Promise<ToolResult>} The record as text; the puzzle, its hints and techniques in `details`.
 */
export async function showTool(id: string, allTransactions?: boolean): Promise<ToolResult> {
  const {
    dataset: { requirePuzzle },
    registry: { requireCollection },
    utils: { formatPuzzleRecord },
  } = await loadCore();
  const every = assertFlag("allTransactions", allTransactions);
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const collection = await requireCollection(puzzle.collection());
  const record = formatPuzzleRecord(puzzle, collection.hints, collection.techniques, every, "path");
  return text(await withFilesLine([record], puzzle, collection), {
    puzzle,
    hints: collection.hintsById(puzzle.id()),
    techniques: collection.techniquesById(puzzle.id()),
  });
}

/**
 * The stages of one puzzle in the author's order, as `puzzles_show` prints them.
 *
 * @param {string} id - Universal puzzle identifier.
 * @returns {Promise<ToolResult>} The stages as text, with the stage list in `details`.
 */
export async function stagesTool(id: string): Promise<ToolResult> {
  const {
    dataset: { requirePuzzle },
    registry: { requireCollection },
    utils: { formatStageReport },
  } = await loadCore();
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const collection = await requireCollection(puzzle.collection());
  return text(await withFilesLine(formatStageReport(puzzle, "path"), puzzle, collection), {
    id: puzzle.id(),
    stages: puzzle.stages(),
  });
}

/**
 * The files of one puzzle and the reading copies of the pages it cites, or one of them read.
 *
 * @param {string} id - Universal puzzle identifier.
 * @param {string} [file] - The path of the file to read; without it, the listing.
 * @returns {Promise<ToolResult>} The listing as text, or the read line and the file's own block.
 * @throws {InvalidArgumentError} When the path is not one the listing prints.
 */
export async function assetsTool(
  id: string,
  file?: string,
): Promise<ToolResult<TextBlock | ImageBlock>> {
  const {
    dataset: { requirePuzzle },
    registry: { requireCollection },
  } = await loadCore();
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const wanted = file === undefined ? undefined : assertLength("file", file, facts.parameters.file);
  const { citedArchivedSources } = await import("./core/archived-sources.ts");
  const { fileBlock, formatFileRead, formatFileReport, puzzleFiles, readPuzzleFile } =
    await import("./core/files.ts");
  const collection = await requireCollection(puzzle.collection());
  const files = puzzleFiles(puzzle.assetLinks(), citedArchivedSources(puzzle, collection));
  if (wanted === undefined) {
    return text(formatFileReport(puzzle.id(), files).join("\n"), { id: puzzle.id(), files });
  }
  const target = files.find((candidate) => candidate.path === wanted);
  if (target === undefined) {
    throw new InvalidArgumentError(
      "file",
      `${oneLine(JSON.stringify(wanted))} is not a file of ${puzzle.id()}; call ${facts.tools.assets.name} without file for the list`,
    );
  }
  const content = await readPuzzleFile(target);
  return {
    content: [{ type: "text", text: formatFileRead(content) }, fileBlock(content)],
    details: {
      id: puzzle.id(),
      file: target,
      bytes: content.data.length,
      sha256: content.sha256,
      servedBy: content.servedBy,
    },
  };
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
  const report = formatHintReport(puzzle, collection.hints, "path");
  return text(await withFilesLine(report, puzzle, collection), {
    id: puzzle.id(),
    hints: collection.hintsById(puzzle.id()),
    hintAssets: hintAssets(puzzle),
  });
}

/** A puzzle an address lookup found but the other filters left out, with the filters that did. */
interface OutsideMatch {
  readonly id: string;
  readonly filters: readonly string[];
}

/**
 * Explains an empty address lookup. An address belongs to one puzzle or very few, so looking it
 * up again without the other filters adds a line or two, and it tells "no puzzle pays here"
 * apart from "the collection, chain, status, technique or key filter dropped the one that does".
 *
 * @param {PuzzleQuery} query - The list query, already validated, with its address.
 * @returns {Promise<{ lines: string[]; outside: OutsideMatch[] }>} One sentence per dropped puzzle.
 */
async function outsideFilters(
  query: PuzzleQuery,
): Promise<{ lines: string[]; outside: OutsideMatch[] }> {
  const {
    dataset: { selectPuzzles },
    registry: { requireCollection },
  } = await loadCore();
  const collection =
    query.collection === undefined ? undefined : (await requireCollection(query.collection)).key;
  const expected = { collection, chain: query.chain, status: query.status };
  const lines: string[] = [];
  const outside: OutsideMatch[] = [];
  for (const puzzle of await selectPuzzles({ address: query.address })) {
    const actual = {
      collection: puzzle.collection(),
      chain: puzzle.chain(),
      status: puzzle.status(),
    };
    const reasons = Object.entries(expected)
      .filter(
        ([filter, value]) => value !== undefined && actual[filter as keyof typeof actual] !== value,
      )
      .map(([filter, value]): [string, string] => [
        filter,
        `its ${filter} is ${actual[filter as keyof typeof actual]} (not ${value})`,
      ]);
    if (query.withPubkey === true && !puzzle.hasPubkey()) {
      reasons.push(["withPubkey", "it has no public key recorded"]);
    }
    const { technique } = query;
    const tags = (await requireCollection(puzzle.collection())).techniquesById(puzzle.id());
    if (technique !== undefined && !tags.some((tag) => tag.name === technique)) {
      reasons.push(["technique", `it records no ${technique} technique`]);
    }
    lines.push(
      `${puzzle.id()} pays to this address, but ${reasons.map(([, reason]) => reason).join(" and ")}.`,
    );
    outside.push({ id: puzzle.id(), filters: reasons.map(([filter]) => filter) });
  }
  return { lines, outside };
}

/**
 * Checks the list filters the way the schema declares them and turns them into a dataset query.
 *
 * @param {ListParams} params - Tool parameters as the host sent them.
 * @returns {Promise<PuzzleQuery>} The query `selectPuzzles` takes.
 */
async function listQuery(params: ListParams): Promise<PuzzleQuery> {
  const {
    utils: { parseStatus, parseTechnique, requireChain },
  } = await loadCore();
  return {
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
    technique: parseTechnique(params.technique),
    withPubkey: params.withPubkey,
  };
}

/**
 * Lists puzzles filtered by collection, status, and public key availability. An address the
 * other filters ruled out names the puzzle it belongs to, so an empty page never reads as an
 * address the dataset does not know.
 *
 * @param {ListParams} params - Validated tool parameters.
 * @returns {Promise<ToolResult>} One page, with a next offset only when more matches remain.
 */
export async function listTool(params: ListParams): Promise<ToolResult> {
  const {
    dataset: { selectPuzzles },
    utils: { formatPuzzle },
  } = await loadCore();
  assertArguments("list", params);
  const limit = assertLimit(params.limit);
  const offset = assertOffset(params.offset);
  const query = await listQuery(params);
  const filtered = await selectPuzzles(query);
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
  const { lines: notes, outside } =
    filtered.length === 0 && query.address !== undefined
      ? await outsideFilters(query)
      : { lines: [], outside: [] };
  return text([...lines, ...notes].join("\n"), {
    matched: filtered.length,
    returned: page.length,
    offset,
    ...(more ? { nextOffset: end } : {}),
    ids: page.map((puzzle) => puzzle.id()),
    ...(outside.length > 0 ? { outside } : {}),
  });
}

/**
 * Derives the stored address of one puzzle, or of every puzzle the list filters match, loading
 * crypto only after the puzzles are found.
 *
 * @param {string | VerifyParams} query - A puzzle identifier, or `{ id }`, or the list filters.
 * @returns {Promise<ToolResult>} One outcome, or a summary that prints every miss in full.
 * @throws {InvalidArgumentError} On an id with filters, on neither, or on filters nothing matches.
 */
export async function verifyTool(query: string | VerifyParams): Promise<ToolResult> {
  const params: VerifyParams = typeof query === "string" ? { id: query } : query;
  assertArguments("verify", params);
  const { id, withPubkey, ...rest } = params;
  const filtered =
    assertFlag("withPubkey", withPubkey) ||
    Object.values(rest).some((value) => value !== undefined);
  if (id !== undefined && filtered) {
    throw new InvalidArgumentError("id", "pass a puzzle identifier or filters, not both");
  }
  if (id !== undefined) {
    return verifyOne(id);
  }
  if (!filtered) {
    throw new InvalidArgumentError("id", "pass a puzzle identifier, or a filter such as technique");
  }
  return verifyMany(await listQuery(params));
}

/**
 * One puzzle's verdict, the answer `puzzles_verify` has always given for an id.
 *
 * @param {string} id - Universal puzzle identifier.
 * @returns {Promise<ToolResult>} The verdict and the recipe's, with the result in `details`.
 */
async function verifyOne(id: string): Promise<ToolResult> {
  const {
    dataset: { requirePuzzle },
  } = await loadCore();
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const { verify } = await import("./core/verify.ts");
  const result = await verify(puzzle);
  return text(verdictOf(result), { ...result });
}

/**
 * Every matching puzzle's verdict. A miss gets its full lines; the rest fold into id lists, so a
 * replay of a hundred clean seeds stays a few lines long.
 *
 * @param {PuzzleQuery} query - The list filters, already validated.
 * @returns {Promise<ToolResult>} The counts, the misses and the folded ids, every result in `details`.
 * @throws {InvalidArgumentError} When the filters match no puzzle.
 */
async function verifyMany(query: PuzzleQuery): Promise<ToolResult> {
  const {
    dataset: { selectPuzzles },
    utils: { countOf },
  } = await loadCore();
  const puzzles = await selectPuzzles(query);
  if (puzzles.length === 0) {
    throw new InvalidArgumentError("filters", "no puzzle matches them, so nothing was verified");
  }
  const { verify } = await import("./core/verify.ts");
  const results = await Promise.all(puzzles.map((puzzle) => verify(puzzle)));
  const misses = results.filter(missed);
  const clean = results.filter((result) => !missed(result));
  const verified = clean.filter((result) => result.verified).map((result) => result.id);
  const unverifiable = Map.groupBy(
    clean.filter((result) => !result.verified),
    (result) => result.error ?? "",
  );
  const idle = Map.groupBy(
    clean.filter((result) => result.recipe?.unavailable === true),
    (result) => result.recipe?.error ?? "",
  );
  const lines = [
    `${countOf(results.length, "puzzle")}: ${tally(results)}`,
    ...misses.map(verdictOf),
    ...folded("Unverifiable", unverifiable),
    ...folded("Recipe can't run", idle),
    ...(verified.length === 0 ? [] : [`Verified: ${verified.join(", ")}`]),
  ];
  return text(lines.join("\n"), { matched: results.length, misses: misses.length, results });
}

/**
 * A key or a recipe that ran and derived another address: a data bug, so the batch prints it whole.
 *
 * @param {VerifyResult} result - One puzzle's outcome.
 * @returns {boolean} Whether the batch prints it in full.
 */
function missed(result: VerifyResult): boolean {
  const key = !result.verified && !result.unavailable;
  const { recipe } = result;
  return key || (recipe !== undefined && !recipe.verified && !recipe.unavailable);
}

/**
 * One line per reason, with the ids that share it.
 *
 * @param {string} label - What the ids have in common, such as `Unverifiable`.
 * @param {ReadonlyMap<string, readonly VerifyResult[]>} groups - The results by reason.
 * @returns {string[]} The folded lines, in the order the reasons first came up.
 */
function folded(label: string, groups: ReadonlyMap<string, readonly VerifyResult[]>): string[] {
  return [...groups].map(
    ([reason, group]) => `${label} (${reason}): ${group.map((result) => result.id).join(", ")}`,
  );
}

/**
 * The counts line of a batch: keys first, then recipes when any puzzle holds one.
 *
 * @param {readonly VerifyResult[]} results - Every outcome of the batch.
 * @returns {string} The counts, zeros included, so a clean replay says so.
 */
function tally(results: readonly VerifyResult[]): string {
  const count = (test: (result: VerifyResult) => boolean): number => results.filter(test).length;
  const keys = [
    `${count((r) => r.verified)} verified`,
    `${count((r) => !r.verified && !r.unavailable)} not verified`,
    `${count((r) => !r.verified && r.unavailable)} unverifiable`,
  ];
  const recipes = results.flatMap((r) => (r.recipe === undefined ? [] : [r.recipe]));
  if (recipes.length === 0) {
    return keys.join(", ");
  }
  const rerun = [
    `${recipes.filter((r) => r.verified).length} derive their address`,
    `${recipes.filter((r) => !r.verified && !r.unavailable).length} miss`,
    `${recipes.filter((r) => r.unavailable).length} can't run`,
  ];
  const noun = recipes.length === 1 ? "recipe" : "recipes";
  return `${keys.join(", ")}; ${recipes.length} ${noun}: ${rerun.join(", ")}`;
}

/**
 * One puzzle's verdict, then its recipe's on a second line.
 *
 * @param {VerifyResult} result - The puzzle's outcome.
 * @returns {string} The lines `puzzles_verify` prints for it.
 */
function verdictOf(result: VerifyResult): string {
  const summary = result.verified
    ? `${result.id}: verified, derives ${result.derivedAddress}`
    : result.unavailable
      ? `${result.id}: unverifiable (${result.error})`
      : `${result.id}: not verified (${result.error})`;
  return summary + recipeSummary(result.recipe);
}

/**
 * The recipe's half of a verify answer, so a recipe that misses reads as its own data bug.
 *
 * @param {RecipeResult | undefined} recipe - The rerun recipe, when the record holds one.
 * @returns {string} A second line, or nothing for a record without a recipe.
 */
function recipeSummary(recipe: RecipeResult | undefined): string {
  if (recipe === undefined) {
    return "";
  }
  const path = recipe.path === undefined ? "" : ` at ${recipe.path}`;
  const outcome = recipe.verified
    ? `derives ${recipe.derivedAddress}`
    : recipe.unavailable
      ? `can't run (${recipe.error})`
      : `misses, a data bug in the record (${recipe.error})`;
  return `\nRecipe ${recipe.recipe}${path}: ${outcome}`;
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
    utils: { formatBalance },
  } = await loadCore();
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const balance = await puzzle.balance({ apiKey: keyFor(puzzle.chain(), apiKey) });
  return text(`${puzzle.id()}: ${formatBalance(balance)}`, {
    id: puzzle.id(),
    chain: balance.chain,
    confirmed: balance.confirmed.toString(),
    unconfirmed: balance.unconfirmed.toString(),
    decimals: balance.decimals,
  });
}

/**
 * The key for one puzzle's lookups: the caller's, or the variable its chain reads one from.
 *
 * @param {Chain} chain - Chain of the puzzle.
 * @param {string | undefined} apiKey - The key the caller passed, when any.
 * @returns {string | undefined} The key, already checked against the length limits.
 */
function keyFor(chain: Chain, apiKey: string | undefined): string | undefined {
  const key =
    apiKey === undefined ? undefined : assertLength("apiKey", apiKey, facts.parameters.apiKey);
  const variable = apiKeyVariables[chain];
  return key ?? (variable === undefined ? undefined : globalThis.process?.env[variable]);
}

/**
 * Compares one puzzle with its chain, and its source page when `since` is given. A failed lookup
 * is a `FAIL` row beside the rest, so a partial answer never reads as clean.
 *
 * @param {string} id - Universal puzzle identifier.
 * @param {string} [since] - Cutoff for the source page check.
 * @param {string} [apiKey] - Provider API key, when the chain needs one.
 * @returns {Promise<ToolResult>} A summary line and the report rows, with the report in `details`.
 */
export async function watchTool(id: string, since?: string, apiKey?: string): Promise<ToolResult> {
  const {
    dataset: { requirePuzzle },
  } = await loadCore();
  const puzzle = await requirePuzzle(assertLength("id", id, facts.parameters.id));
  const cutoff =
    since === undefined ? undefined : assertLength("since", since, facts.parameters.since);
  const { formatWatchReport, watcher } = await import("./core/watch.ts");
  const report = await watcher({ since: cutoff })(puzzle, keyFor(puzzle.chain(), apiKey));
  const { findings, errors } = report;
  const counts = [
    `${findings.length} ${findings.length === 1 ? "difference" : "differences"} from the record`,
    ...(errors.length === 0
      ? []
      : [`${errors.length} ${errors.length === 1 ? "check" : "checks"} failed`]),
  ];
  const lines = [
    `${puzzle.id()}: ${counts.join(", ")}`,
    ...formatWatchReport(report),
    ...(cutoff === undefined
      ? ["Source page not checked; pass since to compare its archive captures."]
      : []),
  ];
  return text(lines.join("\n"), {
    id: report.id,
    chain: report.chain,
    findings: findings.map((finding) =>
      finding.kind === "balance"
        ? { ...finding, balance: finding.balance.toString() }
        : finding.kind === "source" || finding.kind === "pubkey"
          ? finding
          : { ...finding, amount: finding.amount.toString() },
    ),
    errors,
    truncated: report.truncated,
  });
}

/**
 * Builds the eligibility record of a puzzle or an address, with a `missing` row per unknown field.
 *
 * @param {string} query - Puzzle identifier or address.
 * @param {string} [chain] - Chain of an address whose format fits more than one.
 * @param {string} [apiKey] - Provider API key, when the chain needs one.
 * @returns {Promise<ToolResult>} A summary line and the record rows, with the record in `details`.
 */
export async function eligibilityTool(
  query: string,
  chain?: string,
  apiKey?: string,
): Promise<ToolResult> {
  const checked = assertLength("query", query, facts.parameters.query);
  const key =
    apiKey === undefined ? undefined : assertLength("apiKey", apiKey, facts.parameters.apiKey);
  const { eligibility, formatEligibility } = await import("./core/eligibility.ts");
  const record = await eligibility(checked, {
    apiKey: key,
    apiKeyFor: (resolved) => keyFor(resolved, undefined),
    chain,
  });
  const { missing } = record;
  const summary =
    missing.length === 0
      ? "complete"
      : `${missing.length} ${missing.length === 1 ? "field" : "fields"} missing`;
  return text(
    [`${record.id ?? record.address}: ${summary}`, ...formatEligibility(record)].join("\n"),
    {
      ...record,
      live: record.live.map((state) => ({
        ...state,
        confirmed: state.confirmed.toString(),
        unconfirmed: state.unconfirmed.toString(),
        ...(state.funded === undefined ? {} : { funded: state.funded.toString() }),
        ...(state.spent === undefined ? {} : { spent: state.spent.toString() }),
      })),
    },
  );
}

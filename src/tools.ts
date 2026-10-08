/** The puzzle tools, declared once for MCP, Pi and OMP. The dataset loads on the first call. */

import { defineTool, Type, type TProperties, type ToolDefinition } from "@agntn/tools";
import {
  assetsTool,
  authorsTool,
  authorTool,
  balanceTool,
  collectionsTool,
  eligibilityTool,
  facts,
  hintsTool,
  listTool,
  showTool,
  solversTool,
  solverTool,
  stagesTool,
  statsTool,
  verifyTool,
  watchTool,
  type ToolFacts,
} from "./tool-operations.ts";

const { chains, parameters, statuses, techniques } = facts;
const puzzleId = Type.String(parameters.id);

/**
 * A closed object refuses a stray `with_pubkey` instead of listing every puzzle unfiltered.
 *
 * @param {T} properties - The tool's parameters.
 * @returns {ReturnType<typeof Type.Object<T>>} An object schema that takes no other key.
 */
function closed<T extends TProperties>(properties: T) {
  return Type.Object(properties, { additionalProperties: false });
}

/**
 * The fields every definition takes from the facts table.
 *
 * @param {ToolFacts} tool - The tool's entry in `facts.tools`.
 * @returns {object} The name, prose and effect for `defineTool`.
 */
function described(tool: ToolFacts) {
  return {
    name: tool.name,
    title: tool.title,
    description: tool.description,
    snippet: tool.promptSnippet,
    guidelines: tool.promptGuidelines,
    effect: "read",
    openWorld: tool.openWorld,
  } as const;
}

export const statsToolDefinition = defineTool({
  ...described(facts.tools.stats),
  input: Type.Object({}),
  cli: { description: "Print aggregate statistics for every collection" },
  execute: () => statsTool(),
});

export const collectionsToolDefinition = defineTool({
  ...described(facts.tools.collections),
  input: Type.Object({}),
  cli: { description: "List every registered collection" },
  execute: () => collectionsTool(),
});

export const authorsToolDefinition = defineTool({
  ...described(facts.tools.authors),
  input: Type.Object({}),
  execute: () => authorsTool(),
});

export const authorToolDefinition = defineTool({
  ...described(facts.tools.author),
  input: closed({ key: Type.String(parameters.author) }),
  execute: (params) => authorTool(params.key),
});

export const solversToolDefinition = defineTool({
  ...described(facts.tools.solvers),
  input: Type.Object({}),
  execute: () => solversTool(),
});

export const solverToolDefinition = defineTool({
  ...described(facts.tools.solver),
  input: closed({ key: Type.String(parameters.solver) }),
  execute: (params) => solverTool(params.key),
});

export const showToolDefinition = defineTool({
  ...described(facts.tools.show),
  input: closed({
    id: puzzleId,
    allTransactions: Type.Optional(Type.Boolean(parameters.allTransactions)),
  }),
  execute: (params) => showTool(params.id, params.allTransactions),
});

export const hintsToolDefinition = defineTool({
  ...described(facts.tools.hints),
  input: closed({ id: puzzleId }),
  execute: (params) => hintsTool(params.id),
});

export const stagesToolDefinition = defineTool({
  ...described(facts.tools.stages),
  input: closed({ id: puzzleId }),
  execute: (params) => stagesTool(params.id),
});

export const assetsToolDefinition = defineTool({
  ...described(facts.tools.assets),
  input: closed({ id: puzzleId, file: Type.Optional(Type.String(parameters.file)) }),
  execute: (params) => assetsTool(params.id, params.file),
});

/** The filters `puzzles_list` and `puzzles_verify` share. */
const filters = {
  address: Type.Optional(Type.String(parameters.address)),
  collection: Type.Optional(Type.String(parameters.collection)),
  chain: Type.Optional(Type.Enum(chains, parameters.chain)),
  status: Type.Optional(Type.Enum(statuses, parameters.status)),
  technique: Type.Optional(Type.Enum(techniques, parameters.technique)),
  withPubkey: Type.Optional(Type.Boolean(parameters.withPubkey)),
};

export const listToolDefinition = defineTool({
  ...described(facts.tools.list),
  input: closed({
    ...filters,
    limit: Type.Optional(Type.Integer(parameters.limit)),
    offset: Type.Optional(Type.Integer(parameters.offset)),
  }),
  execute: (params) => listTool(params),
});

export const verifyToolDefinition = defineTool({
  ...described(facts.tools.verify),
  input: closed({ id: Type.Optional(puzzleId), ...filters }),
  execute: (params) => verifyTool(params),
});

export const balanceToolDefinition = defineTool({
  ...described(facts.tools.balance),
  input: closed({ id: puzzleId, apiKey: Type.Optional(Type.String(parameters.apiKey)) }),
  execute: (params) => balanceTool(params.id, params.apiKey),
});

export const watchToolDefinition = defineTool({
  ...described(facts.tools.watch),
  input: closed({
    id: puzzleId,
    since: Type.Optional(Type.String(parameters.since)),
    apiKey: Type.Optional(Type.String(parameters.apiKey)),
  }),
  execute: (params) => watchTool(params.id, params.since, params.apiKey),
});

export const eligibilityToolDefinition = defineTool({
  ...described(facts.tools.eligibility),
  input: closed({
    query: Type.String(parameters.query),
    chain: Type.Optional(Type.Enum(chains, parameters.addressChain)),
    apiKey: Type.Optional(Type.String(parameters.apiKey)),
  }),
  execute: (params) => eligibilityTool(params.query, params.chain, params.apiKey),
});

/** `puzzles_verify` on the public server: one id per call, never a filter. */
export const publicVerifyToolDefinition = defineTool({
  ...described(facts.publicTools.verify),
  input: closed({ id: puzzleId }),
  execute: (params) => verifyTool(params.id),
});

/** Every puzzle tool, in the order `tools/list` and the harnesses show them. */
export const puzzlesTools: readonly ToolDefinition[] = [
  statsToolDefinition,
  collectionsToolDefinition,
  authorsToolDefinition,
  authorToolDefinition,
  solversToolDefinition,
  solverToolDefinition,
  showToolDefinition,
  hintsToolDefinition,
  stagesToolDefinition,
  assetsToolDefinition,
  listToolDefinition,
  verifyToolDefinition,
  balanceToolDefinition,
  watchToolDefinition,
  eligibilityToolDefinition,
];

/**
 * The filters a status line shows for a list or a filtered verify, `all` when there are none.
 *
 * @param {Readonly<Record<string, unknown>>} args - The call's arguments.
 * @returns {string} The address, collection or chain, then the status and technique.
 */
function listSummary(args: Readonly<Record<string, unknown>>): string {
  return [
    args["address"] ?? args["collection"] ?? args["chain"] ?? "all",
    args["status"],
    args["technique"],
  ]
    .filter((part) => part !== undefined)
    .map((part) => (typeof part === "string" ? part : JSON.stringify(part)))
    .join(" ");
}

/** The tools the public server at puzzles.agntn.dev serves, with `puzzles_verify` held to one id. */
export const publicPuzzlesTools: readonly ToolDefinition[] = puzzlesTools.map((tool) =>
  tool === verifyToolDefinition ? publicVerifyToolDefinition : tool,
);

/** The argument a status line shows after the tool title, for the tools that take one. */
export const callSummaries: Readonly<
  Record<string, (args: Readonly<Record<string, unknown>>) => unknown>
> = {
  [facts.tools.author.name]: (args) => args["key"],
  [facts.tools.solver.name]: (args) => args["key"],
  [facts.tools.show.name]: (args) => args["id"],
  [facts.tools.hints.name]: (args) => args["id"],
  [facts.tools.stages.name]: (args) => args["id"],
  [facts.tools.assets.name]: (args) => args["file"] ?? args["id"],
  [facts.tools.list.name]: listSummary,
  [facts.tools.verify.name]: (args) => args["id"] ?? listSummary(args),
  [facts.tools.balance.name]: (args) => args["id"],
  [facts.tools.watch.name]: (args) => args["id"],
  [facts.tools.eligibility.name]: (args) => args["query"],
};

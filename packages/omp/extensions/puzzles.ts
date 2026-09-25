import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { stripVTControlCharacters } from "node:util";

import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

import type * as ToolsModule from "../../../src/tool-operations.ts";

const sourceModulePath = fileURLToPath(new URL("../../../src/tool-operations.ts", import.meta.url));

/**
 * Loads the tool executors shared with MCP and Pi. Both specifiers stay literal so OMP's compiled
 * loader, which rewrites only what it can see, keeps the dependencies.
 *
 * @returns {Promise<typeof ToolsModule>} The executors.
 */
function loadTools(): Promise<typeof ToolsModule> {
  return (
    existsSync(sourceModulePath)
      ? import("../../../src/tool-operations.ts")
      : import("../../../dist/tool-operations.mjs")
  ) as Promise<typeof ToolsModule>;
}

/**
 * One line of plain text for the terminal. Model arguments can carry ANSI escapes, raw control
 * bytes and Unicode separators, and the Text component passes them through, so they go. String()
 * first, because hostile JSON ignores the declared types.
 *
 * @param {unknown} value - The value to record.
 * @returns {string} The value as one line of plain text.
 */
function sanitizeTerminalText(value: unknown): string {
  return stripVTControlCharacters(String(value))
    .replaceAll(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, " ")
    .replaceAll(/\s+/gu, " ")
    .trim();
}

function registration(tool: ToolsModule.ToolFacts): {
  name: string;
  label: string;
  description: string;
  approval: "read";
  loadMode: "essential";
} {
  return {
    name: tool.name,
    label: tool.title,
    description: tool.description,
    approval: "read",
    loadMode: "essential",
  };
}

/**
 * Registers crypto puzzle and bounty data tools in OMP.
 *
 * @param {ExtensionAPI} pi - The host extension API.
 */
export default async function puzzlesExtension(pi: ExtensionAPI): Promise<void> {
  /** OMP validates with its own TypeBox build, so the schemas come from the host facade. */
  const { Type } = pi.typebox;
  const { Text } = pi.pi;
  pi.setLabel("Puzzles");

  const tools = await loadTools();
  const { chains, parameters, statuses } = tools.facts;
  const puzzleId = Type.String(parameters.id);
  const line = (text: string) => new Text(sanitizeTerminalText(text), 0, 0);

  pi.registerTool({
    ...registration(tools.facts.tools.stats),
    parameters: Type.Object({}),
    renderCall() {
      return line("Puzzle statistics");
    },
    async execute() {
      return tools.statsTool();
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.collections),
    parameters: Type.Object({}),
    renderCall() {
      return line("Puzzle collections");
    },
    async execute() {
      return tools.collectionsTool();
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.authors),
    parameters: Type.Object({}),
    renderCall() {
      return line("Puzzle authors");
    },
    async execute() {
      return tools.authorsTool();
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.author),
    parameters: Type.Object({ key: Type.String(parameters.author) }),
    renderCall(args) {
      return line(`Show author ${args.key}`);
    },
    async execute(_toolCallId, params) {
      return tools.authorTool(params.key);
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.solvers),
    parameters: Type.Object({}),
    renderCall() {
      return line("Puzzle solvers");
    },
    async execute() {
      return tools.solversTool();
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.solver),
    parameters: Type.Object({ key: Type.String(parameters.solver) }),
    renderCall(args) {
      return line(`Show solver ${args.key}`);
    },
    async execute(_toolCallId, params) {
      return tools.solverTool(params.key);
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.show),
    parameters: Type.Object({ id: puzzleId }),
    renderCall(args) {
      return line(`Show puzzle ${args.id}`);
    },
    async execute(_toolCallId, params) {
      return tools.showTool(params.id);
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.hints),
    parameters: Type.Object({ id: puzzleId }),
    renderCall(args) {
      return line(`Hints for puzzle ${args.id}`);
    },
    async execute(_toolCallId, params) {
      return tools.hintsTool(params.id);
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.list),
    parameters: Type.Object({
      address: Type.Optional(Type.String(parameters.address)),
      collection: Type.Optional(Type.String(parameters.collection)),
      chain: Type.Optional(Type.Enum(chains, parameters.chain)),
      status: Type.Optional(Type.Enum(statuses, parameters.status)),
      withPubkey: Type.Optional(Type.Boolean(parameters.withPubkey)),
      limit: Type.Optional(Type.Integer(parameters.limit)),
      offset: Type.Optional(Type.Integer(parameters.offset)),
    }),
    renderCall(args) {
      return line(
        `List puzzles ${args.address ?? args.collection ?? args.chain ?? "all"}${args.status === undefined ? "" : ` ${args.status}`}`,
      );
    },
    async execute(_toolCallId, params) {
      return tools.listTool(params);
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.verify),
    parameters: Type.Object({ id: puzzleId }),
    renderCall(args) {
      return line(`Verify puzzle ${args.id}`);
    },
    async execute(_toolCallId, params) {
      return tools.verifyTool(params.id);
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.balance),
    parameters: Type.Object({
      id: puzzleId,
      apiKey: Type.Optional(Type.String(parameters.apiKey)),
    }),
    renderCall(args) {
      return line(`Balance of puzzle ${args.id}`);
    },
    async execute(_toolCallId, params) {
      return tools.balanceTool(params.id, params.apiKey);
    },
  });
}

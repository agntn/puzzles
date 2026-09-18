import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { AgentToolResult, ExtensionAPI } from "@earendil-works/pi-coding-agent";

import type * as ToolsModule from "../../../src/tool-operations.ts";
import { puzzleToolSchemas } from "../../shared/puzzles-tool-schemas.ts";

const sourceModulePath = fileURLToPath(new URL("../../../src/tool-operations.ts", import.meta.url));

/**
 * Loads the tool executors shared with MCP and OMP. A checkout runs `src/`, an installed package
 * runs `dist/`, and both specifiers stay literal so a bundling host can see them.
 *
 * @returns {Promise<typeof ToolsModule>} The tool executors shared with MCP and OMP.
 */
function loadTools(): Promise<typeof ToolsModule> {
  return (
    existsSync(sourceModulePath)
      ? import("../../../src/tool-operations.ts")
      : import("../../../dist/tool-operations.mjs")
  ) as Promise<typeof ToolsModule>;
}

type Result = AgentToolResult<Record<string, unknown>>;

function agentResult(result: ToolsModule.ToolResult): Result {
  return { content: result.content, details: result.details };
}

function registration(tool: ToolsModule.ToolFacts): {
  name: string;
  label: string;
  description: string;
  promptSnippet: string;
  promptGuidelines: string[];
} {
  return {
    name: tool.name,
    label: tool.title,
    description: tool.description,
    promptSnippet: tool.promptSnippet,
    promptGuidelines: [...tool.promptGuidelines],
  };
}

/**
 * Registers crypto puzzle and bounty data tools in Pi.
 *
 * @param {ExtensionAPI} pi - The host extension API.
 */
export default async function puzzlesExtension(pi: ExtensionAPI): Promise<void> {
  const tools = await loadTools();
  const schemas = puzzleToolSchemas(tools.facts);

  pi.registerTool({
    ...registration(tools.facts.tools.stats),
    parameters: schemas.stats,
    async execute(): Promise<Result> {
      return agentResult(await tools.statsTool());
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.collections),
    parameters: schemas.collections,
    async execute(): Promise<Result> {
      return agentResult(await tools.collectionsTool());
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.show),
    parameters: schemas.show,
    async execute(_toolCallId, params): Promise<Result> {
      return agentResult(await tools.showTool(params.id));
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.list),
    parameters: schemas.list,
    async execute(_toolCallId, params): Promise<Result> {
      return agentResult(await tools.listTool(params));
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.verify),
    parameters: schemas.verify,
    async execute(_toolCallId, params): Promise<Result> {
      return agentResult(await tools.verifyTool(params.id));
    },
  });

  pi.registerTool({
    ...registration(tools.facts.tools.balance),
    parameters: schemas.balance,
    async execute(_toolCallId, params): Promise<Result> {
      return agentResult(await tools.balanceTool(params.id, params.apiKey));
    },
  });
}

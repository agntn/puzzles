import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { IsObject, type TSchema } from "typebox";
import { Value } from "typebox/value";
import { puzzleToolSchemas } from "../packages/shared/puzzles-tool-schemas.ts";
import {
  authorsTool,
  authorTool,
  solversTool,
  solverTool,
  balanceTool,
  collectionsTool,
  facts,
  hintsTool,
  stagesTool,
  listTool,
  showTool,
  statsTool,
  verifyTool,
  type ListParams,
  type ToolFacts,
  type ToolResult,
} from "./tool-operations.ts";
import { version } from "./version.ts";

interface ToolDefinition extends ToolFacts {
  inputSchema: TSchema;
  execute(args: Readonly<Record<string, unknown>>): Promise<ToolResult>;
}

const schemas = puzzleToolSchemas(facts);

const tools: readonly ToolDefinition[] = [
  { ...facts.tools.stats, inputSchema: schemas.stats, execute: () => statsTool() },
  {
    ...facts.tools.collections,
    inputSchema: schemas.collections,
    execute: () => collectionsTool(),
  },
  { ...facts.tools.authors, inputSchema: schemas.authors, execute: () => authorsTool() },
  {
    ...facts.tools.author,
    inputSchema: schemas.author,
    execute: (args) => authorTool(args["key"] as string),
  },
  { ...facts.tools.solvers, inputSchema: schemas.solvers, execute: () => solversTool() },
  {
    ...facts.tools.solver,
    inputSchema: schemas.solver,
    execute: (args) => solverTool(args["key"] as string),
  },
  {
    ...facts.tools.show,
    inputSchema: schemas.show,
    execute: (args) => showTool(args["id"] as string),
  },
  {
    ...facts.tools.hints,
    inputSchema: schemas.hints,
    execute: (args) => hintsTool(args["id"] as string),
  },
  {
    ...facts.tools.stages,
    inputSchema: schemas.stages,
    execute: (args) => stagesTool(args["id"] as string),
  },
  {
    ...facts.tools.list,
    inputSchema: schemas.list,
    execute: (args) => listTool(args as ListParams),
  },
  {
    ...facts.tools.verify,
    inputSchema: schemas.verify,
    execute: (args) => verifyTool(args["id"] as string),
  },
  {
    ...facts.tools.balance,
    inputSchema: schemas.balance,
    execute: (args) => balanceTool(args["id"] as string, args["apiKey"] as string | undefined),
  },
];

/**
 * The first reason the arguments fail their schema. A key the tool does not declare is named
 * before anything else, because the typebox message for it says only that one exists. The key
 * comes from the client, so it is quoted.
 *
 * @param {TSchema} schema - The tool's input schema.
 * @param {Readonly<Record<string, unknown>>} value - The arguments the client sent.
 * @returns {string} A one-line validation message for the client.
 */
function validationError(schema: TSchema, value: Readonly<Record<string, unknown>>): string {
  const declared: object = IsObject(schema) ? schema.properties : {};
  const unknown = Object.keys(value).filter((key) => !Object.hasOwn(declared, key));
  if (unknown.length > 0) {
    return `Invalid arguments at /: unknown property ${unknown.map((key) => JSON.stringify(key)).join(", ")}`;
  }
  const first = Value.Errors(schema, value)[0];
  return first === undefined
    ? "Invalid arguments"
    : `Invalid arguments at ${first.instancePath || "/"}: ${first.message}`;
}

/**
 * Error text for the MCP client, flattened to one line. The client or a provider controls these
 * values, so a stray newline, C1 byte or U+2028 would forge a line that reads as the server's own
 * answer.
 *
 * @param {string} message - Error text for the model.
 * @returns {CallToolResult} An error result carrying the sanitized text.
 */
function errorResult(message: string): CallToolResult {
  return {
    content: [{ type: "text", text: message.replaceAll(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, " ") }],
    isError: true,
  };
}

/**
 * Converts a shared tool result to the MCP text contract; `details` is for the agent harnesses only.
 *
 * @param {ToolResult} result - Result returned by the shared executor.
 * @returns {CallToolResult} The text content without the harness-only details.
 */
function toCallToolResult(result: ToolResult): CallToolResult {
  return { content: result.content };
}

/**
 * The `tools/list` entries, in order. Every tool only reads, so the hints differ in `openWorldHint`
 * alone, which is true for the tools that ask an explorer.
 */
export const toolListings: readonly Tool[] = tools.map((tool) => ({
  name: tool.name,
  title: tool.title,
  description: tool.description,
  inputSchema: tool.inputSchema as Tool["inputSchema"],
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: tool.openWorld,
  },
}));

const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));

/**
 * Runs one tool the way `tools/call` does: an unknown name, a schema miss and an executor failure
 * all come back as an error result, never as a throw, so every transport answers with the same text.
 *
 * @param {string} name - The tool's name, such as `puzzles_show`.
 * @param {Readonly<Record<string, unknown>>} args - The arguments the client sent.
 * @returns {Promise<CallToolResult>} The tool's text, or the sanitized error.
 */
export async function callTool(
  name: string,
  args: Readonly<Record<string, unknown>>,
): Promise<CallToolResult> {
  const tool = toolsByName.get(name);
  if (tool === undefined) {
    return errorResult(`Unknown puzzles tool: ${JSON.stringify(name)}`);
  }
  if (!Value.Check(tool.inputSchema, args)) {
    return errorResult(validationError(tool.inputSchema, args));
  }
  try {
    return toCallToolResult(await tool.execute(args));
  } catch (error) {
    return errorResult(
      `${tool.name} failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Creates an unconnected MCP server exposing the puzzle data tools. It sits on the low-level
 * `Server`, deprecated or not: `McpServer.registerTool` takes Zod only, and the schemas are TypeBox
 * because Pi shares them.
 *
 * @returns {Server} The unconnected MCP server exposing the puzzle data tools.
 */
export function createMcpServer(): Server {
  const server = new Server({ name: "puzzles", version }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: [...toolListings] }));

  server.setRequestHandler(CallToolRequestSchema, (request) =>
    callTool(request.params.name, request.params.arguments ?? {}),
  );

  return server;
}

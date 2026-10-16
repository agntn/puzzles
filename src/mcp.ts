import {
  callTool as callListedTool,
  createMcpServer as createToolServer,
  listTools,
} from "@agntn/tools/mcp";
import type { CallToolResult, Server, Tool } from "@modelcontextprotocol/server";
import { serverInfo } from "./server-info.ts";
import { publicPuzzlesTools, puzzlesTools } from "./tools.ts";

/** The `tools/list` entries of the public server at puzzles.agntn.dev, in `puzzles mcp` order. */
export const toolListings: readonly Tool[] = listTools(publicPuzzlesTools);

/**
 * Runs one tool of the public server the way `tools/call` does: an unknown name, a schema miss and an executor failure
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
  return await callListedTool(serverInfo, publicPuzzlesTools, name, args);
}

/**
 * Creates an unconnected MCP server exposing the puzzle data tools.
 *
 * @returns {Server} The unconnected MCP server.
 */
export function createMcpServer(): Server {
  return createToolServer(serverInfo, puzzlesTools);
}

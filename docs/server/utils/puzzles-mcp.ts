import { callTool, toolListings } from "@agntn/puzzles/mcp";
import {
  defineMcpTool,
  type McpToolDefinition,
  type McpToolDefinitionListItem,
} from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

/**
 * One puzzles tool for the Docus MCP server, served beside `list-pages` and `get-page`. The name,
 * prose, annotations and executor are the ones `puzzles mcp` lists. The toolkit takes Zod only, so
 * the shared TypeBox schema is read back through its JSON Schema and keeps every limit it declares.
 *
 * @param {string} name - The tool's name, such as `puzzles_show`.
 * @returns {McpToolDefinitionListItem} The tool definition for `server/mcp/tools/`.
 */
export function puzzlesMcpTool(name: string): McpToolDefinitionListItem {
  const listing = toolListings.find((candidate) => candidate.name === name);
  if (listing === undefined) {
    throw new Error(`Unknown puzzles tool: ${name}`);
  }
  const schema = z.fromJSONSchema(listing.inputSchema as z.core.JSONSchema.JSONSchema);
  // The toolkit's types can resolve another zod copy through its peer. The shape is the same.
  const shape = (schema as z.ZodObject).shape as NonNullable<McpToolDefinition["inputSchema"]>;
  return defineMcpTool({
    name: listing.name,
    title: listing.title,
    description: listing.description,
    annotations: listing.annotations,
    inputSchema: shape,
    handler: (args: Readonly<Record<string, unknown>>) => callTool(name, args),
  });
}

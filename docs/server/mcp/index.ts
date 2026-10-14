import { toToolkitTools } from "@agntn/tools/toolkit";
import { defineMcpHandler, getMcpTools } from "@nuxtjs/mcp-toolkit/server";
import { serverInfo } from "../../../src/server-info.ts";
import { publicPuzzlesTools } from "../../../src/tools.ts";

const puzzleTools = toToolkitTools(serverInfo, publicPuzzlesTools);

/**
 * Introduces itself like `puzzles mcp`, and serves the puzzle tools after the Docus page tools.
 * `tools` is a function: an array would replace the toolkit's pool and drop `list-pages` and
 * `get-page`. No puzzle tool reports progress, so the handler stays stateless, without sessions.
 */
export default defineMcpHandler({
  ...serverInfo,
  tools: async (event) => [...(await getMcpTools({ event })), ...puzzleTools],
});

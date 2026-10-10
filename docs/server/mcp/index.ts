import { toToolkitTools } from "@agntn/tools/toolkit";
import { defineMcpHandler, getMcpTools } from "@nuxtjs/mcp-toolkit/server";
import { serverInfo } from "../../../src/server-info.ts";
import { publicPuzzlesTools } from "../../../src/tools.ts";

const puzzleTools = toToolkitTools(serverInfo, publicPuzzlesTools);

/** Introduces itself like `puzzles mcp`, and serves the puzzle tools after the Docus page tools. */
export default defineMcpHandler({
  ...serverInfo,
  tools: async (event) => [...(await getMcpTools({ event })), ...puzzleTools],
});

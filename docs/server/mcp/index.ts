import { serverInfo } from "../../../src/server-info.ts";

/** Introduces itself like `puzzles mcp`, with the Docus page tools beside the puzzle ones. */
export default defineMcpHandler({ ...serverInfo });

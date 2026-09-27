import { version } from "../../../src/version.ts";

/** The server `puzzles mcp` names over stdio, with the Docus page tools beside the puzzle ones. */
export default defineMcpHandler({ name: "puzzles", version });

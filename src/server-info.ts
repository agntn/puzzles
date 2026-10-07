import type { McpServerInfo } from "@agntn/tools/mcp";
import { version } from "./version.ts";

/** How both MCP servers introduce themselves, so a connector card is more than a bare name. */
export const serverInfo = {
  name: "puzzles",
  version,
  description:
    "Public crypto puzzles and bounties, from the 1000 BTC puzzle to GSMG, with their addresses, hints, stages and solvers. Check a key before you celebrate, and ask the chain if the prize is still there.",
  icons: [
    { src: "https://puzzles.agntn.dev/favicon.svg", mimeType: "image/svg+xml", sizes: ["any"] },
    { src: "https://puzzles.agntn.dev/icon-512.png", mimeType: "image/png", sizes: ["512x512"] },
  ],
} satisfies McpServerInfo;

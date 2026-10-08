#!/usr/bin/env node
import { existsSync } from "node:fs";
import { sep } from "node:path";
import { fileURLToPath } from "node:url";
import { runCli } from "@agntn/tools/cli";
import { useCheckoutAssets } from "./checkout.ts";
import { cliCommands } from "./commands/index.ts";
import { PuzzlesError } from "./core/errors.ts";
import type { createMcpServer } from "./mcp.ts";
import { serverInfo } from "./server-info.ts";
import { puzzlesTools } from "./tools.ts";
import { version } from "./version.ts";

useCheckoutAssets(fileURLToPath(new URL("..", import.meta.url)));

/** The same file from `src/cli.ts` and `dist/cli.mjs`; the npm package ships only `dist`. */
const sourceMcp = new URL("../src/mcp.ts", import.meta.url);
const sourceMcpPath = fileURLToPath(sourceMcp);

/**
 * Narrows the module a runtime URL import returned, which TypeScript types as `any`.
 *
 * @param {unknown} value - The imported module namespace.
 * @returns {boolean} Whether it exports the server.
 */
function isMcpModule(value: unknown): value is { createMcpServer: typeof createMcpServer } {
  return typeof value === "object" && value !== null && "createMcpServer" in value;
}

/**
 * A built bin inside a checkout serves the live source, as the Pi and OMP extensions do, so a local
 * server needs a restart after a change instead of `pnpm build`. Node refuses to strip types under
 * `node_modules`, so a copy there keeps the bundle, and so does the npm package, which ships no
 * `src`. `PUZZLES_DIST=1` keeps it everywhere, for tests of the build.
 *
 * @returns {boolean} Whether the source is there to serve.
 */
function servesSource(): boolean {
  return (
    !import.meta.url.endsWith(".ts") &&
    process.env["PUZZLES_DIST"] !== "1" &&
    !sourceMcpPath.includes(`${sep}node_modules${sep}`) &&
    existsSync(sourceMcpPath)
  );
}

/**
 * Serves `createMcpServer` itself, since the `mcp` of `runCli` always runs the bundle.
 *
 * @returns {Promise<void>} Once the server is connected.
 */
async function serveMcp(): Promise<void> {
  const module: unknown = servesSource() ? await import(sourceMcp.href) : await import("./mcp.ts");
  if (!isMcpModule(module)) {
    throw new TypeError(`${sourceMcpPath} has no createMcpServer`);
  }
  const { StdioServerTransport } = await import("@modelcontextprotocol/server/stdio");
  await module.createMcpServer().connect(new StdioServerTransport());
}

/**
 * A `PuzzlesError` prints as one line; anything else is a bug and keeps its stack.
 *
 * @param {unknown} error - What a command threw.
 * @returns {boolean} Whether it prints as one line.
 */
function isRefusal(error: unknown): boolean {
  return error instanceof PuzzlesError;
}

const argv = process.argv.slice(2);
/** A stray flag in an MCP client's config must not kill the server, so `mcp` takes any but help. */
if (argv[0] === "mcp" && !argv.includes("--help") && !argv.includes("-h")) {
  await serveMcp();
} else {
  await runCli(
    {
      name: "puzzles",
      version,
      description: "Crypto bounties, puzzles and challenges as typed records",
      tools: puzzlesTools,
      commands: cliCommands,
      mcp: serverInfo,
      expected: isRefusal,
    },
    argv,
  );
}

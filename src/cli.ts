#!/usr/bin/env node
import { existsSync } from "node:fs";
import { sep } from "node:path";
import { fileURLToPath } from "node:url";
import { type ArgsDef, type CommandDef, defineCommand, runMain } from "citty";
import type McpCommand from "./commands/mcp.ts";
import { printError } from "./commands/output.ts";
import { PuzzlesError } from "./core/errors.ts";
import { version } from "./version.ts";

/** A closed pipe, `puzzles export | head`, ends the process quietly and keeps the exit code a command set. */
process.stdout.on("error", (error: Readonly<NodeJS.ErrnoException>) => {
  if (error.code === "EPIPE") {
    process.exit(typeof process.exitCode === "number" ? process.exitCode : 0);
  }
  throw error;
});

/**
 * Loads a subcommand and turns a `PuzzlesError`, an unknown puzzle or collection, a bad status, a
 * refused balance, into one line on stderr and exit code 1. Anything else keeps citty's stack,
 * because an unexpected error should be loud.
 *
 * @param {() => Promise<{ readonly default: CommandDef<T> }>} load - Imports the command module.
 * @returns {Promise<CommandDef<T>>} The command, its `run` guarded.
 */
async function command<T extends ArgsDef>(
  load: () => Promise<{ readonly default: CommandDef<T> }>,
): Promise<CommandDef<T>> {
  const loaded = (await load()).default;
  const run = loaded.run;
  if (run === undefined) {
    return loaded;
  }
  return {
    ...loaded,
    async run(context) {
      try {
        await run(context);
      } catch (error) {
        if (!(error instanceof PuzzlesError)) {
          throw error;
        }
        printError(error.message);
        process.exitCode = 1;
      }
    },
  };
}

/** The same file from `src/cli.ts` and `dist/cli.mjs`; the npm package ships only `dist`. */
const sourceMcpCommand = new URL("../src/commands/mcp.ts", import.meta.url);

/**
 * Narrows the module a runtime URL import returned, which TypeScript types as `any`.
 *
 * @param {unknown} value - The imported module namespace.
 * @returns {boolean} Whether it exports a default command.
 */
function isMcpModule(value: unknown): value is { readonly default: typeof McpCommand } {
  return typeof value === "object" && value !== null && "default" in value;
}

/**
 * Loads the MCP command. A built bin inside a checkout runs the live source, as the Pi and OMP
 * extensions do, so a local server needs a restart after a change instead of `pnpm build`. Node
 * refuses to strip types under `node_modules`, so a copy there keeps the bundle, and so does the
 * npm package, which ships no `src`. `PUZZLES_DIST=1` keeps it everywhere, for tests of the build.
 *
 * @returns {Promise<{ readonly default: typeof McpCommand }>} The module holding the command.
 */
async function loadMcpCommand(): Promise<{ readonly default: typeof McpCommand }> {
  const sourcePath = fileURLToPath(sourceMcpCommand);
  const fromSource =
    !import.meta.url.endsWith(".ts") &&
    process.env["PUZZLES_DIST"] !== "1" &&
    !sourcePath.includes(`${sep}node_modules${sep}`) &&
    existsSync(sourcePath);
  if (!fromSource) {
    return import("./commands/mcp.ts");
  }
  const module: unknown = await import(sourceMcpCommand.href);
  if (!isMcpModule(module)) {
    throw new TypeError(`${sourcePath} has no default command`);
  }
  return module;
}

const main = defineCommand({
  meta: {
    name: "puzzles",
    version,
    description: "Crypto bounties, puzzles and challenges as typed records",
  },
  subCommands: {
    authors: () => command(() => import("./commands/authors.ts")),
    balance: () => command(() => import("./commands/balance.ts")),
    collections: () => command(() => import("./commands/collections.ts")),
    export: () => command(() => import("./commands/export.ts")),
    hints: () => command(() => import("./commands/hints.ts")),
    list: () => command(() => import("./commands/list.ts")),
    mcp: () => command(loadMcpCommand),
    show: () => command(() => import("./commands/show.ts")),
    solvers: () => command(() => import("./commands/solvers.ts")),
    stages: () => command(() => import("./commands/stages.ts")),
    stats: () => command(() => import("./commands/stats.ts")),
    verify: () => command(() => import("./commands/verify.ts")),
  },
});

await runMain(main);

#!/usr/bin/env node
import { type ArgsDef, type CommandDef, defineCommand, runMain } from "citty";
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
        return await run(context);
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

const main = defineCommand({
  meta: {
    name: "puzzles",
    version,
    description: "Crypto bounties, puzzles and challenges as typed records",
  },
  subCommands: {
    balance: () => command(() => import("./commands/balance.ts")),
    collections: () => command(() => import("./commands/collections.ts")),
    export: () => command(() => import("./commands/export.ts")),
    list: () => command(() => import("./commands/list.ts")),
    mcp: () => command(() => import("./commands/mcp.ts")),
    show: () => command(() => import("./commands/show.ts")),
    stats: () => command(() => import("./commands/stats.ts")),
    verify: () => command(() => import("./commands/verify.ts")),
  },
});

await runMain(main);

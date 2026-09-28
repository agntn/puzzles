#!/usr/bin/env node
import { existsSync } from "node:fs";
import { sep } from "node:path";
import { fileURLToPath } from "node:url";
import { type ArgsDef, type CommandDef, defineCommand, type Resolvable, runMain } from "citty";
import type McpCommand from "./commands/mcp.ts";
import { printError } from "./commands/output.ts";
import { InvalidArgumentError, PuzzlesError } from "./core/errors.ts";
import { version } from "./version.ts";

/** A closed pipe, `puzzles export | head`, ends the process quietly and keeps the exit code a command set. */
process.stdout.on("error", (error: Readonly<NodeJS.ErrnoException>) => {
  if (error.code === "EPIPE") {
    process.exit(typeof process.exitCode === "number" ? process.exitCode : 0);
  }
  throw error;
});

/**
 * Settles a command field citty lets be a value, a promise, or a function returning either.
 *
 * @param {Resolvable<T>} value - The field as the command declares it.
 * @returns {Promise<T>} Its value.
 */
async function settle<T>(value: Resolvable<T>): Promise<T> {
  return typeof value === "function" ? (value as () => T | Promise<T>)() : value;
}

/** The part of an argument definition the check reads, readonly all the way down. */
type Declared = Readonly<{
  type?: string | undefined;
  alias?: string | readonly string[] | undefined;
}>;

/**
 * The keys citty leaves in the parsed arguments for one declared option: its name, its aliases, and
 * the camelCase spelling it accepts for a kebab-case name.
 *
 * @param {string} name - The option as the command declares it.
 * @param {Declared} def - Its definition.
 * @returns {string[]} Every key the option may parse to.
 */
function optionKeys(name: string, def: Declared): string[] {
  const aliases = def.alias === undefined ? [] : [def.alias].flat();
  return [
    name,
    name.replaceAll(/-([a-z0-9])/gu, (_, letter: string) => letter.toUpperCase()),
    ...aliases,
  ];
}

/**
 * Rejects what the command does not declare, because citty parses without `strict` and would run
 * `verify b1000/1 --key abc` as `verify b1000/1`, or read `list --limitt 3` as the collection `3`.
 * A command that declares no arguments, `mcp`, stays open.
 *
 * @param {string} name - The command, for the message.
 * @param {Readonly<Record<string, Declared>>} defs - The arguments it declares.
 * @param {Readonly<Record<string, unknown>>} parsed - What citty parsed from the command line.
 */
function assertDeclared(
  name: string,
  defs: Readonly<Record<string, Declared>>,
  parsed: Readonly<Record<string, unknown> & { _: readonly string[] }>,
): void {
  const entries = Object.entries(defs);
  const positionals = entries.filter(([, def]) => def.type === "positional").map(([key]) => key);
  const options = entries.filter(([, def]) => def.type !== "positional");
  const known = new Set([...positionals, ...options.flatMap(([key, def]) => optionKeys(key, def))]);
  const unknown = Object.keys(parsed).find((key) => key !== "_" && !known.has(key));
  if (unknown !== undefined) {
    throw new InvalidArgumentError(
      "option",
      `unknown ${unknown.length === 1 ? "-" : "--"}${unknown}, expected one of ${options.map(([key]) => `--${key}`).join(", ")}`,
    );
  }
  const surplus = parsed._[positionals.length];
  if (surplus !== undefined) {
    const takes =
      positionals.length === 0 ? "no positional argument" : positionals.join(" ").toUpperCase();
    throw new InvalidArgumentError(
      "argument",
      `unexpected ${JSON.stringify(surplus)}, ${name} takes ${takes}`,
    );
  }
}

/**
 * Loads a subcommand and turns a `PuzzlesError`, an unknown puzzle or collection, a bad status, a
 * refused balance, an argument the command does not take, into one line on stderr and exit code 1.
 * Anything else keeps citty's stack, because an unexpected error should be loud.
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
        const defs = loaded.args === undefined ? undefined : await settle(loaded.args);
        const meta = loaded.meta === undefined ? undefined : await settle(loaded.meta);
        if (defs !== undefined) {
          assertDeclared(meta?.name ?? "the command", defs, context.args);
        }
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

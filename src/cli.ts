#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { version } from "./version.ts";

/** A closed pipe, `puzzles export | head`, ends the process quietly and keeps the exit code a command set. */
process.stdout.on("error", (error: Readonly<NodeJS.ErrnoException>) => {
  if (error.code === "EPIPE") {
    process.exit(typeof process.exitCode === "number" ? process.exitCode : 0);
  }
  throw error;
});

const main = defineCommand({
  meta: {
    name: "puzzles",
    version,
    description: "Crypto bounties, puzzles and challenges as typed records",
  },
  subCommands: {
    balance: () => import("./commands/balance.ts").then((m) => m.default),
    collections: () => import("./commands/collections.ts").then((m) => m.default),
    export: () => import("./commands/export.ts").then((m) => m.default),
    list: () => import("./commands/list.ts").then((m) => m.default),
    mcp: () => import("./commands/mcp.ts").then((m) => m.default),
    show: () => import("./commands/show.ts").then((m) => m.default),
    stats: () => import("./commands/stats.ts").then((m) => m.default),
    verify: () => import("./commands/verify.ts").then((m) => m.default),
  },
});

await runMain(main);

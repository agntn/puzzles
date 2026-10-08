/**
 * The commands only the CLI gets. Each takes the place of the tool command with its name, because
 * the command line keeps what the tools leave out: URLs instead of repository paths, every match
 * instead of a page, filtered passes, rows as they land and exit codes a script can read.
 * `author` and `solver` run the tools' own executors behind the dashed word check.
 */

import type { ToolDefinition } from "@agntn/tools";
import assets from "./assets.ts";
import authors, { author } from "./authors.ts";
import balance from "./balance.ts";
import eligibility from "./eligibility.ts";
import exportCommand from "./export.ts";
import hints from "./hints.ts";
import list from "./list.ts";
import show from "./show.ts";
import solvers, { solver } from "./solvers.ts";
import stages from "./stages.ts";
import verify from "./verify.ts";
import watch from "./watch.ts";

export const cliCommands: readonly ToolDefinition[] = [
  authors,
  author,
  solvers,
  solver,
  show,
  hints,
  stages,
  assets,
  list,
  verify,
  balance,
  watch,
  eligibility,
  exportCommand,
];

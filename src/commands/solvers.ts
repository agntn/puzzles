import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { requireSolver, resolveSolverKey, solvers } from "../core/dataset.ts";
import { formatSolver, formatSolverRecord, toJson } from "../core/utils.ts";

export default defineCommand({
  meta: {
    name: "solvers",
    description: "List every named solver, or show one by solver key or puzzle identifier",
  },
  args: {
    key: {
      type: "positional",
      description: "Solver key, or a puzzle identifier",
      required: false,
    },
    ...jsonArg,
  },
  async run({ args }) {
    if (args.key === undefined) {
      const entries = await solvers();
      printLine(args.json ? toJson(entries) : entries.map(formatSolver).join("\n"));
      return;
    }
    const entry = await requireSolver(await resolveSolverKey(args.key));
    printLine(args.json ? toJson(entry) : formatSolverRecord(entry));
  },
});

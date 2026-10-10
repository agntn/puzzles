import { defineTool, Type } from "@agntn/tools";
import { closed } from "./filters.ts";
import { lines } from "./output.ts";
import { solverTool } from "../tool-operations.ts";

/** `puzzles_solver` itself, with the key as a positional that a mistyped flag can't fill. */
export const solver = defineTool({
  name: "puzzles_solver",
  title: "Puzzle solver",
  description: "Show one solver by solver key or puzzle identifier",
  effect: "read",
  input: closed({ key: Type.String({ description: "Solver key, or a puzzle identifier" }) }),
  cli: { command: "solver", positional: ["key"], plain: ["key"] },
  execute: (args) => solverTool(args.key),
});

export default defineTool({
  name: "puzzles_solvers",
  title: "Puzzle solvers",
  description: "List every named solver, or show one by solver key or puzzle identifier",
  effect: "read",
  input: closed({
    key: Type.Optional(Type.String({ description: "Solver key, or a puzzle identifier" })),
  }),
  cli: { command: "solvers", positional: ["key"], plain: ["key"] },
  async execute(args) {
    const { requireSolver, resolveSolverKey, solvers } = await import("../core/dataset.ts");
    const { formatSolver, formatSolverRecord } = await import("../core/utils.ts");
    if (args.key === undefined) {
      const entries = await solvers();
      return lines(entries.map(formatSolver), entries);
    }
    const entry = await requireSolver(await resolveSolverKey(args.key));
    return lines([formatSolverRecord(entry)], entry);
  },
});

import { defineTool, Type } from "@agntn/tools";
import { closed, plainWord } from "./filters.ts";
import { lines } from "./output.ts";

export default defineTool({
  name: "puzzles_solvers",
  title: "Puzzle solvers",
  description: "List every named solver, or show one by solver key or puzzle identifier",
  effect: "read",
  input: closed({
    key: Type.Optional(Type.String({ description: "Solver key, or a puzzle identifier" })),
  }),
  cli: { command: "solvers", positional: ["key"] },
  async execute(args) {
    plainWord(args.key);
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

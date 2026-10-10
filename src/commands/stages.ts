import { defineTool, Type } from "@agntn/tools";
import { closed } from "./filters.ts";
import { lines } from "./output.ts";

export default defineTool({
  name: "puzzles_stages",
  title: "Puzzle stages",
  description:
    "List the stages of a puzzle that runs in several, with their pages, files and published answers",
  effect: "read",
  input: closed({ id: Type.String({ description: "Puzzle identifier, for example gsmg" }) }),
  cli: { command: "stages", positional: ["id"], plain: ["id"] },
  async execute(args) {
    const { requirePuzzle } = await import("../core/dataset.ts");
    const { formatStageReport } = await import("../core/utils.ts");
    const puzzle = await requirePuzzle(args.id);
    return lines(formatStageReport(puzzle), { stages: puzzle.stages() });
  },
});

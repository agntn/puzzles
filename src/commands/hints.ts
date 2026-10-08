import { defineTool, Type } from "@agntn/tools";
import { closed, plainWord } from "./filters.ts";
import { lines } from "./output.ts";

export default defineTool({
  name: "puzzles_hints",
  title: "Puzzle hints",
  description:
    "List the hints that hold for one puzzle, its collection's and its own, and the hint files it ships",
  effect: "read",
  input: closed({ id: Type.String({ description: "Puzzle identifier, for example bits/90" }) }),
  cli: { command: "hints", positional: ["id"] },
  async execute(args) {
    plainWord(args.id);
    const { requirePuzzle } = await import("../core/dataset.ts");
    const { requireCollection } = await import("../core/registry.ts");
    const { formatHintReport, hintAssets } = await import("../core/utils.ts");
    const puzzle = await requirePuzzle(args.id);
    const collection = await requireCollection(puzzle.collection());
    return lines(formatHintReport(puzzle, collection.hints), {
      hints: collection.hintsById(puzzle.id()),
      hintAssets: hintAssets(puzzle),
    });
  },
});

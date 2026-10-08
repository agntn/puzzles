import { defineTool, Type } from "@agntn/tools";
import { closed, plainWord } from "./filters.ts";
import { lines } from "./output.ts";

export default defineTool({
  name: "puzzles_show",
  title: "Show a puzzle",
  description: "Show one puzzle by universal identifier",
  effect: "read",
  input: closed({
    id: Type.String({ description: "Puzzle identifier, for example bits/90" }),
    allTransactions: Type.Optional(
      Type.Boolean({
        description: "List every transaction, not one line per run of small increases",
      }),
    ),
  }),
  cli: { command: "show", positional: ["id"] },
  async execute(args) {
    plainWord(args.id);
    const { requirePuzzle } = await import("../core/dataset.ts");
    const { requireCollection } = await import("../core/registry.ts");
    const { formatPuzzleRecord } = await import("../core/utils.ts");
    const puzzle = await requirePuzzle(args.id);
    const collection = await requireCollection(puzzle.collection());
    const record = formatPuzzleRecord(
      puzzle,
      collection.hints,
      collection.techniques,
      args.allTransactions === true,
    );
    return lines([record], puzzle);
  },
});

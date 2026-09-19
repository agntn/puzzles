import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { requirePuzzle } from "../core/dataset.ts";
import { requireCollection } from "../core/registry.ts";
import { formatHintReport, hintAssets, toJson } from "../core/utils.ts";

export default defineCommand({
  meta: {
    name: "hints",
    description:
      "List the hints that hold for one puzzle, its collection's and its own, and the hint files it ships",
  },
  args: {
    id: { type: "positional", description: "Puzzle identifier, for example b1000/90" },
    ...jsonArg,
  },
  async run({ args }) {
    const puzzle = await requirePuzzle(args.id ?? "");
    const collection = await requireCollection(puzzle.collection());
    if (args.json) {
      printLine(
        toJson({ hints: collection.hintsById(puzzle.id()), hintAssets: hintAssets(puzzle) }),
      );
      return;
    }
    for (const line of formatHintReport(puzzle, collection.hints)) {
      printLine(line);
    }
  },
});

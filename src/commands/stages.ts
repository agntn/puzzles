import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { requirePuzzle } from "../core/dataset.ts";
import { formatStageReport, toJson } from "../core/utils.ts";

export default defineCommand({
  meta: {
    name: "stages",
    description:
      "List the stages of a puzzle that runs in several, with their pages, files and published answers",
  },
  args: {
    id: { type: "positional", description: "Puzzle identifier, for example gsmg" },
    ...jsonArg,
  },
  async run({ args }) {
    const puzzle = await requirePuzzle(args.id ?? "");
    if (args.json) {
      printLine(toJson({ stages: puzzle.stages() }));
      return;
    }
    for (const line of formatStageReport(puzzle)) {
      printLine(line);
    }
  },
});

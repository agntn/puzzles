import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { requirePuzzle } from "../core/dataset.ts";
import { formatPuzzle, toJson } from "../core/utils.ts";

export default defineCommand({
  meta: {
    name: "show",
    description: "Show one puzzle by universal identifier",
  },
  args: {
    id: { type: "positional", description: "Puzzle identifier, for example b1000/90" },
    ...jsonArg,
  },
  async run({ args }) {
    const puzzle = await requirePuzzle(args.id ?? "");
    printLine(args.json ? toJson(puzzle) : formatPuzzle(puzzle));
  },
});

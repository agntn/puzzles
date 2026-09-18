import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { collectionSummaries } from "../core/dataset.ts";
import { formatCollection, toJson } from "../core/utils.ts";

export default defineCommand({
  meta: {
    name: "collections",
    description: "List every registered collection",
  },
  args: jsonArg,
  async run({ args }) {
    const summaries = await collectionSummaries();
    if (args.json) {
      printLine(toJson(summaries));
      return;
    }
    for (const entry of summaries) {
      printLine(formatCollection(entry));
    }
  },
});

import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { stats } from "../core/dataset.ts";
import { formatStats, toJson } from "../core/utils.ts";

export default defineCommand({
  meta: {
    name: "stats",
    description: "Print aggregate statistics for every collection",
  },
  args: jsonArg,
  async run({ args }) {
    const result = await stats();
    if (args.json) {
      printLine(toJson(result));
      return;
    }
    for (const line of formatStats(result)) printLine(line);
  },
});

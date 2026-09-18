import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { stats } from "../core/dataset.ts";
import { toJson } from "../core/utils.ts";

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
    printLine(`Total: ${result.total}`);
    printLine(`Solved: ${result.solved}`);
    printLine(`Unsolved: ${result.unsolved}`);
    printLine(`Claimed: ${result.claimed}`);
    printLine(`Swept: ${result.swept}`);
    printLine(`Expired: ${result.expired}`);
    printLine(`With pubkey: ${result.with_pubkey}`);
  },
});

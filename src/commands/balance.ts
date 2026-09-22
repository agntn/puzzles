import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { chainSymbol } from "../core/chains.ts";
import { requirePuzzle } from "../core/dataset.ts";
import { toJson } from "../core/utils.ts";

export default defineCommand({
  meta: {
    name: "balance",
    description: "Fetch a puzzle address balance from its chain",
  },
  args: {
    id: { type: "positional", description: "Puzzle identifier" },
    "api-key": {
      type: "string",
      description: "Provider API key; Ethereum falls back to ETHERSCAN_API_KEY",
    },
    ...jsonArg,
  },
  async run({ args }) {
    const puzzle = await requirePuzzle(args.id ?? "");
    const balance = await puzzle.balance({
      apiKey: args["api-key"] ?? process.env["ETHERSCAN_API_KEY"],
    });
    printLine(
      args.json
        ? toJson(balance)
        : `${puzzle.id()}: ${balance.totalAmount()} ${chainSymbol(balance.chain)}`,
    );
  },
});

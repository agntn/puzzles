import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { chains } from "../core/chains.ts";
import { selectPuzzles } from "../core/dataset.ts";
import { Status } from "../core/puzzle.ts";
import { formatPuzzle, parseStatus, requireChain, toJson } from "../core/utils.ts";

export default defineCommand({
  meta: {
    name: "list",
    description: "List puzzles, optionally filtered by collection, address, chain and status",
  },
  args: {
    collection: {
      type: "positional",
      required: false,
      description: "Collection key, for example b1000",
    },
    address: {
      type: "string",
      description: "The puzzle paying to this address, in any case the chain accepts",
    },
    chain: {
      type: "string",
      description: `Filter by chain: ${chains.join(", ")}`,
    },
    status: {
      type: "string",
      description: `Filter by status: ${Object.values(Status).join(", ")}`,
    },
    "with-pubkey": { type: "boolean", description: "Only puzzles with a known public key" },
    ...jsonArg,
  },
  async run({ args }) {
    const puzzles = await selectPuzzles({
      address: args.address,
      chain: requireChain(args.chain),
      collection: args.collection,
      status: parseStatus(args.status),
      withPubkey: args["with-pubkey"],
    });
    if (args.json) {
      printLine(toJson(puzzles));
      return;
    }
    for (const puzzle of puzzles) {
      printLine(formatPuzzle(puzzle));
    }
  },
});

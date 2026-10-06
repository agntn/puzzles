import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { apiKeyVariables } from "../core/balance.ts";
import type { Chain } from "../core/chains.ts";
import { eligibility, formatEligibility } from "../core/eligibility.ts";
import { toJson } from "../core/utils.ts";

/**
 * The variable a chain reads its provider key from, so an Etherscan key never reaches Blockchair.
 *
 * @param {Chain} chain - Chain of the lookup.
 * @returns {string | undefined} The key, when the variable holds one.
 */
function keyFor(chain: Chain): string | undefined {
  const variable = apiKeyVariables[chain];
  return variable === undefined ? undefined : process.env[variable];
}

export default defineCommand({
  meta: {
    name: "eligibility",
    description:
      "Gather what to check before working on a puzzle, from its record and a live read of its addresses, and name every field nobody can fill",
  },
  args: {
    query: {
      type: "positional",
      description: "Puzzle identifier or address, for example bits/71 or one no record holds",
    },
    chain: {
      type: "string",
      description: "Chain of an address whose format fits more than one, for example base",
    },
    "api-key": {
      type: "string",
      description:
        "Provider API key; Ethereum falls back to ETHERSCAN_API_KEY, Bitcoin Cash, Dogecoin and eCash to BLOCKCHAIR_API_KEY",
    },
    ...jsonArg,
  },
  async run({ args }) {
    const record = await eligibility(args.query ?? "", {
      apiKey: args["api-key"],
      apiKeyFor: keyFor,
      chain: args.chain,
    });
    if (args.json) {
      printLine(toJson(record));
    } else {
      for (const row of formatEligibility(record)) {
        printLine(row);
      }
    }
    process.exitCode = record.missing.length === 0 ? 0 : 1;
  },
});

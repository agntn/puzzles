import { defineTool, Type } from "@agntn/tools";
import { apiKeyArg, closed, plainWord } from "./filters.ts";
import { lines } from "./output.ts";
import { apiKeyVariables } from "../core/balance.ts";
import type { Chain } from "../core/chains.ts";

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

export default defineTool({
  name: "puzzles_eligibility",
  title: "Puzzle eligibility",
  description:
    "Gather what to check before working on a puzzle, from its record and a live read of its addresses, and name every field nobody can fill",
  effect: "read",
  openWorld: true,
  input: closed({
    query: Type.String({
      description: "Puzzle identifier or address, for example bits/71 or one no record holds",
    }),
    chain: Type.Optional(
      Type.String({
        description: "Chain of an address whose format fits more than one, for example base",
      }),
    ),
    ...apiKeyArg,
  }),
  cli: { command: "eligibility", positional: ["query"] },
  async execute(args) {
    plainWord(args.query);
    const { eligibility, formatEligibility } = await import("../core/eligibility.ts");
    const record = await eligibility(args.query, {
      apiKey: args.apiKey,
      apiKeyFor: keyFor,
      chain: args.chain,
    });
    process.exitCode = record.missing.length === 0 ? 0 : 1;
    return lines(formatEligibility(record), record);
  },
});

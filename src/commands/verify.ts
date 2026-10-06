import { defineCommand } from "citty";
import { filterArgs, filterQuery, hasFilter } from "./filters.ts";
import { jsonArg, printLine } from "./output.ts";
import { all, requirePuzzle, selectPuzzles } from "../core/dataset.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import type { Puzzle } from "../core/puzzle.ts";
import { toJson } from "../core/utils.ts";
import { type RecipeResult, verify, type VerifyResult } from "../core/verify.ts";

/** The flags `selected()` reads. */
type VerifyArgs = Readonly<
  { all?: boolean | undefined; id?: string | undefined } & Parameters<typeof hasFilter>[0]
>;

/**
 * The puzzles one run checks: the one its id names, every one its filters pick, or all of them.
 *
 * @param {VerifyArgs} args - The parsed flags.
 * @returns {Promise<readonly Puzzle[]>} The puzzles, in dataset order.
 */
async function selected(args: VerifyArgs): Promise<readonly Puzzle[]> {
  const filtered = hasFilter(args);
  if (args.id !== undefined) {
    if (filtered || args.all === true) {
      throw new InvalidArgumentError(
        "id",
        "pass a puzzle identifier on its own, without --all or filters",
      );
    }
    return [await requirePuzzle(args.id)];
  }
  if (filtered) {
    return selectPuzzles(filterQuery(args));
  }
  if (args.all === true) {
    return all();
  }
  throw new InvalidArgumentError(
    "id",
    "pass a puzzle identifier, a filter such as --technique, or --all",
  );
}

function labelOf(result: VerifyResult | RecipeResult): string {
  return result.verified ? "OK" : result.unavailable ? "SKIP" : "FAIL";
}

function formatRecipe(recipe: RecipeResult | undefined): string {
  if (recipe === undefined) {
    return "";
  }
  const detail = recipe.error === null ? "" : ` (${recipe.error})`;
  return `\trecipe ${recipe.recipe} ${labelOf(recipe)}${detail}`;
}

function formatResult(result: VerifyResult): string {
  const detail = result.error === null ? "" : `\t${result.error}`;
  return `${labelOf(result)}\t${result.id}${detail}${formatRecipe(result.recipe)}`;
}

/**
 * A key or a recipe that ran and missed: the record contradicts itself.
 *
 * @param {VerifyResult | RecipeResult} result - The key's or the recipe's outcome.
 * @returns {boolean} Whether it ran and derived another address.
 */
function failed(result: VerifyResult | RecipeResult): boolean {
  return !result.verified && !result.unavailable;
}

export default defineCommand({
  meta: {
    name: "verify",
    description: "Verify that known key material and its recipe derive the stored address",
  },
  args: {
    id: { type: "positional", required: false, description: "Puzzle identifier" },
    all: { type: "boolean", description: "Verify every puzzle" },
    collection: { type: "string", description: "Filter by collection key, for example b1000" },
    ...filterArgs,
    quiet: { type: "boolean", alias: "q", description: "Suppress per-puzzle output" },
    ...jsonArg,
  },
  async run({ args }) {
    const puzzles = await selected(args);
    const results = await Promise.all(puzzles.map((puzzle) => verify(puzzle)));
    if (args.json) {
      printLine(toJson(results));
    } else if (args.quiet !== true) {
      for (const result of results) {
        printLine(formatResult(result));
      }
    }
    if (
      results.some(
        (result) => failed(result) || (result.recipe !== undefined && failed(result.recipe)),
      )
    ) {
      process.exitCode = 1;
    }
  },
});

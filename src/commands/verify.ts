import { defineTool, Type } from "@agntn/tools";
import { closed, collectionArg, filterArgs, filterQuery, hasFilter } from "./filters.ts";
import { lines } from "./output.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import type { Puzzle } from "../core/puzzle.ts";
import type { RecipeResult, VerifyResult } from "../core/verify.ts";

/** The flags `selected()` reads. */
type VerifyArgs = Readonly<
  { all?: boolean | undefined; id?: string | undefined } & Parameters<typeof hasFilter>[0]
>;

/**
 * The puzzles one run checks: an id, filters or `--all`, exactly one, and never an empty set.
 *
 * @param {VerifyArgs} args - The parsed flags.
 * @returns {Promise<readonly Puzzle[]>} The puzzles, in dataset order.
 */
async function selected(args: VerifyArgs): Promise<readonly Puzzle[]> {
  const { all, requirePuzzle, selectPuzzles } = await import("../core/dataset.ts");
  const id = args.id !== undefined;
  const filtered = hasFilter(args);
  const everything = args.all === true;
  if ([id, filtered, everything].filter(Boolean).length > 1) {
    throw new InvalidArgumentError("id", "pass one of a puzzle identifier, filters or --all");
  }
  if (args.id !== undefined) {
    return [await requirePuzzle(args.id)];
  }
  if (filtered) {
    const puzzles = await selectPuzzles(await filterQuery(args));
    if (puzzles.length === 0) {
      throw new InvalidArgumentError("filters", "no puzzle matches them, so nothing was verified");
    }
    return puzzles;
  }
  if (everything) {
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

export default defineTool({
  name: "puzzles_verify",
  title: "Verify puzzles",
  description: "Verify that known key material and its recipe derive the stored address",
  effect: "read",
  input: closed({
    id: Type.Optional(Type.String({ description: "Puzzle identifier" })),
    all: Type.Optional(Type.Boolean({ description: "Verify every puzzle" })),
    ...collectionArg,
    ...filterArgs,
    quiet: Type.Optional(Type.Boolean({ description: "Suppress per-puzzle output" })),
  }),
  cli: { command: "verify", positional: ["id"], plain: ["id"], short: { quiet: "q" } },
  async execute(args) {
    const { verify } = await import("../core/verify.ts");
    const puzzles = await selected(args);
    const results = await Promise.all(puzzles.map((puzzle) => verify(puzzle)));
    if (
      results.some(
        (result) => failed(result) || (result.recipe !== undefined && failed(result.recipe)),
      )
    ) {
      process.exitCode = 1;
    }
    return lines(args.quiet === true ? [] : results.map(formatResult), results);
  },
});

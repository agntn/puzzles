import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { all, requirePuzzle } from "../core/dataset.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import type { Puzzle } from "../core/puzzle.ts";
import { toJson } from "../core/utils.ts";
import { verifyPuzzle, type VerifyResult } from "../core/verify.ts";

async function selectPuzzles(
  args: Readonly<{ all?: boolean | undefined; id?: string | undefined }>,
): Promise<readonly Puzzle[]> {
  if (args.all === true) {
    return all();
  }
  if (args.id === undefined) {
    throw new InvalidArgumentError("id", "pass a puzzle identifier or --all");
  }
  return [await requirePuzzle(args.id)];
}

function formatResult(result: VerifyResult): string {
  const label = result.verified ? "OK" : result.unavailable ? "SKIP" : "FAIL";
  const detail = result.error === null ? "" : `\t${result.error}`;
  return `${label}\t${result.id}${detail}`;
}

export default defineCommand({
  meta: {
    name: "verify",
    description: "Verify that known key material derives the stored address",
  },
  args: {
    id: { type: "positional", required: false, description: "Puzzle identifier" },
    all: { type: "boolean", description: "Verify every puzzle" },
    quiet: { type: "boolean", alias: "q", description: "Suppress per-puzzle output" },
    ...jsonArg,
  },
  async run({ args }) {
    const puzzles = await selectPuzzles(args);
    const results = await Promise.all(puzzles.map((puzzle) => verifyPuzzle(puzzle)));
    if (args.json) {
      printLine(toJson(results));
    } else if (args.quiet !== true) {
      for (const result of results) {
        printLine(formatResult(result));
      }
    }
    if (results.some((result) => !result.verified && !result.unavailable)) {
      process.exitCode = 1;
    }
  },
});

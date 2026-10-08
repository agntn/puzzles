import { defineTool, Type } from "@agntn/tools";
import { closed, filterArgs, filterQuery, plainWord } from "./filters.ts";
import { lines } from "./output.ts";

export default defineTool({
  name: "puzzles_list",
  title: "List puzzles",
  description:
    "List puzzles, optionally filtered by collection, address, chain, status and technique",
  effect: "read",
  input: closed({
    collection: Type.Optional(Type.String({ description: "Collection key, for example bits" })),
    ...filterArgs,
    limit: Type.Optional(
      Type.Integer({
        minimum: 1,
        description: "Print at most this many puzzles (default: every match)",
      }),
    ),
    offset: Type.Optional(
      Type.Integer({ minimum: 0, description: "Skip this many matching puzzles (default 0)" }),
    ),
  }),
  cli: { command: "list", positional: ["collection"] },
  async execute(args) {
    plainWord(args.collection);
    const { selectPuzzles } = await import("../core/dataset.ts");
    const { formatPuzzle } = await import("../core/utils.ts");
    const offset = args.offset ?? 0;
    const matched = await selectPuzzles(await filterQuery(args));
    const puzzles = matched.slice(
      offset,
      args.limit === undefined ? undefined : offset + args.limit,
    );
    return lines(puzzles.map(formatPuzzle), puzzles);
  },
});

import { defineTool, Type } from "@agntn/tools";
import { closed } from "./filters.ts";

export default defineTool({
  name: "puzzles_export",
  title: "Export the dataset",
  description: "Print the complete dataset built from the collection classes",
  effect: "read",
  input: closed({
    compact: Type.Optional(Type.Boolean({ description: "Print without indentation" })),
  }),
  /** The export is JSON already, so it skips `--json` and goes out byte for byte. */
  cli: { command: "export", json: false },
  async execute(args) {
    const { dataset } = await import("../core/dataset.ts");
    const { toJson } = await import("../core/utils.ts");
    process.stdout.write(`${toJson(await dataset(), args.compact)}\n`);
    return { content: [], details: null };
  },
});

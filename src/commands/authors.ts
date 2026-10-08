import { defineTool, Type } from "@agntn/tools";
import { closed, plainWord } from "./filters.ts";
import { lines } from "./output.ts";

export default defineTool({
  name: "puzzles_authors",
  title: "Puzzle authors",
  description: "List every author, or show one by author or collection key",
  effect: "read",
  input: closed({
    key: Type.Optional(Type.String({ description: "Author key, or a collection key" })),
  }),
  cli: { command: "authors", positional: ["key"] },
  async execute(args) {
    plainWord(args.key);
    const { authors, getAuthor, requireAuthor } = await import("../core/dataset.ts");
    const { getCollection } = await import("../core/registry.ts");
    const { formatAuthor, formatAuthorRecord } = await import("../core/utils.ts");
    if (args.key === undefined) {
      const entries = await authors();
      return lines(entries.map(formatAuthor), entries);
    }
    const fallback =
      (await getAuthor(args.key)) === undefined ? await getCollection(args.key) : undefined;
    const entry = await requireAuthor(fallback?.author.key ?? args.key);
    return lines([formatAuthorRecord(entry)], entry);
  },
});

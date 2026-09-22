import { defineCommand } from "citty";
import { jsonArg, printLine } from "./output.ts";
import { authors, getAuthor, requireAuthor } from "../core/dataset.ts";
import { getCollection } from "../core/registry.ts";
import { formatAuthor, formatAuthorRecord, toJson } from "../core/utils.ts";

export default defineCommand({
  meta: {
    name: "authors",
    description: "List every author, or show one by author or collection key",
  },
  args: {
    key: { type: "positional", description: "Author key, or a collection key", required: false },
    ...jsonArg,
  },
  async run({ args }) {
    if (args.key === undefined) {
      const entries = await authors();
      printLine(args.json ? toJson(entries) : entries.map(formatAuthor).join("\n"));
      return;
    }
    const fallback =
      (await getAuthor(args.key)) === undefined ? await getCollection(args.key) : undefined;
    const entry = await requireAuthor(fallback?.author.key ?? args.key);
    printLine(args.json ? toJson(entry) : formatAuthorRecord(entry));
  },
});

import { defineCommand } from "citty";
import { printLine } from "./output.ts";
import { dataset } from "../core/dataset.ts";
import { toJson } from "../core/utils.ts";

export default defineCommand({
  meta: {
    name: "export",
    description: "Print the complete dataset built from the collection classes",
  },
  args: {
    compact: { type: "boolean", description: "Print without indentation" },
  },
  async run({ args }) {
    printLine(toJson(await dataset(), args.compact));
  },
});

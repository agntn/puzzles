import { readdirSync } from "node:fs";
import { defineBuildConfig } from "obuild/config";

/** One input per collection file, so a new collection needs no edit here. */
const collectionInputs = readdirSync(new URL("src/collections/", import.meta.url))
  .filter((file) => file.endsWith(".ts") && file !== "index.ts")
  .map((file) => `./src/collections/${file}`);

export default defineBuildConfig({
  entries: [
    {
      /** One bundle, so the entries share chunks under `_chunks/`, where the tool probes look. */
      type: "bundle",
      input: [
        "./src/index.ts",
        "./src/cli.ts",
        "./src/mcp.ts",
        "./src/tool-operations.ts",
        "./src/tools.ts",
        ...collectionInputs,
      ],
      /** Declaration maps would point at a src/ the tarball doesn't carry. */
      dts: { sourcemap: false },
    },
  ],
});

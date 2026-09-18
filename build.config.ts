import { readdirSync } from "node:fs";
import { defineBuildConfig } from "obuild/config";

/**
 * Every collection module is its own bundle input, so the manifest's `import()`
 * resolves to a stable `dist/collections/<key>.mjs` that the `./collections/*`
 * export also serves. Read from the directory so a new collection needs only its
 * file and its manifest entry.
 */
const collectionInputs = readdirSync(new URL("./src/collections/", import.meta.url))
  .filter((file) => file.endsWith(".ts") && file !== "index.ts")
  .map((file) => `./src/collections/${file}`);

export default defineBuildConfig({
  /* One bundle, all inputs. The entries share the registry and core chunks, so nothing is embedded twice. */
  entries: [
    {
      type: "bundle",
      input: [
        "./src/index.ts",
        "./src/cli.ts",
        "./src/mcp.ts",
        "./src/tool-operations.ts",
        ...collectionInputs,
      ],
    },
  ],
  hooks: {
    /* typebox stays inline. Parsing it from node_modules costs every MCP spawn more than the bundled copy. */
    rolldownConfig(config) {
      const externals = Array.isArray(config.external) ? config.external : [];
      config.external = externals.filter(
        (entry) => entry !== "typebox" && !(entry instanceof RegExp && entry.test("typebox/value")),
      );
    },
  },
});

import { readdirSync } from "node:fs";
import { defineBuildConfig } from "obuild/config";

/** One input per collection file, so a new collection needs no edit here. */
const collectionInputs = readdirSync(new URL("src/collections/", import.meta.url))
  .filter((file) => file.endsWith(".ts") && file !== "index.ts")
  .map((file) => `./src/collections/${file}`);

/**
 * typebox stays inline, since every MCP spawn parses it slower from node_modules.
 * @param id - Module specifier.
 * @returns {boolean} Whether it names typebox or one of its subpaths.
 */
const isTypebox = (id: string): boolean => /^typebox(?:\/|$)/u.test(id);

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
        ...collectionInputs,
      ],
      /** Declaration maps would point at a src/ the tarball doesn't carry. */
      dts: { sourcemap: false },
    },
  ],
  hooks: {
    /**
     * obuild marks a peer external by name and by subpath pattern, and both have to go.
     * @param config - Rolldown input options obuild built.
     */
    rolldownConfig(config) {
      if (!Array.isArray(config.external)) return;
      config.external = config.external.filter((entry) =>
        typeof entry === "string"
          ? !isTypebox(entry)
          : !(entry instanceof RegExp && entry.test("typebox/value")),
      );
    },
  },
});

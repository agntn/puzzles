import oxfmt from "@agntn/ox/oxfmt";
import oxlint from "@agntn/ox/oxlint";
import { defineConfig } from "vite-plus";

const live = process.env["PUZZLES_LIVE"] === "1";

const readonlyParams = oxlint.rules?.["typescript/prefer-readonly-parameter-types"];
if (!Array.isArray(readonlyParams)) {
  throw new TypeError("@agntn/ox no longer configures typescript/prefer-readonly-parameter-types");
}
const [severity, options] = readonlyParams;

export default defineConfig({
  fmt: {
    ...oxfmt,
    ignorePatterns: ["dist", "coverage"],
  },
  lint: {
    ...oxlint,
    rules: {
      ...oxlint.rules,
      /**
       * TypedArrays have no readonly form in the TS lib. `Puzzle` and `Collection`
       * are immutable records whose only state sits in `#private` fields, which the
       * rule cannot inspect, and `Readonly<Puzzle>` would drop that private brand
       * from every public signature; counting methods as readonly keeps both classes
       * acceptable in the library and in the docs site, which type checks them as
       * files outside its own project. Nuxt Content's navigation tree and Vue's refs
       * are not ours to freeze.
       */
      "typescript/prefer-readonly-parameter-types": [
        severity,
        {
          ...options,
          treatMethodsAsReadonly: true,
          allow: [
            ...(options?.allow ?? []),
            { from: "lib", name: "Uint8Array" },
            { from: "package", name: "ContentNavigationItem", package: "@nuxt/content" },
            { from: "package", name: "Ref", package: "vue" },
            { from: "package", name: "Ref", package: "@vue/reactivity" },
          ],
        },
      ],
    },
    options: {
      ...oxlint.options,
      typeAware: true,
      typeCheck: true,
    },
    ignorePatterns: ["dist", "coverage"],
  },
  test: {
    /* Unit tests stub fetch through test/unit/setup.ts. Live roundtrips opt in with PUZZLES_LIVE=1. */
    include: live ? ["test/live/**/*.test.ts"] : ["test/unit/**/*.test.ts"],
    setupFiles: live ? [] : ["test/unit/setup.ts"],
    ...(live ? { testTimeout: 30_000 } : {}),
    /* Files sharing a worker reuse the evaluated record modules. The registry test resets the graph. */
    isolate: false,
  },
  /**
   * One bundle, all inputs. The entries share the registry and core chunks, so nothing is
   * embedded twice. Every collection module is its own input, so the manifest's `import()`
   * resolves to a stable `dist/collections/<key>.mjs` that the `./collections/*` export also
   * serves, and a new collection needs only its file and its manifest entry.
   */
  pack: {
    entry: {
      index: "src/index.ts",
      cli: "src/cli.ts",
      mcp: "src/mcp.ts",
      "tool-operations": "src/tool-operations.ts",
      "collections/*": ["src/collections/*.ts", "!src/collections/index.ts"],
    },
    /*
     * No source maps. The dts plugin takes `declarationMap` from tsconfig and turns on maps for the
     * runtime files too, over two thirds of the unpacked package, mostly the sources again in
     * `sourcesContent`, while the declaration maps pointed at a src/ the tarball does not carry.
     * The runtime files are not minified, so a stack trace reads without them.
     */
    dts: { sourcemap: false },
    format: "esm",
    platform: "node",
    /* Shared chunks keep stable names under _chunks, where the tool loading probes look for them. */
    hash: false,
    outputOptions: {
      chunkFileNames: "_chunks/[name].mjs",
      /* JSDoc ships once, in the declarations; the runtime files keep only legal and annotation comments. */
      comments: { jsdoc: false },
    },
    /* typebox stays inline. Parsing it from node_modules costs every MCP spawn more than the bundled copy. */
    deps: {
      onlyBundle: [/^typebox(?:\/|$)/u],
      alwaysBundle: [/^typebox(?:\/|$)/u],
    },
    /* The inlined typebox carries no license header of its own, so its MIT notice ships beside it. */
    copy: [{ from: "node_modules/typebox/license", rename: "typebox.LICENSE" }],
  },
});

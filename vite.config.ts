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
    /** changelogen owns the changelog. Tidying its ⚠️ spacing on main cancels the tag's Publish. */
    ignorePatterns: ["dist", "coverage", "/CHANGELOG.md"],
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
       * files outside its own project. Nuxt Content's navigation tree, Vue's refs
       * and the `AbortSignal` in the explorers' `ProviderConfig` are not ours to freeze.
       */
      "typescript/prefer-readonly-parameter-types": [
        severity,
        {
          ...options,
          treatMethodsAsReadonly: true,
          allow: [
            ...(options?.allow ?? []),
            { from: "lib", name: ["AbortSignal", "Uint8Array"] },
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
    /*
     * Some tests spawn the CLI or `vp fmt`, and a worker evaluates the record modules in whichever
     * test first asks for the dataset. A full parallel run takes either past the default 5 s, as it
     * did the source archives test on CI, so every test gets the live roundtrips' 30 s.
     */
    testTimeout: 30_000,
    /* Files sharing a worker reuse the evaluated record modules. The registry test resets the graph. */
    isolate: false,
  },
});

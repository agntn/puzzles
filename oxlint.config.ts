import oxlint from "@agntn/ox/oxlint";
import { defineConfig } from "oxlint";

const readonlyParams = oxlint.rules?.["typescript/prefer-readonly-parameter-types"];
if (!Array.isArray(readonlyParams)) {
  throw new TypeError("@agntn/ox no longer configures typescript/prefer-readonly-parameter-types");
}
const [severity, options] = readonlyParams;

export default defineConfig({
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
  ignorePatterns: ["dist", "coverage"],
});

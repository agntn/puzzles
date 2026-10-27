import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite-plus";
import { describe, expect, it } from "vite-plus/test";

const root = fileURLToPath(new URL("../..", import.meta.url));
const entry = join(root, "dist/index.mjs");

/* Bundles `names` into a Vite app and lists the packages it loads up front, lazy chunks aside. */
async function bundledPackages(names: readonly string[]): Promise<string[]> {
  const app = mkdtempSync(join(tmpdir(), "puzzles-consumer-"));
  try {
    const main = join(app, "main.js");
    writeFileSync(main, `export { ${names.join(", ")} } from ${JSON.stringify(entry)};\n`);
    const result = await build({
      root: app,
      configFile: false,
      logLevel: "silent",
      build: {
        write: false,
        lib: { entry: main, formats: ["es"] },
        rolldownOptions: { external: [/^node:/u] },
      },
    });
    const chunks = new Map(
      (Array.isArray(result) ? result : [result])
        .flatMap((bundle) => ("output" in bundle ? bundle.output : []))
        .flatMap((chunk) => (chunk.type === "chunk" ? [[chunk.fileName, chunk] as const] : [])),
    );
    const entryChunk = [...chunks.values()].find((chunk) => chunk.isEntry);
    const loaded = new Set(entryChunk === undefined ? [] : [entryChunk.fileName]);
    for (const name of loaded) {
      for (const next of chunks.get(name)?.imports ?? []) {
        loaded.add(next);
      }
    }
    const packages = [...loaded].flatMap((name) =>
      Object.keys(chunks.get(name)?.modules ?? {}).map(
        (id) => /.*\/node_modules\/((?:@[^/]+\/)?[^/]+)/u.exec(id)?.[1],
      ),
    );
    return [...new Set(packages.filter((name) => name !== undefined))].sort();
  } finally {
    rmSync(app, { recursive: true, force: true });
  }
}

describe.skipIf(!existsSync(entry))("a Vite app bundling the package", () => {
  it("prints a prize and its explorer link without any chain class", async () => {
    const packages = await bundledPackages(["puzzle", "chainSymbol", "addressExplorerUrl"]);

    expect(packages).not.toContain("@agntn/chains");
    expect(packages).not.toContain("@agntn/hashes");
  });

  it("still brings @agntn/chains along for an address check", async () => {
    const packages = await bundledPackages(["isValidAddress"]);

    expect(packages).toContain("@agntn/chains");
    expect(packages).toContain("@agntn/hashes");
  });
});

import { globSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

/**
 * Reads the dependencies of one package manifest.
 *
 * @param {string} path - The manifest, relative to this file.
 * @returns {Record<string, string>} Package names and their pinned versions.
 */
function dependencies(path: string): Record<string, string> {
  const manifest = JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8")) as {
    dependencies?: Record<string, string>;
  };
  return manifest.dependencies ?? {};
}

/* Every bare @agntn specifier src/core imports at runtime, dynamic imports included. */
function coreImports(): string[] {
  const directory = new URL("../../src/core/", import.meta.url);
  const specifiers = readdirSync(directory)
    .filter((file) => file.endsWith(".ts"))
    .flatMap((file) =>
      [
        ...readFileSync(new URL(file, directory), "utf8").matchAll(
          /(?:^import (?!type )[^;]*? from |import\()"(@agntn\/[^"]+)"/gmu,
        ),
      ].map((match) => match[1] ?? ""),
    );
  return [...new Set(specifiers)].sort();
}

/* The quoted names in one array literal of docs/nuxt.config.ts. */
function configList(name: string): string[] {
  const config = readFileSync(new URL("../../docs/nuxt.config.ts", import.meta.url), "utf8");
  const body = new RegExp(`const ${name} = \\[([^\\]]*)\\]`, "u").exec(config)?.[1] ?? "";
  return [...body.matchAll(/"([^"]+)"/gu)].map((match) => match[1] ?? "");
}

/* Bare specifiers after `from` or in `import()`, never `#imports`, `~/` or template text. */
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(\s*)["']([@a-z][^"'\s]*)["']/gu;

/* Every package the site's own sources import, without `node:` builtins and the library alias. */
function siteImports(): string[] {
  const docs = new URL("../../docs/", import.meta.url);
  const files = globSync(["app/**/*.{ts,vue}", "server/**/*.ts", "shared/**/*.ts", "*.ts"], {
    cwd: docs,
  });
  const names = files.flatMap((file) =>
    [...readFileSync(new URL(file, docs), "utf8").matchAll(SPECIFIER)].map((match) => {
      const parts = (match[1] ?? "").split("/");
      return parts.slice(0, parts[0]?.startsWith("@") === true ? 2 : 1).join("/");
    }),
  );
  return [...new Set(names)].filter(
    (name) => !name.startsWith("node:") && !name.startsWith("@agntn/puzzles"),
  );
}

/*
 * The site bundles the checkout's src/ through the same pnpm workspace, so docs/package.json
 * names what src/ imports from the same catalog. Another version there runs code the library was
 * never tested against.
 */
describe("docs dependencies", () => {
  it("declare every package the site imports, since the workspace hoists nothing", () => {
    const manifest = JSON.parse(
      readFileSync(new URL("../../docs/package.json", import.meta.url), "utf8"),
    ) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const declared = { ...manifest.dependencies, ...manifest.devDependencies };
    const imported = siteImports();
    expect(imported).toContain("@nuxt/content");
    expect(imported.filter((name) => declared[name] === undefined)).toEqual([]);
  });

  it("pin every shared @agntn package at the library's version", () => {
    const library = dependencies("../../package.json");
    const site = dependencies("../../docs/package.json");
    const shared = Object.keys(site).filter((name) => name.startsWith("@agntn/"));
    expect(shared.length).toBeGreaterThan(0);
    for (const name of shared) {
      expect({ name, version: site[name] }).toEqual({ name, version: library[name] });
    }
  });

  it("list every package src/core imports where the docs build resolves and bundles it", () => {
    const site = dependencies("../../docs/package.json");
    const specifiers = coreImports();
    const packages = [
      ...new Set(specifiers.map((specifier) => /^@[^/]+\/[^/]+/u.exec(specifier)?.[0] ?? "")),
    ];
    expect(specifiers).toContain("@agntn/keys/arweave");
    expect(packages.filter((name) => site[name] === undefined)).toEqual([]);
    expect(packages.filter((name) => !configList("libraryDependencies").includes(name))).toEqual(
      [],
    );
    expect(
      specifiers.filter((specifier) => !configList("libraryEntries").includes(specifier)),
    ).toEqual([]);
  });
});

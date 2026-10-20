import { readdirSync, readFileSync } from "node:fs";
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

/*
 * The site bundles the checkout's src/, but Workers Builds installs docs/ alone, so docs/package.json
 * repeats what src/ imports. Another version there runs code the library was never tested against.
 */
describe("docs dependencies", () => {
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

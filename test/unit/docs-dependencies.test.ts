import { readFileSync } from "node:fs";
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
});

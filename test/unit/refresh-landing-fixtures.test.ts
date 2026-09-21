import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { refreshLandingFixtures } from "../../scripts/refresh-landing-fixtures.ts";

const temporaryDirectories: string[] = [];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
  for (const directory of temporaryDirectories) {
    rmSync(directory, { force: true, recursive: true });
  }
  temporaryDirectories.length = 0;
});

describe("landing fixture refresh", () => {
  it("reports stale output without writing and refreshes idempotently", async () => {
    const source = readFileSync("docs/app/utils/landing.ts", "utf8");
    const stale = source.replace(/dataVersion: "[0-9a-f]{12}"/u, 'dataVersion: "stale"');
    expect(stale).not.toBe(source);

    const directory = mkdtempSync(join(tmpdir(), "puzzles-landing-fixtures-"));
    temporaryDirectories.push(directory);
    const targetPath = join(directory, "landing.ts");
    writeFileSync(targetPath, stale);

    expect(await refreshLandingFixtures({ check: true, targetPath })).toBe("stale");
    expect(readFileSync(targetPath, "utf8")).toBe(stale);
    expect(await refreshLandingFixtures({ targetPath })).toBe("updated");
    const refreshed = readFileSync(targetPath, "utf8");
    expect(await refreshLandingFixtures({ targetPath })).toBe("current");
    expect(readFileSync(targetPath, "utf8")).toBe(refreshed);
  });

  it("updates the sample and dataset version from a synthetic registry record", async () => {
    vi.stubGlobal("fetch", () => {
      throw new Error("The landing fixture generator must not use the network");
    });
    /* Dynamic imports intentionally rebuild the shared registry graph; it has no unregister API. */
    vi.resetModules();
    const library = await import("../../src/index.ts");
    const { buildLandingFixtures, refreshLandingFixtures: refreshSyntheticFixtures } =
      await import("../../scripts/refresh-landing-fixtures.ts");
    const before = await buildLandingFixtures([]);
    const puzzle = library.bitcoinPuzzle({
      id: "fixture/one",
      address: library.p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-09-21",
    });
    library.registerCollection(
      new library.NamedCollection("fixture", library.party("Fixture"), [puzzle]),
    );

    const after = await buildLandingFixtures(["fixture/one"]);
    const directory = mkdtempSync(join(tmpdir(), "puzzles-landing-synthetic-"));
    temporaryDirectories.push(directory);
    const targetPath = join(directory, "landing.ts");
    writeFileSync(targetPath, readFileSync("docs/app/utils/landing.ts", "utf8"));
    expect(await refreshSyntheticFixtures({ targetPath, walk: ["fixture/one"] })).toBe("updated");
    const generated = readFileSync(targetPath, "utf8");

    expect(after.samples[0]?.id).toBe("fixture/one");
    expect(after.samples[0]?.tool).toContain("fixture/one");
    expect(after.stats.total).toBe(before.stats.total + 1);
    expect(after.stats.dataVersion).not.toBe(before.stats.dataVersion);
    expect(after.facts.at(-1)?.key).toBe("fixture");
    expect(after.facts.at(-1)?.total).toBe(1);
    expect(generated).toContain('id: "fixture/one"');
    expect(generated).toContain(`dataVersion: "${after.stats.dataVersion}"`);
  });
});

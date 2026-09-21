import { execFile } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it, vi } from "vitest";
import { refreshLandingFixtures } from "../../scripts/refresh-landing-fixtures.ts";

const temporaryDirectories: string[] = [];
const execute = promisify(execFile);

interface CommandFailure {
  readonly code: number;
  readonly stderr: string;
  readonly stdout: string;
}

async function commandFailure(cwd: string, ...args: readonly string[]): Promise<CommandFailure> {
  try {
    await execute(process.execPath, ["scripts/refresh-landing-fixtures.ts", ...args], { cwd });
  } catch (error) {
    const { code, stderr, stdout } = error as CommandFailure;
    return { code, stderr, stdout };
  }
  throw new Error(`fixtures ${args.join(" ")} exited 0`);
}

function copyFixtureCheckout(directory: string): void {
  mkdirSync(join(directory, "scripts"), { recursive: true });
  mkdirSync(join(directory, "docs", "app"), { recursive: true });
  cpSync(
    "scripts/refresh-landing-fixtures.ts",
    join(directory, "scripts", "refresh-landing-fixtures.ts"),
  );
  cpSync("docs/app/utils", join(directory, "docs", "app", "utils"), { recursive: true });
  cpSync("src", join(directory, "src"), { recursive: true });
  cpSync("oxfmt.config.ts", join(directory, "oxfmt.config.ts"));
  cpSync("package.json", join(directory, "package.json"));
  symlinkSync(resolve("node_modules"), join(directory, "node_modules"), "junction");
}

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

  it("refreshes CRLF fixtures without changing their line endings", async () => {
    const source = readFileSync("docs/app/utils/landing.ts", "utf8")
      .replaceAll(/\r?\n/gu, "\r\n")
      .replace(/dataVersion: "[0-9a-f]{12}"/u, 'dataVersion: "stale"');
    const directory = mkdtempSync(join(tmpdir(), "puzzles-landing-crlf-"));
    temporaryDirectories.push(directory);
    const targetPath = join(directory, "landing.ts");
    writeFileSync(targetPath, source);

    expect(await refreshLandingFixtures({ check: true, targetPath })).toBe("stale");
    expect(await refreshLandingFixtures({ targetPath })).toBe("updated");
    const refreshed = readFileSync(targetPath, "utf8");
    expect(refreshed.replaceAll("\r\n", "")).not.toContain("\n");
    expect(await refreshLandingFixtures({ check: true, targetPath })).toBe("current");
  });

  it("rejects an end marker before the generated region", async () => {
    const source = `/* generated:landing-fixtures:end */\n${readFileSync("docs/app/utils/landing.ts", "utf8")}`;
    const directory = mkdtempSync(join(tmpdir(), "puzzles-landing-malformed-"));
    temporaryDirectories.push(directory);
    const targetPath = join(directory, "landing.ts");
    writeFileSync(targetPath, source);

    await expect(refreshLandingFixtures({ targetPath })).rejects.toThrow(
      `Expected one generated landing fixture region in ${targetPath}`,
    );
    expect(readFileSync(targetPath, "utf8")).toBe(source);
  });

  it("exposes check and usage failures through the command entrypoint", async () => {
    const directory = mkdtempSync(join(tmpdir(), "puzzles-landing-command-"));
    temporaryDirectories.push(directory);
    copyFixtureCheckout(directory);
    const targetPath = join(directory, "docs", "app", "utils", "landing.ts");
    const source = readFileSync(targetPath, "utf8");
    const stale = source.replace(/dataVersion: "[0-9a-f]{12}"/u, 'dataVersion: "stale"');
    writeFileSync(targetPath, stale);

    await expect(commandFailure(directory, "--check")).resolves.toEqual({
      code: 1,
      stderr: "Landing fixtures are stale. Run `pnpm fixtures`.\n",
      stdout: "",
    });
    const updated = await execute(process.execPath, ["scripts/refresh-landing-fixtures.ts"], {
      cwd: directory,
    });
    expect(updated).toEqual({
      stderr: "",
      stdout: "Updated docs/app/utils/landing.ts.\n",
    });
    const current = await execute(
      process.execPath,
      ["scripts/refresh-landing-fixtures.ts", "--check"],
      { cwd: directory },
    );
    expect(current).toEqual({
      stderr: "",
      stdout: "Landing fixtures are current.\n",
    });
    await expect(commandFailure(directory, "--unknown")).resolves.toEqual({
      code: 1,
      stderr: "Usage: pnpm fixtures [--check]\n",
      stdout: "",
    });
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

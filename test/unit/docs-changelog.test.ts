import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import {
  datedReleases,
  parseChangelog,
  parseInline,
  releaseAnchor,
} from "../../docs/shared/changelog.ts";

const source = readFileSync(new URL("../../CHANGELOG.md", import.meta.url), "utf8");
const releases = parseChangelog(source);

describe("docs changelog", () => {
  it("reads every versioned heading of CHANGELOG.md, newest first, and skips [Unreleased]", () => {
    const headings = source.match(/^## (?:v|\[)\d+\.\d+\.\d+/gm) ?? [];
    expect(releases).toHaveLength(headings.length);
    expect(releases[0]?.version).toBe(
      (JSON.parse(readFileSync("package.json", "utf8")) as { version: string }).version,
    );
    expect(releases.at(-1)?.version).toBe("0.1.0");
    expect(releases.map((release) => release.version)).not.toContain("Unreleased");
    for (const release of releases) {
      expect(release.groups.length, release.version).toBeGreaterThan(0);
      for (const group of release.groups) expect(group.entries.length).toBeGreaterThan(0);
    }
  });

  it("reads a changelogen release: compare link, scopes, breaking marks, contributors", () => {
    const release = releases.find((entry) => entry.version === "0.23.0")!;
    expect(release.headingDate).toBeUndefined();
    expect(release.compare).toBe("https://github.com/agntn/puzzles/compare/v0.22.0...v0.23.0");
    expect(release.url).toBe("https://github.com/agntn/puzzles/releases/tag/v0.23.0");
    expect(release.contributors).toEqual([
      { name: "Aeitwoen", url: "https://github.com/aeitwoen" },
    ]);
    expect(release.groups.map((group) => group.title)).toEqual([
      "Enhancements",
      "Fixes",
      "Refactors",
      "Chore",
      "Tests",
    ]);
    const rename = release.groups[2]!.entries[1]!;
    expect(rename).toEqual({
      scope: "verify",
      breaking: true,
      spans: [
        { kind: "text", text: "Rename verifyPuzzle to verify (" },
        { kind: "link", text: "#288", href: "https://github.com/agntn/puzzles/pull/288" },
        { kind: "text", text: ")" },
      ],
    });
  });

  it("reads the Keep a Changelog and git-cliff years: heading dates, scopes, bare issue numbers", () => {
    const release = releases.find((entry) => entry.version === "0.12.0")!;
    expect(release.headingDate).toBe("2026-01-05");
    expect(release.compare).toBeUndefined();
    expect(release.groups[0]?.entries[0]).toEqual({
      scope: "solvers",
      breaking: false,
      spans: [
        { kind: "text", text: "Add " },
        { kind: "code", text: "retired_coder" },
        { kind: "text", text: " (" },
        { kind: "link", text: "#71", href: "https://github.com/agntn/puzzles/issues/71" },
        { kind: "text", text: ")" },
      ],
    });
  });

  it("splits text into code, bold, links and plain runs", () => {
    expect(parseInline("a `b` **c** [d](https://e.test/f) g")).toEqual([
      { kind: "text", text: "a " },
      { kind: "code", text: "b" },
      { kind: "text", text: " " },
      { kind: "strong", text: "c" },
      { kind: "text", text: " " },
      { kind: "link", text: "d", href: "https://e.test/f" },
      { kind: "text", text: " g" },
    ]);
  });

  it("keeps a link that isn't http(s) as text, since commit subjects write the file", () => {
    expect(parseInline("see [x](javascript:alert(1)) now")).toEqual([
      { kind: "text", text: "see [x](javascript:alert(1)) now" },
    ]);
  });

  it("dates a release by npm first, by its heading second, and leaves it undated otherwise", () => {
    const dated = datedReleases(
      [
        { version: "2.0.0", url: "", groups: [], contributors: [] },
        { version: "1.0.0", headingDate: "2026-01-01", url: "", groups: [], contributors: [] },
        { version: "0.1.0", headingDate: "2025-01-01", url: "", groups: [], contributors: [] },
      ],
      { "2.0.0": "2026-02-02T10:00:00.000Z", "1.0.0": "2026-01-01T12:00:00.000Z" },
    );
    expect(dated.map((release) => release.date)).toEqual([
      "2026-02-02T10:00:00.000Z",
      "2026-01-01T12:00:00.000Z",
      "2025-01-01",
    ]);
    expect(dated[0]).not.toHaveProperty("headingDate");
  });

  it("anchors a release by its version", () => {
    expect(releaseAnchor("0.23.0")).toBe("v0-23-0");
  });
});

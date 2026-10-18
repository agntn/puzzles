import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import {
  changelogReleases,
  parseInline,
  registryReleases,
  releaseAnchor,
  type GitHubRelease,
} from "../../docs/shared/changelog.ts";

/* Real notes: v0.23.0 by changelogen, v0.19.0 by git-cliff, v0.12.0 by hand, archives v0.7.4 by uppt. */
const fixtures = JSON.parse(
  readFileSync(new URL("../support/github-releases.json", import.meta.url), "utf8"),
) as { puzzles: GitHubRelease[]; archivesUppt: GitHubRelease };
const releases = changelogReleases(fixtures.puzzles, {});

/* A release the tests write themselves, with the fields the log does not read filled in. */
function release(tag: string, body: string, extra: Partial<GitHubRelease> = {}): GitHubRelease {
  return {
    tag_name: tag,
    html_url: `https://github.com/agntn/puzzles/releases/tag/${tag}`,
    draft: false,
    published_at: "2026-10-16T10:00:00Z",
    body,
    ...extra,
  };
}

describe("docs changelog", () => {
  it("orders the releases newest first and skips drafts and tags that aren't versions", () => {
    const listed = changelogReleases(
      [
        release("v0.9.0", ""),
        release("v0.10.0", ""),
        release("v0.10.0-beta.1", ""),
        release("v0.10.0-rc-1", ""),
        release("v0.9.1+build.5", ""),
        release("v0.11.0", "", { draft: true }),
        release("latest", ""),
        release("v1.0.0-beta..1", ""),
      ],
      {},
    );
    expect(listed.map((entry) => entry.version)).toEqual([
      "0.10.0",
      "0.10.0-rc-1",
      "0.10.0-beta.1",
      "0.9.1+build.5",
      "0.9.0",
    ]);
  });

  it("orders prereleases of one version by semver precedence, newest first", () => {
    const tags = [
      "v1.0.0-0",
      "v1.0.0-beta.9",
      "v1.0.0-rc.0",
      "v1.0.0-1",
      "v1.0.0-beta.10",
      "v1.0.0-beta",
    ];
    const listed = changelogReleases(
      [...tags, "v1.0.0"].map((tag) => release(tag, "")),
      {},
    );
    expect(listed.map((entry) => entry.version)).toEqual([
      "1.0.0",
      "1.0.0-rc.0",
      "1.0.0-beta.10",
      "1.0.0-beta.9",
      "1.0.0-beta",
      "1.0.0-1",
      "1.0.0-0",
    ]);
  });

  it("reads changelogen notes: compare link, scopes, breaking marks, contributors", () => {
    const notes = releases.find((entry) => entry.version === "0.23.0")!;
    expect(notes.compare).toBe("https://github.com/agntn/puzzles/compare/v0.22.0...v0.23.0");
    expect(notes.url).toBe("https://github.com/agntn/puzzles/releases/tag/v0.23.0");
    expect(notes.contributors).toEqual([
      { name: "aeitwoen", url: "https://github.com/aeitwoen" },
      { name: "oritwoen", url: "https://github.com/oritwoen" },
    ]);
    expect(notes.groups.map((group) => group.title)).toEqual([
      "Enhancements",
      "Fixes",
      "Refactors",
      "Chore",
      "Tests",
    ]);
    expect(notes.groups[2]!.entries[1]).toEqual({
      scope: "verify",
      breaking: true,
      spans: [
        { kind: "text", text: "Rename verifyPuzzle to verify (" },
        { kind: "link", text: "#288", href: "https://github.com/agntn/puzzles/pull/288" },
        { kind: "text", text: ")" },
      ],
    });
    const entries = notes.groups.flatMap((group) => group.entries);
    expect(entries.filter((entry) => entry.breaking)).toHaveLength(1);
  });

  it("reads uppt notes: the Changelog wrapper opens no group, breaking comes before the scope", () => {
    const [notes] = changelogReleases(
      [
        fixtures.archivesUppt,
        release(
          "v1.0.0",
          "## 👉 Changelog\n\n### 🚀 Enhancements\n\n- ⚠️  **tools:** drop `x` (#9)",
        ),
      ],
      {},
    );
    expect(notes!.groups[0]!.entries[0]).toEqual({
      scope: "tools",
      breaking: true,
      spans: [
        { kind: "text", text: "drop " },
        { kind: "code", text: "x" },
        { kind: "text", text: " (" },
        { kind: "link", text: "#9", href: "https://github.com/agntn/puzzles/issues/9" },
        { kind: "text", text: ")" },
      ],
    });

    const archives = changelogReleases([fixtures.archivesUppt], {})[0]!;
    expect(archives.compare).toBe("https://github.com/agntn/archives/compare/v0.7.3...v0.7.4");
    expect(archives.groups.map((group) => group.title)).toEqual([
      "Enhancements",
      "Performance",
      "Fixes",
      "Refactors",
      "Build",
      "Chore",
      "CI",
    ]);
    expect(archives.groups[1]!.entries[0]).toMatchObject({ scope: "tools", breaking: false });
    expect(archives.contributors).toEqual([
      { name: "aeitwoen", url: "https://github.com/aeitwoen" },
      { name: "Ori", url: "https://github.com/oritwoen" },
    ]);
  });

  it("reads git-cliff notes with their scopes", () => {
    const notes = releases.find((entry) => entry.version === "0.19.0")!;
    expect(notes.groups.map((group) => group.title)).toEqual(["Features"]);
    expect(notes.groups[0]!.entries.map((entry) => entry.scope)).toEqual(["rushwallet", "b1000"]);
  });

  it("keeps the bullets of notes written by hand and leaves their paragraphs on GitHub", () => {
    const notes = releases.find((entry) => entry.version === "0.12.0")!;
    expect(notes.compare).toBeUndefined();
    expect(notes.groups.map((group) => group.title)).toEqual(["What's new"]);
    expect(notes.groups[0]!.entries[1]).toEqual({
      breaking: false,
      spans: [
        { kind: "code", text: "retired_coder" },
        { kind: "text", text: " solver profile" },
      ],
    });
    expect(notes.contributors).toEqual([{ name: "aeitwoen", url: "https://github.com/aeitwoen" }]);
  });

  it("reads no bullet out of a code block and drops a group that has none", () => {
    const [notes] = changelogReleases(
      [release("v1.0.0", "## Usage\n\n```bash\n- not an entry\n```\n\n## Fixes\n\n- real one")],
      {},
    );
    expect(notes!.groups).toEqual([
      {
        title: "Fixes",
        entries: [{ breaking: false, spans: [{ kind: "text", text: "real one" }] }],
      },
    ]);
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

  it("keeps a link that isn't http(s) as text, since commit subjects write the notes", () => {
    expect(parseInline("see [x](javascript:alert(1)) now")).toEqual([
      { kind: "text", text: "see [x](javascript:alert(1)) now" },
    ]);
  });

  it("dates a release by npm first, by GitHub second, and leaves it undated otherwise", () => {
    const dated = changelogReleases(
      [release("v2.0.0", ""), release("v1.0.0", ""), release("v0.1.0", "", { published_at: null })],
      { "2.0.0": "2026-02-02T10:00:00.000Z", constructor: "2026-01-01T00:00:00.000Z" },
    );
    expect(dated.map((entry) => entry.date)).toEqual([
      "2026-02-02T10:00:00.000Z",
      "2026-10-16T10:00:00Z",
      undefined,
    ]);
    expect(dated[2]).not.toHaveProperty("date");
  });

  it("lists npm's versions as bare releases when GitHub turned the build away", () => {
    const listed = changelogReleases(
      registryReleases({
        created: "2026-01-01T00:00:00.000Z",
        "0.20.0": "2026-09-01T10:00:00.000Z",
        "0.21.0": "2026-09-08T10:00:00.000Z",
        modified: "2026-10-16T10:00:00.000Z",
      }),
      {},
    );
    expect(listed).toEqual([
      {
        version: "0.21.0",
        date: "2026-09-08T10:00:00.000Z",
        url: "https://github.com/agntn/puzzles/releases/tag/v0.21.0",
        groups: [],
        contributors: [],
      },
      {
        version: "0.20.0",
        date: "2026-09-01T10:00:00.000Z",
        url: "https://github.com/agntn/puzzles/releases/tag/v0.20.0",
        groups: [],
        contributors: [],
      },
    ]);
  });

  it("anchors a release by its version", () => {
    expect(releaseAnchor("0.23.0")).toBe("v0-23-0");
  });
});

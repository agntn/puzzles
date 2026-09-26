/**
 * CHANGELOG.md as data: the shape /api/changelog answers and the parser that builds it. No import
 * of the file and no network here, so the page, the server and the tests share it.
 */

/** One run of text in an entry: plain, inline code, bold, or a link. */
export interface ChangelogSpan {
  readonly kind: "text" | "code" | "strong" | "link";
  readonly text: string;
  readonly href?: string;
}

export interface ChangelogEntry {
  /** The scope of a conventional commit, `docs` in `**docs:** …` or `_(docs)_ …`. */
  readonly scope?: string;
  readonly breaking: boolean;
  readonly spans: readonly ChangelogSpan[];
}

export interface ChangelogGroup {
  readonly title: string;
  readonly entries: readonly ChangelogEntry[];
}

export interface ChangelogContributor {
  readonly name: string;
  readonly url?: string;
}

export interface ChangelogRelease {
  readonly version: string;
  /** ISO date: the npm publish time, else the date in the heading; absent when neither exists. */
  readonly date?: string;
  readonly url: string;
  readonly compare?: string;
  readonly groups: readonly ChangelogGroup[];
  readonly contributors: readonly ChangelogContributor[];
}

/**
 * The anchor of a release on /changelog, `v0-23-0` for 0.23.0.
 *
 * @param {string} version - The version without `v`.
 * @returns {string} The fragment, without `#`.
 */
export function releaseAnchor(version: string): string {
  return `v${version.replaceAll(".", "-")}`;
}

const REPOSITORY = "https://github.com/agntn/puzzles";

/** `## v0.23.0` from changelogen, `## [0.19.0] - 2026-08-01` from the Keep a Changelog years. */
const RELEASE_HEADING = /^v?\[?(\d+\.\d+\.\d+(?:-[\w.]+)?)\]?(?:\s+-\s+(\d{4}-\d{2}-\d{2}))?$/;
const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|\(#(\d+)\)/g;
const CHANGELOGEN_SCOPE = /^\*\*([^*]+):\*\*\s+/;
const CLIFF_SCOPE = /^_\(([^)]+)\)_\s+/;
const BREAKING = /^⚠️\s+/;
const WEB_URL = /^https?:\/\//;
const CONTRIBUTOR = /^(.+?)\s+\(\[@[^\]]+\]\(([^)\s]+)\)\)$/;

/**
 * Splits the text of one entry into plain runs, code, bold and links. A bare `(#71)` from the
 * git-cliff years links to the issue, which GitHub forwards to the pull request of that number.
 * The file is written from commit subjects, so a link that isn't http(s) stays text.
 *
 * @param {string} text - The entry without its bullet and scope.
 * @returns {ChangelogSpan[]} The runs in order.
 */
export function parseInline(text: string): ChangelogSpan[] {
  const spans: ChangelogSpan[] = [];
  const pushText = (value: string): void => {
    const previous = spans.at(-1);
    if (previous?.kind === "text")
      spans[spans.length - 1] = { kind: "text", text: previous.text + value };
    else if (value) spans.push({ kind: "text", text: value });
  };
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    pushText(text.slice(last, match.index));
    const [, code, strong, label, href, issue] = match;
    if (code !== undefined) spans.push({ kind: "code", text: code });
    else if (strong !== undefined) spans.push({ kind: "strong", text: strong });
    else if (label !== undefined && href && WEB_URL.test(href))
      spans.push({ kind: "link", text: label, href });
    else if (label !== undefined) pushText(match[0]);
    else {
      pushText("(");
      spans.push({ kind: "link", text: `#${issue}`, href: `${REPOSITORY}/issues/${issue}` });
      pushText(")");
    }
    last = match.index + match[0].length;
  }
  pushText(text.slice(last));
  return spans;
}

/**
 * Reads one bullet: the scope in either format, the breaking mark changelogen puts after it, then
 * the text.
 *
 * @param {string} line - The bullet without `- `.
 * @returns {ChangelogEntry} The entry.
 */
function parseEntry(line: string): ChangelogEntry {
  const scoped = CHANGELOGEN_SCOPE.exec(line) ?? CLIFF_SCOPE.exec(line);
  let rest = scoped ? line.slice(scoped[0].length) : line;
  const breaking = BREAKING.test(rest);
  if (breaking) rest = rest.replace(BREAKING, "");
  return {
    ...(scoped ? { scope: scoped[1] } : {}),
    breaking,
    spans: parseInline(rest),
  };
}

/** A release as the file has it: dated by its heading at most, the npm time comes later. */
export interface ParsedRelease extends Omit<ChangelogRelease, "date"> {
  readonly headingDate?: string;
}

interface DraftGroup {
  title: string;
  entries: ChangelogEntry[];
}

interface DraftRelease {
  version: string;
  url: string;
  headingDate?: string;
  compare?: string;
  groups: DraftGroup[];
  contributors: ChangelogContributor[];
}

const COMPARE = "[compare changes](";

/**
 * The group a `###` heading opens. A `####` heading is changelogen's repeat of the breaking
 * entries, which keep their mark where they stand, so it opens nothing.
 *
 * @param {string} line - The heading line.
 * @returns {DraftGroup | "contributors" | undefined} Where the bullets below it go.
 */
function openGroup(line: string): DraftGroup | "contributors" | undefined {
  if (!line.startsWith("### ")) return undefined;
  const title = line.slice(4).replace(/^[^\p{L}]+/u, "");
  return title === "Contributors" ? "contributors" : { title, entries: [] };
}

/**
 * A contributor line, `Name ([@handle](url))` as changelogen writes it, or a bare name.
 *
 * @param {string} text - The bullet without `- `.
 * @returns {ChangelogContributor} The contributor.
 */
function parseContributor(text: string): ChangelogContributor {
  const match = CONTRIBUTOR.exec(text);
  return match && WEB_URL.test(match[2]!) ? { name: match[1]!, url: match[2] } : { name: text };
}

/**
 * Reads the lines of one release section, below its heading.
 *
 * @param {string} version - The version from the heading.
 * @param {string | undefined} headingDate - The day from the heading, if it has one.
 * @param {readonly string[]} lines - The section's lines.
 * @returns {ParsedRelease} The release.
 */
function parseRelease(
  version: string,
  headingDate: string | undefined,
  lines: readonly string[],
): ParsedRelease {
  const release: DraftRelease = {
    version,
    ...(headingDate ? { headingDate } : {}),
    url: `${REPOSITORY}/releases/tag/v${version}`,
    groups: [],
    contributors: [],
  };
  let group: DraftGroup | "contributors" | undefined;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("#")) {
      group = openGroup(line);
      if (typeof group === "object") release.groups.push(group);
    } else if (line.startsWith(COMPARE)) release.compare = line.slice(COMPARE.length, -1);
    else if (!line.startsWith("- ") || !group) continue;
    else if (group !== "contributors") group.entries.push(parseEntry(line.slice(2)));
    else release.contributors.push(parseContributor(line.slice(2)));
  }
  return release;
}

/**
 * Parses CHANGELOG.md as both tools wrote it: changelogen from v0.20.1 on, Keep a Changelog and
 * git-cliff before. Sections without a version (`[Unreleased]`) are skipped. changelogen repeats
 * the breaking entries under `#### ⚠️ Breaking Changes`; they keep their mark in their own group
 * and the repeat is dropped. The contributors become a list of their own.
 *
 * @param {string} markdown - The changelog.
 * @returns {ParsedRelease[]} Releases, newest first, as in the file, dated by their heading only.
 */
export function parseChangelog(markdown: string): ParsedRelease[] {
  return markdown
    .split(/^## /m)
    .slice(1)
    .flatMap((section) => {
      const [heading = "", ...lines] = section.split("\n");
      const match = RELEASE_HEADING.exec(heading.trim());
      return match ? [parseRelease(match[1]!, match[2], lines)] : [];
    });
}

/**
 * Dates the parsed releases: the npm publish time when the registry has one, else the day in the
 * heading, else none.
 *
 * @param {readonly ParsedRelease[]} drafts - The parsed releases.
 * @param {Readonly<Record<string, string>>} times - The registry's `time`, keyed by version.
 * @returns {ChangelogRelease[]} The releases with their dates.
 */
export function datedReleases(
  drafts: readonly ParsedRelease[],
  times: Readonly<Record<string, string>>,
): ChangelogRelease[] {
  return drafts.map(({ headingDate, ...release }) => {
    const date = times[release.version] ?? headingDate;
    return { ...release, ...(date ? { date } : {}) };
  });
}

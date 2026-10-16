/**
 * GitHub Releases as data: the shape /api/changelog answers and the parser that builds it. No
 * network here, so the page, the server and the tests share it.
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
  /** ISO date: the npm publish time, else the GitHub release time; absent when neither exists. */
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

/** SemVer 2.0.0 with a `v`: dot separated prerelease and build identifiers of `[0-9A-Za-z-]`. */
const RELEASE_TAG =
  /^v(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
/** `##` and `###` open a group. `####` is changelogen's repeat of the breaking entries. */
const GROUP_HEADING = /^#{2,3} (.+)$/;
const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|\(#(\d+)\)/g;
const CHANGELOGEN_SCOPE = /^\*\*([^*]+):\*\*\s+/;
const CLIFF_SCOPE = /^_\(([^)]+)\)_\s+/;
const BREAKING = /^⚠️\s*/;
const WEB_URL = /^https?:\/\//;
const CONTRIBUTOR = /^(.+?)\s+\(\[@[^\]]+\]\(([^)\s]+)\)\)$/;
/** uppt writes `aeitwoen (@aeitwoen)`, the notes written by hand a bare `@oritwoen`. */
const HANDLE = /^(?:(.+?)\s+\()?@([\w-]+)\)?$/;

/**
 * Splits the text of one entry into plain runs, code, bold and links. A bare `(#71)`, as uppt and
 * the git-cliff years write it, links to the issue, which GitHub forwards to the pull request of
 * that number. The notes are written from commit subjects, so a link that isn't http(s) stays text.
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

/** The fields of a release the log reads, as the GitHub REST API answers them. */
export interface GitHubRelease {
  readonly tag_name: string;
  readonly html_url: string;
  readonly draft: boolean;
  readonly published_at: string | null;
  readonly body: string | null;
}

/**
 * Reads one bullet: the breaking mark uppt puts first, the scope in either format, the breaking
 * mark changelogen puts after it, then the text.
 *
 * @param {string} line - The bullet without `- `.
 * @returns {ChangelogEntry} The entry.
 */
function parseEntry(line: string): ChangelogEntry {
  const leading = BREAKING.test(line);
  let rest = line.replace(BREAKING, "");
  const scoped = CHANGELOGEN_SCOPE.exec(rest) ?? CLIFF_SCOPE.exec(rest);
  if (scoped) rest = rest.slice(scoped[0].length);
  const trailing = BREAKING.test(rest);
  return {
    ...(scoped ? { scope: scoped[1] } : {}),
    breaking: leading || trailing,
    spans: parseInline(rest.replace(BREAKING, "")),
  };
}

/**
 * A contributor line in any of the three spellings the notes use, or a bare name.
 *
 * @param {string} text - The bullet without `- `.
 * @returns {ChangelogContributor} The contributor.
 */
function parseContributor(text: string): ChangelogContributor {
  const linked = CONTRIBUTOR.exec(text);
  if (linked && WEB_URL.test(linked[2]!)) return { name: linked[1]!, url: linked[2] };
  const handle = HANDLE.exec(text);
  if (!handle) return { name: text };
  return { name: handle[1] ?? handle[2]!, url: `https://github.com/${handle[2]!}` };
}

interface DraftGroup {
  title: string;
  entries: ChangelogEntry[];
}

interface DraftNotes {
  compare?: string;
  groups: DraftGroup[];
  contributors: ChangelogContributor[];
}

/**
 * Where the bullets below a heading go. uppt wraps its groups in `## 👉 Changelog`, which opens
 * nothing, and so do `####` and deeper headings.
 *
 * @param {string} line - A line starting with `#`.
 * @returns {DraftGroup | "contributors" | undefined} The group, the contributors, or nowhere.
 */
function openGroup(line: string): DraftGroup | "contributors" | undefined {
  const heading = GROUP_HEADING.exec(line);
  const title = heading?.[1]?.replace(/^[^\p{L}]+/u, "").trim();
  if (!title || title === "Changelog") return undefined;
  return title === "Contributors" ? "contributors" : { title, entries: [] };
}

const COMPARE = "[compare changes](";

/**
 * Reads the notes of one release line by line, as changelogen, uppt or a person wrote them. A
 * heading opens a group, a bullet joins the open one, the compare link is kept, and the rest
 * (paragraphs, tables, quotes, code blocks) stays on GitHub.
 */
class NotesReader {
  readonly #notes: DraftNotes = { groups: [], contributors: [] };
  #group: DraftGroup | "contributors" | undefined;
  #fenced = false;

  /**
   * Files one line of the notes.
   *
   * @param {string} raw - The line as the body has it.
   * @returns {void}
   */
  read(raw: string): void {
    const line = raw.trimEnd();
    if (line.startsWith("```")) {
      this.#fenced = !this.#fenced;
      return;
    }
    if (this.#fenced) return;
    if (line.startsWith("#")) this.#open(line);
    else if (line.startsWith(COMPARE)) this.#notes.compare = line.slice(COMPARE.length, -1);
    else this.#item(line);
  }

  /**
   * The notes read so far. A group without bullets is dropped, so a highlight told in
   * paragraphs leaves no empty heading behind.
   *
   * @returns {DraftNotes} The compare link, the groups with entries and the contributors.
   */
  notes(): DraftNotes {
    const groups = this.#notes.groups.filter((group) => group.entries.length > 0);
    return { ...this.#notes, groups };
  }

  /**
   * Opens the group of a heading, or closes the open one when the heading opens nothing.
   *
   * @param {string} line - The heading.
   * @returns {void}
   */
  #open(line: string): void {
    this.#group = openGroup(line);
    if (typeof this.#group === "object") this.#notes.groups.push(this.#group);
  }

  /**
   * Adds a bullet to the open group. The notes written by hand sometimes list a contributor as
   * a bare `@handle` line, which counts as one too.
   *
   * @param {string} line - A line that is neither a heading nor the compare link.
   * @returns {void}
   */
  #item(line: string): void {
    const bullet = line.startsWith("- ") ? line.slice(2) : undefined;
    if (this.#group === "contributors") {
      const text = bullet ?? (line.startsWith("@") ? line : undefined);
      if (text) this.#notes.contributors.push(parseContributor(text));
    } else if (this.#group && bullet !== undefined) this.#group.entries.push(parseEntry(bullet));
  }
}

/**
 * Reads the notes of one release.
 *
 * @param {string} body - The release notes in Markdown.
 * @returns {DraftNotes} The compare link, the groups with entries and the contributors.
 */
function parseNotes(body: string): DraftNotes {
  const reader = new NotesReader();
  for (const line of body.split(/\r?\n/)) reader.read(line);
  return reader.notes();
}

/** A release tag taken apart: `v0.10.0-beta.1` is 0, 10, 0 and `beta.1`. */
type Tag = Readonly<{ version: string; parts: readonly number[]; pre?: string }>;

/**
 * Takes a release tag apart.
 *
 * @param {string} name - The tag name.
 * @returns {Tag | undefined} The tag, or nothing when it isn't `vX.Y.Z`.
 */
function parseTag(name: string): Tag | undefined {
  const match = RELEASE_TAG.exec(name);
  if (!match) return undefined;
  const parts = [match[1], match[2], match[3]].map(Number);
  return { version: name.slice(1), parts, ...(match[4] ? { pre: match[4] } : {}) };
}

const NUMERIC = /^\d+$/;

/**
 * Compares two dot separated prerelease identifiers by semver precedence: numbers as numbers,
 * a number below any word, and a shorter list below a longer one it starts.
 *
 * @param {string} a - One prerelease, `beta.10`.
 * @param {string} b - The other, `beta.9`.
 * @returns {number} Above zero when `a` comes later.
 */
function prereleaseOrder(a: string, b: string): number {
  const left = a.split(".");
  const right = b.split(".");
  const at = left.findIndex((part, index) => part !== right[index]);
  if (at < 0) return left.length - right.length;
  const [x, y] = [left[at]!, right[at]];
  if (y === undefined) return 1;
  if (NUMERIC.test(x) && NUMERIC.test(y)) return Number(x) - Number(y);
  if (NUMERIC.test(x) !== NUMERIC.test(y)) return NUMERIC.test(x) ? -1 : 1;
  return x < y ? -1 : 1;
}

/**
 * Orders two versions newest first: by major, minor and patch, then a release before its
 * prereleases, and those by semver precedence.
 *
 * @param {Tag} a - One release's tag.
 * @param {Tag} b - The other's.
 * @returns {number} Below zero when `a` is newer.
 */
function newestFirst(a: Tag, b: Tag): number {
  const differs = a.parts.findIndex((part, at) => part !== b.parts[at]);
  if (differs >= 0) return b.parts[differs]! - a.parts[differs]!;
  if (a.pre === b.pre) return 0;
  if (a.pre === undefined) return -1;
  return b.pre === undefined ? 1 : prereleaseOrder(b.pre, a.pre);
}

/**
 * Turns the GitHub releases into the log: drafts and tags that aren't `vX.Y.Z` are skipped, the
 * rest is ordered newest first and dated by npm when the registry has the version, else by GitHub.
 *
 * @param {readonly GitHubRelease[]} releases - The releases as the API listed them.
 * @param {Readonly<Record<string, string>>} times - The registry's `time`, keyed by version.
 * @returns {ChangelogRelease[]} The releases.
 */
export function changelogReleases(
  releases: readonly GitHubRelease[],
  times: Readonly<Record<string, string>>,
): ChangelogRelease[] {
  return releases
    .flatMap((release) => {
      const tag = release.draft ? undefined : parseTag(release.tag_name);
      return tag ? [{ release, tag }] : [];
    })
    .toSorted((a, b) => newestFirst(a.tag, b.tag))
    .map(({ release, tag: { version } }) => {
      const date =
        (Object.hasOwn(times, version) ? times[version] : undefined) ?? release.published_at;
      return {
        version,
        ...(date ? { date } : {}),
        url: release.html_url,
        ...parseNotes(release.body ?? ""),
      };
    });
}

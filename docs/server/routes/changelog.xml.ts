import { releaseAnchor, type ChangelogRelease, type ChangelogSpan } from "#shared/changelog";

/**
 * Escapes text for XML and for the HTML inside an item's description.
 *
 * @param {string} text - Raw text.
 * @returns {string} The text with `&`, `<`, `>` and `"` escaped.
 */
function escape(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * One entry's runs as HTML.
 *
 * @param {readonly ChangelogSpan[]} spans - The runs.
 * @returns {string} The HTML.
 */
function spansHtml(spans: readonly ChangelogSpan[]): string {
  return spans
    .map((span) => {
      if (span.kind === "code") return `<code>${escape(span.text)}</code>`;
      if (span.kind === "strong") return `<strong>${escape(span.text)}</strong>`;
      if (span.kind === "link")
        return `<a href="${escape(span.href ?? "")}">${escape(span.text)}</a>`;
      return escape(span.text);
    })
    .join("");
}

/**
 * A release as the HTML body of its item: one heading and one list per group.
 *
 * @param {ChangelogRelease} release - The release.
 * @returns {string} The HTML.
 */
function releaseHtml(release: ChangelogRelease): string {
  const groups = release.groups.map((group) => {
    const items = group.entries.map((entry) => {
      const scope = entry.scope ? `<strong>${escape(entry.scope)}:</strong> ` : "";
      const breaking = entry.breaking ? "<strong>Breaking:</strong> " : "";
      return `<li>${scope}${breaking}${spansHtml(entry.spans)}</li>`;
    });
    return `<h3>${escape(group.title)}</h3><ul>${items.join("")}</ul>`;
  });
  const compare = release.compare
    ? `<p><a href="${escape(release.compare)}">Compare changes</a></p>`
    : "";
  return compare + groups.join("");
}

/**
 * RSS 2.0 feed of the releases in CHANGELOG.md, prerendered next to /changelog. An item's guid is
 * the version, so a reader never sees a release twice, and its link is the release on the page.
 *
 * @param {import("h3").H3Event} event - The request for `/changelog.xml`.
 * @returns {Promise<string>} The feed.
 */
export default defineEventHandler(async (event) => {
  /** site.url of nuxt.config.ts, so the links are absolute in dev too; readers resolve nothing else. */
  const siteUrl = getSiteConfig(event).url.replace(/\/$/, "");
  const releases = await changelog();
  const items = releases.map((release) =>
    [
      "    <item>",
      `      <title>v${release.version}</title>`,
      `      <link>${siteUrl}/changelog#${releaseAnchor(release.version)}</link>`,
      `      <guid isPermaLink="false">@agntn/puzzles@${release.version}</guid>`,
      ...(release.date ? [`      <pubDate>${new Date(release.date).toUTCString()}</pubDate>`] : []),
      `      <description>${escape(releaseHtml(release))}</description>`,
      "    </item>",
    ].join("\n"),
  );
  const latest = releases.find((release) => release.date)?.date;
  setResponseHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>@agntn/puzzles changelog</title>",
    `    <link>${siteUrl}/changelog</link>`,
    `    <atom:link href="${siteUrl}/changelog.xml" rel="self" type="application/rss+xml"/>`,
    "    <description>Every release of @agntn/puzzles: new puzzles and collections, solves, fixes and breaking changes.</description>",
    "    <language>en</language>",
    ...(latest ? [`    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>`] : []),
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
});

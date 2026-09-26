import { datedReleases, parseChangelog, type ChangelogRelease } from "#shared/changelog";

/** The npm name the releases are published under; its registry document dates the changelogen releases. */
const PACKAGE = "@agntn/puzzles";

/**
 * Publish times from the registry, keyed by version. changelogen writes no dates into its
 * headings, and the build already depends on npm being up to install anything.
 *
 * @returns {Promise<Record<string, string>>} ISO times, or none when the registry did not answer.
 */
async function publishTimes(): Promise<Record<string, string>> {
  try {
    const document = await $fetch<{ time?: Record<string, string> }>(
      `https://registry.npmjs.org/${PACKAGE.replace("/", "%2F")}`,
      { timeout: 10_000, retry: 2 },
    );
    return document.time ?? {};
  } catch (error) {
    console.warn(
      `[changelog] no publish times from npm, using heading dates only: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {};
  }
}

let cached: Promise<ChangelogRelease[]> | undefined;

/**
 * Every release in CHANGELOG.md, newest first, dated by npm or by its heading.
 *
 * @returns {Promise<ChangelogRelease[]>} The releases.
 */
export function changelog(): Promise<ChangelogRelease[]> {
  cached ??= Promise.all([
    useStorage("assets:changelog").getItem<string>("CHANGELOG.md"),
    publishTimes(),
  ]).then(([source, times]) => {
    if (!source) throw new Error("CHANGELOG.md is missing from the server assets");
    return datedReleases(parseChangelog(source), times);
  });
  return cached;
}

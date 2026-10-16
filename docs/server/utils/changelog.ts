import { changelogReleases, type ChangelogRelease, type GitHubRelease } from "#shared/changelog";

/** The npm name the releases are published under; its registry document dates them. */
const PACKAGE = "@agntn/puzzles";
const RELEASES = "https://api.github.com/repos/agntn/puzzles/releases";
const PAGE = 100;

/**
 * Publish times from the registry, keyed by version. A release PR merged on GitHub reaches npm
 * only after the publish run, and the build already depends on npm being up to install anything.
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
      `[changelog] no publish times from npm, using GitHub's: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {};
  }
}

/**
 * Every release on GitHub, page by page. Without a token GitHub allows 60 requests an hour per
 * address, which a shared build machine can spend before this build asks, so GITHUB_TOKEN is sent
 * when the build has one.
 *
 * @returns {Promise<GitHubRelease[]>} The releases, drafts included when the token can see them.
 */
async function githubReleases(): Promise<GitHubRelease[]> {
  const token = process.env["GITHUB_TOKEN"];
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "puzzles.agntn.dev",
    "x-github-api-version": "2022-11-28",
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };
  const releases: GitHubRelease[] = [];
  for (let page = 1; ; page += 1) {
    const batch = await $fetch<GitHubRelease[]>(RELEASES, {
      query: { per_page: PAGE, page },
      headers,
      timeout: 10_000,
      retry: 2,
    });
    releases.push(...batch);
    if (batch.length < PAGE) return releases;
  }
}

let cached: Promise<ChangelogRelease[]> | undefined;

/**
 * Every release of the package, newest first, read from GitHub Releases and dated by npm.
 *
 * @returns {Promise<ChangelogRelease[]>} The releases.
 */
export function changelog(): Promise<ChangelogRelease[]> {
  cached ??= Promise.all([githubReleases(), publishTimes()]).then(
    ([releases, times]) => changelogReleases(releases, times),
    (error: unknown) => {
      cached = undefined;
      throw error;
    },
  );
  return cached;
}

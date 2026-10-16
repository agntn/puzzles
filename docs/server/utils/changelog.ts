import { changelogReleases, type ChangelogRelease, type GitHubRelease } from "#shared/changelog";

/** The npm name the releases are published under; its registry document dates them. */
const PACKAGE = "@agntn/puzzles";
const RELEASES = "https://api.github.com/repos/agntn/puzzles/releases";
const PAGE = 100;
/** Statuses worth another try, the same set `ofetch` retries. */
const RETRY_STATUSES = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

/**
 * GETs JSON with two retries and ten seconds a try for the headers; a long body may take its time.
 *
 * @param {string} url - The URL, query included.
 * @param {Readonly<Record<string, string>>} headers - Request headers.
 * @returns {Promise<T>} The parsed body of a 2xx answer.
 */
async function getJson<T>(url: string, headers: Readonly<Record<string, string>> = {}): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    const deadline = new AbortController();
    const timer = setTimeout(() => deadline.abort(), 10_000);
    let response: Response | undefined;
    try {
      response = await fetch(url, { headers, signal: deadline.signal });
    } catch (error) {
      if (attempt < 2) continue;
      throw new Error(`[GET] "${url}": no answer`, { cause: error });
    } finally {
      clearTimeout(timer);
    }
    if (response.ok) return (await response.json()) as T;
    if (attempt < 2 && RETRY_STATUSES.has(response.status)) continue;
    throw new Error(`[GET] "${url}": ${response.status} ${response.statusText}`);
  }
}

/**
 * Publish times from the registry, keyed by version. A release PR merged on GitHub reaches npm
 * only after the publish run, and the build already depends on npm being up to install anything.
 *
 * @returns {Promise<Record<string, string>>} ISO times, or none when the registry did not answer.
 */
async function publishTimes(): Promise<Record<string, string>> {
  try {
    const document = await getJson<{ time?: Record<string, string> }>(
      `https://registry.npmjs.org/${PACKAGE.replace("/", "%2F")}`,
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
    const batch = await getJson<GitHubRelease[]>(
      `${RELEASES}?per_page=${PAGE}&page=${page}`,
      headers,
    );
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

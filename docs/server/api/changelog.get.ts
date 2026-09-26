import type { ChangelogRelease } from "#shared/changelog";

/**
 * The releases for /changelog, read from CHANGELOG.md at build time and prerendered with the page.
 *
 * @returns {Promise<ChangelogRelease[]>} Every release, newest first.
 */
export default defineEventHandler((): Promise<ChangelogRelease[]> => changelog());

import { version } from "../version.ts";

/** A global, since a built bin in a checkout runs `dist/` and `src/` as two module graphs. */
const COMMIT_KEY = "__PUZZLES_COMMIT__";

/** A full commit ID, SHA-1 or SHA-256, the only ref besides the tag a link may name. */
const COMMIT = /^(?:[\da-f]{40}|[\da-f]{64})$/u;

/**
 * The tag in the npm package, the commit in a checkout or on the docs site, and never `main`.
 *
 * @returns {string} The commit when one is set, otherwise the release tag of this version.
 */
export function assetRef(): string {
  const commit: unknown = Reflect.get(globalThis, COMMIT_KEY);
  return typeof commit === "string" ? commit : `v${version}`;
}

/**
 * Points asset links at a commit. The first one wins, and anything but a commit ID is ignored.
 *
 * @param {string} commit - A full commit ID that GitHub has.
 */
export function useCommitAssets(commit: string): void {
  if (COMMIT.test(commit) && !Object.hasOwn(globalThis, COMMIT_KEY)) {
    Reflect.set(globalThis, COMMIT_KEY, commit);
  }
}

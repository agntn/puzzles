import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { useCommitAssets } from "./core/asset-ref.ts";

/**
 * The newest commit shared with `origin/main`, because GitHub has never seen a local one.
 *
 * @param {string} root - The repository root.
 * @returns {string | undefined} The commit, or `undefined` outside a Git checkout.
 */
export function checkoutCommit(root: string): string | undefined {
  if (!existsSync(join(root, ".git"))) {
    return undefined;
  }
  try {
    const commit = execFileSync("git", ["merge-base", "HEAD", "origin/main"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 2000,
    }).trim();
    return commit || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Asset links at the checkout's commit. Outside Git, as in the npm package, nothing changes.
 *
 * @param {string} root - The repository root.
 */
export function useCheckoutAssets(root: string): void {
  const commit = checkoutCommit(root);
  if (commit !== undefined) {
    useCommitAssets(commit);
  }
}

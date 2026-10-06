import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { checkoutCommit, useCheckoutAssets } from "../../src/checkout.ts";
import { assetRef } from "../../src/core/asset-ref.ts";

/* Runs git in the scratch repository, with an identity of its own and no user config. */
function git(cwd: string, ...args: readonly string[]): string {
  return execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" },
  }).trim();
}

/* A scratch repository with one commit on main, and that commit. */
function scratch(): { readonly dir: string; readonly base: string } {
  const dir = mkdtempSync(join(tmpdir(), "puzzles-checkout-"));
  git(dir, "init", "--quiet", "--initial-branch=main");
  writeFileSync(join(dir, "a.txt"), "a");
  git(dir, "add", "a.txt");
  git(dir, "commit", "--quiet", "-m", "a");
  return { dir, base: git(dir, "rev-parse", "HEAD") };
}

describe("checkout commit", () => {
  const dirs: string[] = [];

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "__PUZZLES_COMMIT__");
    for (const dir of dirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("names the commit main is at, once origin/main has it", () => {
    const { dir, base } = scratch();
    dirs.push(dir);
    git(dir, "update-ref", "refs/remotes/origin/main", base);

    expect(checkoutCommit(dir)).toBe(base);
  });

  it("names a branch's base, never a local commit GitHub doesn't have", () => {
    const { dir, base } = scratch();
    dirs.push(dir);
    git(dir, "update-ref", "refs/remotes/origin/main", base);
    git(dir, "switch", "--quiet", "-c", "feature");
    writeFileSync(join(dir, "b.txt"), "b");
    git(dir, "add", "b.txt");
    git(dir, "commit", "--quiet", "-m", "b");

    expect(checkoutCommit(dir)).toBe(base);
  });

  it("leaves the tag to a clone without origin/main and to a directory without Git", () => {
    const { dir } = scratch();
    dirs.push(dir);
    const plain = mkdtempSync(join(tmpdir(), "puzzles-plain-"));
    dirs.push(plain);

    expect(checkoutCommit(dir)).toBeUndefined();
    expect(checkoutCommit(plain)).toBeUndefined();
    useCheckoutAssets(plain);
    expect(assetRef()).toMatch(/^v\d/u);
  });

  it("points asset links at the commit it found", () => {
    const { dir, base } = scratch();
    dirs.push(dir);
    git(dir, "update-ref", "refs/remotes/origin/main", base);

    useCheckoutAssets(dir);

    expect(assetRef()).toBe(base);
  });
});

import { describe, expect, it } from "vite-plus/test";
import { assetRef, useCommitAssets } from "../../src/core/asset-ref.ts";
import { get } from "../../src/index.ts";
import { ASSETS } from "../support/assets.ts";

const COMMIT = "58a044a088d745e44c993194747311c72ae252f2";
const COMMIT_ASSETS = `https://raw.githubusercontent.com/agntn/puzzles/${COMMIT}`;

describe("asset ref", () => {
  it("names the release tag while no commit is set, as in the npm package", async () => {
    const gsmg = await get("gsmg");

    expect(assetRef()).toBe(ASSETS.split("/").at(-1));
    expect(gsmg?.assetUrl()).toBe(`${ASSETS}/assets/gsmg/puzzle.png`);
  });

  it("names the commit a checkout or the docs site runs, in every link", async () => {
    useCommitAssets(COMMIT);
    const gsmg = await get("gsmg");

    expect(gsmg?.assetUrl()).toBe(`${COMMIT_ASSETS}/assets/gsmg/puzzle.png`);
    expect(gsmg?.assetLinks().map((link) => link.url)).toEqual(
      gsmg?.assetLinks().map((link) => `${COMMIT_ASSETS}/${link.path}`),
    );
  });

  it("keeps the first commit, so a second entry point can't move links already handed out", () => {
    useCommitAssets(COMMIT);
    useCommitAssets("0".repeat(40));

    expect(assetRef()).toBe(COMMIT);
  });

  it("takes nothing but a full commit ID into a URL", () => {
    useCommitAssets("main");
    useCommitAssets(`${COMMIT}/../../evil`);
    useCommitAssets(COMMIT.slice(0, 12));

    expect(assetRef()).toBe(ASSETS.split("/").at(-1));
  });
});

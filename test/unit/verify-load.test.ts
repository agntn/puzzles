import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";

describe("verify tool module loading", () => {
  it("leaves the signing crypto unresolved when the puzzle is missing", () => {
    const output = execFileSync(process.execPath, ["test/probe-verify-load.ts"], {
      cwd: fileURLToPath(new URL("../../", import.meta.url)),
      encoding: "utf8",
      timeout: 30_000,
    });

    expect(JSON.parse(output)).toEqual({ miss: "b1000/99999", cryptoOnMiss: 0, verified: true });
  });
});

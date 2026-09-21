import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("tool discovery in a fresh process", () => {
  it.each(["pi", "omp", "mcp"])(
    "defers the dataset in %s and executes tools afterward",
    (surface) => {
      const output = execFileSync(process.execPath, ["test/probe-tools.ts", ".", surface], {
        cwd: fileURLToPath(new URL("../../", import.meta.url)),
        encoding: "utf8",
        timeout: 30_000,
      });
      expect(JSON.parse(output)).toMatchObject({ surface, layout: "src" });
    },
  );
});

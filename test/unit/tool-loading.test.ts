import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";

describe("tool discovery in a fresh process", () => {
  it.each(["registry.mjs", "registry2.mjs", "dataset2.mjs", "puzzle.mjs", "collection.mjs"])(
    "rejects an eagerly loaded packed %s without chain dependencies",
    (chunk) => {
      const root = mkdtempSync(path.join(tmpdir(), "puzzles-eager-"));
      try {
        const extensions = path.join(root, "packages/pi/extensions");
        const chunks = path.join(root, "dist/_chunks");
        mkdirSync(extensions, { recursive: true });
        mkdirSync(chunks, { recursive: true });
        writeFileSync(path.join(chunks, chunk), "export const fixture = true;\n");
        writeFileSync(
          path.join(extensions, "puzzles.ts"),
          `import "../../../dist/_chunks/${chunk}";
export default function extension(api) {
  for (const name of ["puzzles_show", "puzzles_stats", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]) {
    api.registerTool({ name, async execute() {
      return { content: [{ type: "text", text:
        "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH Total: 1 puzzles in 1 collections"
      }] };
    } });
  }
}
`,
        );
        const result = spawnSync(process.execPath, ["test/probe-tools.ts", root, "pi", "dist"], {
          cwd: fileURLToPath(new URL("../../", import.meta.url)),
          encoding: "utf8",
          timeout: 30_000,
        });
        expect(result.status).toBe(1);
        expect(result.stderr).toContain("tool discovery must not load the dataset");
        expect(result.stderr).toContain(`/dist/_chunks/${chunk}`);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );

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

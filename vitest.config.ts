import { defineConfig } from "vitest/config";

const live = process.env["PUZZLES_LIVE"] === "1";

export default defineConfig({
  test: {
    /* Unit tests stub fetch through test/unit/setup.ts. Live roundtrips opt in with PUZZLES_LIVE=1. */
    include: live ? ["test/live/**/*.test.ts"] : ["test/unit/**/*.test.ts"],
    setupFiles: live ? [] : ["test/unit/setup.ts"],
    ...(live ? { testTimeout: 30_000 } : {}),
    /* Files sharing a worker reuse the evaluated record modules. The registry test resets the graph. */
    isolate: false,
  },
});

import oxfmt from "@agntn/ox/oxfmt";
import { defineConfig } from "oxfmt";

export default defineConfig({
  ...oxfmt,
  ignorePatterns: ["dist", "coverage"],
});

import { fileURLToPath } from "node:url";
import { defineCollection, defineContentConfig } from "@nuxt/content";

/**
 * The story of one puzzle, rendered under its dossier on `/collections/<collection>/<name>`.
 * The files live outside `content/`, which Docus reads whole into the docs pages, so a story never
 * becomes a page of its own. `stories/quizchain/34.md` belongs to `quizchain/34`.
 */
export default defineContentConfig({
  collections: {
    stories: defineCollection({
      type: "page",
      source: {
        cwd: fileURLToPath(new URL("stories", import.meta.url)),
        include: "**/*.md",
      },
    }),
  },
});

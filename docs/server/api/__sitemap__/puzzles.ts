import { all } from "@agntn/puzzles";

/**
 * Pages outside `content/` that the Docus sitemap cannot see. Keep in step with `app/pages/` and
 * with `llms.sections` in `nuxt.config.ts`, or a new page is invisible to crawlers and `llms.txt`.
 */
const PAGES = ["/playground", "/changelog"];

/**
 * The Vue pages Docus can't see; singletons skip theirs, since the collection page is the puzzle.
 *
 * @returns {Promise<string[]>} The paths, which the sitemap module puts under `site.url`.
 */
export default defineSitemapEventHandler(async () => {
  const puzzles = (await all())
    .map((puzzle) => puzzle.id())
    .filter((id) => id.includes("/"))
    .map((id) => `/collections/${id}`);
  return [...PAGES, ...puzzles];
});

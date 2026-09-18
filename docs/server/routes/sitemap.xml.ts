import { all } from "@agntn/puzzles";
import docusSitemap from "docus/server/routes/sitemap.xml";
import { inferSiteURL } from "docus/utils/meta";

/** Pages outside `content/` that the Docus sitemap cannot see. Keep in step with `app/pages/`. */
const PAGES = ["/playground"];

/**
 * The Docus sitemap lists content collections only, so the Vue pages are appended here:
 * the playground and one page per puzzle. Singletons are their collection's page already.
 *
 * @param {import("h3").H3Event} event - The request for `/sitemap.xml`.
 * @returns {Promise<string>} The sitemap XML.
 */
export default defineEventHandler(async (event) => {
  const xml = String(await docusSitemap(event));
  const siteUrl = inferSiteURL() ?? "";
  const puzzles = (await all())
    .map((puzzle) => puzzle.id())
    .filter((id) => id.includes("/"))
    .map((id) => `/collections/${id}`);
  const entries = [...PAGES, ...puzzles]
    .map((path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n  </url>`)
    .join("\n");
  return xml.replace("</urlset>", `${entries}\n</urlset>`);
});

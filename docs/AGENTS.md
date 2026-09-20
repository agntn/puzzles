# docs/

Docus site for `@agntn/puzzles`. Markdown lives in `content/`. The playground and the puzzle pages are Vue pages that import the library into the browser. The one server route, `/api/balance/:id`, exists because balances need an explorer and the Etherscan key has to stay on the worker.

## Layout

```
docs/
├── nuxt.config.ts                 # extends: ['docus'], cloudflare_module preset (Workers), the two aliases into ../src, assets/ served from the checkout
├── app/app.config.ts              # title, github, theme
├── app/app.css                    # theme tokens (light + .dark), shared `puzzles-*` classes: frames, tags, rows, cells, code cards
├── app/components/                # Docus overrides: AppHeaderLogo, AppHeaderCTA (nav), AppFooterLeft, DocsAsideLeftBody
├── app/components/content/        # MDC components and page parts: landing panels, PuzzleCard, PuzzlePage, CollectionFacts, CollectionPuzzles, PuzzlesPlayground, StatusPill, BalanceLine
├── app/components/OgImage/        # Docs.takumi and Landing.takumi override the Docus OG templates
├── app/assets/fonts.css           # @font-face for the TTFs served from public/fonts (site and OG images)
├── app/composables/               # useLandingPuzzle (one clock for every live panel), useBalance (the worker route), useSubNavigation
├── app/utils/                     # puzzles (collection presentation, tool names), samples (toSample, builders), puzzle-view (the page's data), landing (static fixtures), collections (facts strip), format
├── app/pages/playground.vue       # playground, own route outside the docs layout, its own useSeo and OG image
├── app/pages/collections/[collection]/[puzzle].vue   # one page per puzzle, prerendered through the links on the collection pages
├── server/api/balance/[...id].ts  # puzzle.balance() on the worker, cached five minutes per puzzle
├── server/routes/sitemap.xml.ts   # Docus sitemap plus the playground and every puzzle page
├── public/                        # fonts, favicon.svg and the icons and manifest cut from it
├── content/index.md               # landing
├── content/1.guide/               # getting started, records, registry, lookups, verification, balances, cli, agents, custom, playground
└── content/2.collections/         # one page per collection, each with the facts strip and the puzzle list; the three singletons embed their puzzle page
```

## Commands

```bash
pnpm install          # from docs/; the repo root needs neither an install nor a build
pnpm dev              # http://localhost:3000; ETHERSCAN_API_KEY in the environment makes Ethereum balances work locally
pnpm build            # Cloudflare Workers output in .output/, content routes and every puzzle page prerendered
pnpm deploy           # build, then wrangler deploy to puzzles.agntn.dev
pnpm generate         # static output; the balance route needs the worker, so this is for a preview only
```

Deployment: Nitro preset `cloudflare_module`. Nuxt Content wants a D1 binding named `DB`. `wrangler.jsonc` carries it plus the `NUXT_SITE_URL` var, and Nitro merges that into the generated `.output/server/wrangler.json`. Create the database once with `wrangler d1 create agntn-puzzles` and put the id in `wrangler.jsonc`. Until then the id is all zeros on purpose, `pnpm deploy` with zeros binds nothing, so don't run it before the id is real. The Etherscan key is a worker secret, `wrangler secret put NUXT_ETHERSCAN_API_KEY`, read through `runtimeConfig.etherscanApiKey`; without it Ethereum balances answer with the library's `BalanceProviderError` and every other chain still works. No KV binding: the five minute balance cache is Nitro's in-memory one, per isolate, plus the `Cache-Control` the route sends.

`@agntn/puzzles` is an alias in `nuxt.config.ts` for `../src/index.ts`, and `@agntn/puzzles/tools` for `../src/tool-operations.ts`, so the playground, the puzzle pages and the tool panel run the real executors instead of a copy of their text. Vite and Nitro bundle the checkout's sources into the page and the worker, so `dist/` and the root `node_modules` are never touched. That is what Workers Builds needs: it installs `docs/` alone. The subgraph under `src/index.ts` imports from npm: `@agntn/chains`, `@agntn/explorers`, `@noble/curves`, `@noble/hashes`, `@scure/base`, `@scure/bip32` and `@scure/bip39`. Each one is a dependency of `docs/package.json`, pinned to the root's version, listed in `vite.resolve.dedupe`, and every subpath `src/` imports, the dynamic ones in `providers.ts` and `verify.ts` too, is in `vite.optimizeDeps.include`. A new bare import in `src/` needs all three lines and a check of both the browser bundle and the worker before anyone relies on it. `vite.server.fs.allow` names the repository root, not `src/`, because `src/version.ts` reads `../package.json`.

`nitro.publicAssets` serves the checkout's `assets/` under `/assets`, so the puzzle images on the pages come from this site. The library's `assetUrl()` points at GitHub and the pages don't use it, because the repository the package lives in can move and the images can't be allowed to 404 with it.

Two resolution traps, both because the repo root is its own pnpm workspace:

- `pnpm-workspace.yaml` sets `shamefullyHoist: true`. Without it `docs/node_modules` holds only direct dependencies, Node walks up to the root `node_modules`, and the server bundle can end up with a second copy of Vue.
- `nuxt.config.ts` pins `workspaceDir` to `docs/` and disables devtools and telemetry, which would otherwise resolve from the root.

`pnpm exec nuxt typecheck` runs vue-tsc over the `.vue` files too, which plain `tsc -p .nuxt/tsconfig.app.json` skips; read the `app/` and `server/` lines only, because Docus's own sources report errors under this config. `pnpm install` here runs `nuxt prepare` on postinstall, so `.nuxt/` and its types exist before the root `pnpm lint` reads them: oxlint's type-aware rules resolve the auto-imports and `@agntn/puzzles` alias through those files, and without them every docs file lints as `error` typed. The root `pnpm test` needs them too: `test/unit/docs-landing.test.ts` imports `app/utils`, vite resolves `docs/tsconfig.json` for those files, and that file only references the `.nuxt/tsconfig.*.json` that `nuxt prepare` writes. CI installs the docs for those two reasons.

## Pages per puzzle

`app/pages/collections/[collection]/[puzzle].vue` renders any `collection/name` id through `PuzzlePage`, which reads the record with `toPuzzleView` inside `useAsyncData`, so the prerender and the browser agree and the payload carries plain data. An unknown id throws a 404. The three singletons, `gsmg`, `bitaps` and `movie_enigma`, have no `name` segment: their collection pages embed `::puzzle-page{puzzle="gsmg"}` instead, and that's why the prop is called `puzzle`, MDC keeps `id` for the element. The prerender finds the 332 puzzle routes by crawling the lists `::collection-puzzles` renders on the collection pages; nothing enumerates them in `nuxt.config.ts`, because that file runs under jiti from `docs/` and can't import the library on Workers Builds. The sitemap route can, through the Nitro alias, and lists them all.

## Live values

- The landing walks sixteen puzzles, `WALK` in `app/utils/landing.ts`, one per collection at least. `LANDING_STATIC`, `STATS_STATIC` and `FACTS_STATIC` are what the library computes for them, written down so the page renders the same values before the collections load in the browser. `test/unit/docs-landing.test.ts` in the repository root recomputes every fixture from `src/` and fails when a record changes. Regenerate by running the same computation the test runs and commit both.
- After mount each step calls `get(id)`, which imports that one collection module, and the registry panel marks the collection loaded. The set of loaded collections is the page's own record of what the walk pulled in, not a claim about the library's cache. The stats strip and the collection tiles read the static fixtures, pinned by the same test, because computing them live would load every collection and defeat the panel.
- `app/utils/puzzles.ts` is the one place with a collection's icon, display title, sample id, chain list and blurb. The sidebar, the collection rows, the OG chips and the playground read from it, and the collection pages repeat the icon in their frontmatter. Counts, authors, prizes and statuses come from the library: `::collection-facts` and `::collection-puzzles` load the collection through `useAsyncData` and serialize plain numbers and strings into the payload.
- `keyLiteral` in `app/utils/samples.ts` mirrors the builders in `src/core/parts.ts` for the rotating record panel, and `balanceText` in `app/composables/useBalance.ts` mirrors the `puzzles_balance` line in `src/tool-operations.ts`, because the browser can't run that executor without a key. A builder or a line the library changes needs the same change here, and there's no test that catches either drift, so read both when touching one.
- Balances load in the browser after mount through `useBalance`, never during the prerender, so no page bakes a number in. `BalanceLine` shows the amount with the explorer's host, or the worker's error message. `PuzzlesPlayground` calls `showTool`, `listTool`, `verifyTool`, `collectionsTool` and `statsTool` from the aliased executors and the worker route for a balance. A `PuzzlesError` is shown with its class name and message, a worker error with its status text. Anything else is a bug in the library and belongs there, not in a try/catch here.
- Deep links read `route.query` through a `watch` registered in `onMounted` that fires once. A prerendered page hydrates with an empty query and Nuxt restores the address only afterwards, so reading `route.query` in setup gives you nothing. The form writes state back with `router.replace` on every change.

## SEO

- `seo.schema` in `app/app.config.ts` emits the landing JSON-LD: `WebSite`, the agntn `Organization` as publisher, and a free `SoftwareApplication` with `sameAs` on GitHub and npm. Docs pages get `Article` plus `BreadcrumbList` from Docus on their own; the puzzle pages and the playground call `useSeo` with their breadcrumbs and `defineOgImage` themselves.
- The Docus sitemap reads content collections only. `server/routes/sitemap.xml.ts` wraps it and appends the playground and one URL per puzzle; a new page under `app/pages/` goes there too, and into `llms.sections` in `nuxt.config.ts`, or it's invisible to crawlers and to `llms.txt`.
- Docus links `/favicon.ico` without shipping one. `public/favicon.svg` is the source, the PNGs come from `rsvg-convert` and the `.ico` from ImageMagick, `app.head` in `nuxt.config.ts` links them with the manifest and theme colours.

## OG images

- `app/components/OgImage/Docs.takumi.vue` and `Landing.takumi.vue` override the Docus templates of the same name and are rendered by Takumi at build time. Takumi has no CSS variables, so the theme colours from `app.css` are repeated there as literals. A collection page's card looks the collection up by title in `app/utils/puzzles.ts` and shows its blurb and chips; a puzzle page passes its own description, written without commas because the OG pipeline strips them.
- nuxt-og-image doesn't see the faces `@nuxt/fonts` generates on this Nuxt version, but it does parse `@font-face` rules from the files in `css`. That's why `app/assets/fonts.css` declares the five TTFs in `public/fonts` and `fonts.families` uses the `local` provider. Site and OG images share the same files.
- The landing OG file is named from the SEO description. Nitro refuses to write a prerender path containing `..`, so a description ending in a period is silently skipped and the landing ships with a dead `og:image`. Keep the description in `content/index.md` without a trailing period.

## Constraints

- Text a visitor types into the playground is rendered as text, through interpolation or a `<pre>`. Never `v-html`, never evaluate.
- Every record quoted in `content/` is a record from `src/collections/`, shortened with an ellipsis where a hash would otherwise run off the page. Check a new one against the file before writing it down, and write the frontmatter `description` without `: ` and without commas: the first is a YAML mapping that takes the page out of the prerender with a silent 500, the second gets stripped by the OG pipeline.
- The site's only network calls are the balance route on the worker and the browser's requests to it. The footer says so.
- Docs helpers take the library instance as an argument and import its types relatively; the two pure formatters `formatPrize` and `formatPrizeTotals` and the accumulator `prizeTotals` are imported relatively from `src/core/utils.ts` as values, so the site prints the same rounded prize the CLI and the tools print.
- Surfaces are flat by decision, with one exception. The amber halo at the top of the page and behind a hero (`html`, `html.dark body`, `.puzzles-hero::before`, the OG images) is the agntn family's signature and stays. Everything else is flat: a frame is one 1px edge (`--puzzles-frame`), never an edge plus a soft shadow, nothing else glows, and no element fades in on load. Section headings stand on their own without a kicker label above them; the uppercase mono labels stay inside data cards, where they name fields. Lists of collections are rows in a frame (`puzzles-row`), not a grid of icon and blurb tiles, and status tags are small rectangles in the palette's amber, red and neutrals, with no blue or cyan on the dark theme. Space Grotesk and Space Mono stay because the agntn sites share them.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { checkoutCommit } from "../src/checkout.ts";
import { puzzlesTheme } from "./shiki-theme";

/** Bundled from the checkout's sources: a deploy needs neither dist/ nor the root node_modules. */
const repoRoot = resolve(import.meta.dirname, "..");
const librarySource = resolve(repoRoot, "src");

/** The library's package names, pointed at the checkout's sources. */
const libraryAliases: Readonly<Record<string, string>> = {
  "@agntn/puzzles/mcp": resolve(librarySource, "mcp.ts"),
  "@agntn/puzzles/tools": resolve(librarySource, "tool-operations.ts"),
  "@agntn/puzzles": resolve(librarySource, "index.ts"),
};

/**
 * Hashes the site and library files an OG template imports, since its card prints what they hold.
 *
 * @param {string} template - Path of the template.
 * @returns {string} Twelve hex characters of SHA-256 over those files.
 */
function importsDigest(template: string): string {
  const digest = createHash("sha256");
  for (const [, specifier = ""] of readFileSync(template, "utf8").matchAll(
    /^import\b[^;]*? from "([^"]+)"/gm,
  )) {
    const file = specifier.startsWith(".")
      ? resolve(dirname(template), extname(specifier) === "" ? `${specifier}.ts` : specifier)
      : libraryAliases[specifier];
    if (file !== undefined) digest.update(readFileSync(file));
  }
  return digest.digest("hex").slice(0, 12);
}

/** Runtime deps under src/index.ts and src/mcp.ts, installed here so they resolve from docs/node_modules. */
const libraryDependencies = [
  "@agntn/archives",
  "@agntn/chains",
  "@agntn/explorers",
  "@agntn/keys",
  "@agntn/tools",
  "@modelcontextprotocol/server",
];

/** Every subpath src/ imports, dynamic ones too, so dev bundles them up front, not on demand. */
const libraryEntries = [
  "@agntn/archives",
  "@agntn/chains",
  "@agntn/explorers",
  "@agntn/explorers/providers/arweave",
  "@agntn/explorers/providers/blockchair",
  "@agntn/explorers/providers/blockscout",
  "@agntn/explorers/providers/blockstream",
  "@agntn/explorers/providers/dcrdata",
  "@agntn/explorers/providers/etherscan",
  "@agntn/explorers/providers/mempool",
  "@agntn/keys",
  "@agntn/keys/bip39",
  "@agntn/keys/brainwallet",
  "@agntn/keys/blockchains/base",
  "@agntn/keys/blockchains/bitcoin",
  "@agntn/keys/blockchains/bitcoincash",
  "@agntn/keys/blockchains/decred",
  "@agntn/keys/blockchains/dogecoin",
  "@agntn/keys/blockchains/ecash",
  "@agntn/keys/blockchains/ethereum",
  "@agntn/keys/blockchains/litecoin",
  "@agntn/keys/wif",
];

/** Pages published under snake_case ids before the switch to kebab-case, moved for good. */
const renamedIds = [
  "bitimage/kitten_passphrase",
  "book_quiz",
  "brave_new_world",
  "coin_artist",
  "coin_artist/torched-h34r7s",
  "hash_collision",
  "hash_collision/hash160",
  "hash_collision/hash256",
  "hash_collision/op_abs",
  "hash_collision/ripemd160",
  "hash_collision/sha1",
  "hash_collision/sha256",
  "ledger_donjon",
  "ledger_donjon/scissors_secret_sharing",
  "luckylurker/vault_1",
  "luckylurker/vault_2",
  "movie_enigma",
  "picture_puzzle",
  "satoshi_birthday_quiz",
  "warp/challenge_1",
  "warp/challenge_2",
  "warp/challenge_3",
  "warp/challenge_4",
  "warp/warp_challenge_1",
  "warp/warp_challenge_2",
  "zden/1bitcoin_white_paper",
  "zden/codex_protocol",
  "zden/decred_autonomy",
  "zden/decred_janus",
  "zden/demobit_2018",
  "zden/level_1",
  "zden/level_2",
  "zden/level_3",
  "zden/level_4",
  "zden/level_5",
  "zden/level_halv",
  "zden/level_sfx",
  "zden/level_xm17",
  "zden/litecoin_segwit",
];

/**
 * A page that moved for good. Prerendered, it'd be a refresh stub answering 200 instead of a 301.
 *
 * @param {string} to - Where the page lives now.
 * @returns {object} Its route rule.
 */
function moved(to: string) {
  return { redirect: { to, statusCode: 301 }, prerender: false } as const;
}

export default defineNuxtConfig({
  extends: ["docus"],
  /** The repo root is its own pnpm workspace; Nuxt must not treat it as this site's. */
  workspaceDir: import.meta.dirname,
  alias: libraryAliases,
  /** The OG build cache keys a card on its props and template, so the imports join the hash. */
  hooks: {
    "nuxt-og-image:components"({ components }) {
      for (const component of components) {
        if (component.category === "app" && component.path !== undefined) {
          component.hash += importsDigest(component.path);
        }
      }
    },
  },
  vite: {
    /** The library writes key ranges as bigint literals, which have no es2019 form. */
    build: { target: "es2022" },
    resolve: {
      /** Bare imports in ../src resolve upwards from the importer and skip docs/node_modules. */
      dedupe: libraryDependencies,
    },
    optimizeDeps: {
      include: libraryEntries,
    },
    server: {
      /** Dev serves the library from outside the workspace; src/version.ts reads ../package.json. */
      fs: { allow: [repoRoot] },
    },
  },
  runtimeConfig: {
    /** The commit for `server/plugins/asset-commit.ts`: Workers Builds names it, Git otherwise. */
    assetCommit: process.env["WORKERS_CI_COMMIT_SHA"] || checkoutCommit(repoRoot) || "",
    /** The Etherscan key for /api/balance on Ethereum puzzles; NUXT_ETHERSCAN_API_KEY at runtime, the root .env locally. */
    etherscanApiKey: process.env.ETHERSCAN_API_KEY ?? "",
  },
  devtools: { enabled: false },
  telemetry: false,
  site: {
    url: "https://puzzles.agntn.dev",
    name: "@agntn/puzzles",
  },
  llms: {
    domain: "https://puzzles.agntn.dev",
    title: "@agntn/puzzles",
    description:
      "Public crypto bounties, puzzles and challenges as typed records, as a library, a CLI, an MCP server and Pi and OMP extensions.",
    sections: [
      {
        title: "MCP Server",
        description:
          "The twelve puzzle tools and the page tools of this site over Streamable HTTP.",
        links: [
          {
            title: "MCP endpoint",
            href: "https://puzzles.agntn.dev/mcp",
            description:
              "Add it to any MCP client as an HTTP server, for example `claude mcp add --transport http puzzles https://puzzles.agntn.dev/mcp`.",
          },
        ],
      },
      {
        title: "Playground",
        description: "Look up, list and verify puzzles in the browser.",
        links: [
          {
            title: "Playground",
            href: "https://puzzles.agntn.dev/playground",
            description:
              "The library running in the page: show, list, verify, collections, authors and stats.",
          },
        ],
      },
    ],
  },
  ogImage: {
    /** Workers Builds keeps node_modules/.cache/nuxt, so the default nuxt-seo path starts cold. */
    buildCache: { base: "node_modules/.cache/nuxt/og-image" },
    /** Docus pages define their own OG images; the alt text is the one thing they leave unset. */
    defaults: {
      alt: "@agntn/puzzles: public crypto bounties and puzzles as typed records",
    },
  },
  icon: {
    clientBundle: {
      icons: [
        "lucide:arrow-right",
        "lucide:arrow-up-right",
        "lucide:badge-check",
        "lucide:binary",
        "lucide:book-open",
        "lucide:bot",
        "lucide:brain",
        "lucide:building-2",
        "lucide:camera",
        "lucide:check",
        "lucide:chevron-left",
        "lucide:chevron-right",
        "lucide:circle-check",
        "lucide:circle-help",
        "lucide:circle-x",
        "lucide:coins",
        "lucide:copy",
        "lucide:external-link",
        "lucide:file-json",
        "lucide:flask-conical",
        "lucide:hash",
        "lucide:image",
        "lucide:key-round",
        "lucide:layers",
        "lucide:list-tree",
        "lucide:loader-circle",
        "lucide:plus",
        "lucide:rabbit",
        "lucide:scissors",
        "lucide:search",
        "lucide:shield-alert",
        "lucide:split",
        "lucide:terminal",
        "lucide:trophy",
        "lucide:user-round",
        "lucide:users",
        "lucide:wallet",
        "simple-icons:github",
        "simple-icons:npm",
        "token:ar",
        "token:btc",
        "token:dcr",
        "token:eth",
        "token:ltc",
        "token:xmr",
        "vscode-icons:file-type-js",
        "vscode-icons:file-type-json",
        "vscode-icons:file-type-shell",
        "vscode-icons:file-type-typescript",
      ],
    },
  },
  colorMode: {
    preference: "dark",
  },
  /** Docus links /favicon.ico without shipping one; the icons and manifest are cut from public/favicon.svg. */
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        /** Feed readers find the releases from any page. */
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "@agntn/puzzles changelog",
          href: "/changelog.xml",
        },
      ],
      meta: [
        { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#0b0d10" },
        { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#eef1f4" },
        { name: "apple-mobile-web-app-title", content: "puzzles" },
        { name: "author", content: "oritwoen" },
        { property: "og:locale", content: "en_US" },
      ],
    },
  },
  routeRules: {
    ...Object.fromEntries(
      renamedIds.map((id) => [
        `/collections/${id}`,
        moved(`/collections/${id.replaceAll("_", "-")}`),
      ]),
    ),
    /** The Genesis puzzle's page before the collection became a singleton. */
    "/collections/genesis/block": moved("/collections/genesis"),
    /** kTimesG's challenge before it became the `80-bit` singleton: the collection page and both puzzle ids. */
    "/collections/ktimesg": moved("/collections/80-bit"),
    "/collections/ktimesg/80_bit": moved("/collections/80-bit"),
    "/collections/ktimesg/80-bit": moved("/collections/80-bit"),
    /** Tiamat's series under the chain's name, before it took the `Puzzle Weave` titles of its own pages. */
    "/collections/arweave": moved("/collections/weave"),
    ...Object.fromEntries(
      [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13].map((n) => [
        `/collections/arweave/weave${n}`,
        moved(`/collections/weave/${n}`),
      ]),
    ),
  },
  nitro: {
    preset: "cloudflare_module",
    /**
     * One MCP SDK in the worker. The toolkit builds its server from one copy and `agents` checks it
     * with `instanceof` against another. pnpm splits them by the `zod` peer each one resolves.
     */
    alias: {
      "@modelcontextprotocol/sdk": resolve(
        import.meta.dirname,
        "node_modules/@modelcontextprotocol/sdk/dist/esm",
      ),
    },
    /**
     * Nitro 2 stubs `node:fs` for workerd, which has run it natively since 2025-09-01 under
     * `nodejs_compat`. `@agntn/archives` reads its config through it on every archive read.
     */
    unenv: { external: ["node:fs"], alias: { fs: "node:fs", "node:fs": "node:fs" } },
    compatibilityDate: "2026-09-03",
    esbuild: { options: { target: "es2022" } },
    /** The puzzle images and hints, served from the checkout's assets/ under /assets. */
    publicAssets: [{ dir: resolve(repoRoot, "assets"), baseURL: "/assets", maxAge: 60 * 60 * 24 }],
    /** The checkout's CHANGELOG.md, read by /changelog and its feed as `assets:changelog`. */
    serverAssets: [{ baseName: "changelog", dir: repoRoot, pattern: "CHANGELOG.md" }],
    prerender: {
      crawlLinks: true,
      routes: [
        "/",
        "/playground",
        "/changelog",
        "/changelog.xml",
        "/sitemap.xml",
        "/robots.txt",
        "/llms.txt",
        "/llms-full.txt",
      ],
      /**
       * Every puzzle page links the playground with a query; one prerender of the page serves them all.
       *
       * @param {string} path - A route the crawler found.
       * @returns {boolean} Whether to skip it.
       */
      ignore: [(path: string): boolean => path.startsWith("/playground?")],
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  compatibilityDate: "2026-09-03",
  content: {
    database: {
      type: "d1",
      bindingName: "DB",
    },
    build: {
      markdown: {
        highlight: {
          // One theme of CSS variables for both modes; app.css gives the variables their light and dark values.
          theme: {
            default: puzzlesTheme,
            light: puzzlesTheme,
            dark: puzzlesTheme,
          },
        },
      },
    },
  },
});

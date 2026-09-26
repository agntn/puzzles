import { resolve } from "node:path";
import { puzzlesTheme } from "./shiki-theme";

/** Bundled from the checkout's sources: a deploy needs neither dist/ nor the root node_modules. */
const repoRoot = resolve(import.meta.dirname, "..");
const librarySource = resolve(repoRoot, "src");

/** Runtime deps under src/index.ts, installed here so they resolve from docs/node_modules. */
const libraryDependencies = ["@agntn/chains", "@agntn/explorers", "@agntn/keys"];

/** Every subpath src/ imports, dynamic ones too, so dev bundles them up front, not on demand. */
const libraryEntries = [
  "@agntn/chains",
  "@agntn/explorers",
  "@agntn/explorers/providers/arweave",
  "@agntn/explorers/providers/blockchair",
  "@agntn/explorers/providers/blockstream",
  "@agntn/explorers/providers/dcrdata",
  "@agntn/explorers/providers/etherscan",
  "@agntn/explorers/providers/mempool",
  "@agntn/keys",
  "@agntn/keys/bip39",
  "@agntn/keys/blockchains/bitcoin",
  "@agntn/keys/blockchains/bitcoincash",
  "@agntn/keys/blockchains/decred",
  "@agntn/keys/blockchains/ethereum",
  "@agntn/keys/blockchains/litecoin",
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
  "ktimesg/80_bit",
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

export default defineNuxtConfig({
  extends: ["docus"],
  /** The repo root is its own pnpm workspace; Nuxt must not treat it as this site's. */
  workspaceDir: import.meta.dirname,
  alias: {
    "@agntn/puzzles/tools": resolve(librarySource, "tool-operations.ts"),
    "@agntn/puzzles": resolve(librarySource, "index.ts"),
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
  /** Docus pages define their own OG images; the alt text is the one thing they leave unset. */
  ogImage: {
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
  /** Docus ships an MCP endpoint that wants the Cloudflare Agents SDK on Workers. Not needed. */
  mcp: {
    enabled: false,
  },
  routeRules: Object.fromEntries(
    renamedIds.map((id) => [
      `/collections/${id}`,
      { redirect: { to: `/collections/${id.replaceAll("_", "-")}`, statusCode: 301 } },
    ]),
  ),
  nitro: {
    preset: "cloudflare_module",
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

import { resolve } from "node:path";

/** Bundled from the checkout's sources: a deploy needs neither dist/ nor the root node_modules. */
const repoRoot = resolve(import.meta.dirname, "..");
const librarySource = resolve(repoRoot, "src");

/** Runtime deps under src/index.ts, installed here so they resolve from docs/node_modules. */
const libraryDependencies = ["@agntn/chains", "@agntn/explorers", "@agntn/keys", "@noble/hashes"];

/** Every subpath src/ imports, dynamic ones too, so dev bundles them up front, not on demand. */
const libraryEntries = [
  "@agntn/chains",
  "@agntn/explorers",
  "@agntn/explorers/providers/arweave",
  "@agntn/explorers/providers/dcrdata",
  "@agntn/explorers/providers/etherscan",
  "@agntn/explorers/providers/mempool",
  "@agntn/keys",
  "@agntn/keys/bip39",
  "@agntn/keys/blockchains/bitcoin",
  "@agntn/keys/blockchains/decred",
  "@agntn/keys/blockchains/ethereum",
  "@agntn/keys/blockchains/litecoin",
  "@noble/hashes/sha2.js",
  "@noble/hashes/utils.js",
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
      "Public crypto bounties, puzzles and challenges as typed records: 343 puzzles in seventeen collections, as a library, a CLI, an MCP server and Pi and OMP extensions.",
    sections: [
      {
        title: "Playground",
        description: "Look up, list and verify puzzles in the browser.",
        links: [
          {
            title: "Playground",
            href: "https://puzzles.agntn.dev/playground",
            description:
              "The library running in the page: show, list, verify, collections and stats.",
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
        "lucide:camera",
        "lucide:check",
        "lucide:chevron-left",
        "lucide:chevron-right",
        "lucide:circle-check",
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
  nitro: {
    preset: "cloudflare_module",
    compatibilityDate: "2026-09-03",
    esbuild: { options: { target: "es2022" } },
    /** The puzzle images and hints, served from the checkout's assets/ under /assets. */
    publicAssets: [{ dir: resolve(repoRoot, "assets"), baseURL: "/assets", maxAge: 60 * 60 * 24 }],
    prerender: {
      crawlLinks: true,
      routes: ["/", "/playground", "/sitemap.xml", "/robots.txt", "/llms.txt", "/llms-full.txt"],
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
          theme: {
            default: "github-light",
            light: "github-light",
            dark: "vitesse-dark",
          },
        },
      },
    },
  },
});

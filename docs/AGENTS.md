# docs/

Cloudflare Workers Builds deploys this site to puzzles.agntn.dev. It installs `docs/` alone, so the root `node_modules` and `dist/` never exist there, and takes Node.js from the root `.node-version`.

Resources on the Cloudflare account, bound by id in `wrangler.jsonc`:

- D1 `agntn-puzzles` as `DB` for Nuxt Content, with its own database for branch previews
- The Etherscan key, when set, is the worker secret `NUXT_ETHERSCAN_API_KEY`; without it Ethereum balances go to Blockscout
- `/changelog` and `/changelog.xml` read GitHub Releases at build. A `GITHUB_TOKEN` build variable, when set, lifts GitHub's limit of 60 requests an hour per address
- No KV: the five minute balance cache is Nitro's in-memory one, per isolate

Workers Builds restores `node_modules/.cache/nuxt` between builds, which keeps the rendered OG cards. A card's key covers its props, its template and the files that template imports. After changing anything else a card shows, such as a font file, clear the build cache in the dashboard, or the old card stays for up to three days.

# Contributing

Code fixes, new puzzle collections, and evidence-backed data updates are welcome.

## Development

```bash
pnpm install
pnpm fixtures --check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:packed
node src/cli.ts collections
```

The docs site is a member of the root pnpm workspace, so the same install sets it up. Its postinstall runs `nuxt prepare`. `pnpm lint` and `pnpm test` both read what it generates: the linter type checks the docs through `.nuxt/`, and the landing test imports `docs/app/utils`, which vite compiles through the Nuxt tsconfig. `pnpm typecheck` builds the package first, then checks the library, the Pi extension, and the OMP extension. `pnpm test:packed` packs the tarball and runs every published entry without `src/`. Node.js 26 or newer runs the TypeScript sources directly, so `node src/cli.ts collections` works without a loader and must list every collection in the manifest.

`pnpm test:live` runs the roundtrips against public explorers in `test/live/`, which stay out of CI. The Etherscan case needs `ETHERSCAN_API_KEY` and skips without it.

Test files share one worker without isolation, so a test that changes the registry imports a fresh module graph (`vi.resetModules()` plus a dynamic import) and resets it again when it's done.

## Adding or updating puzzle data

Each puzzle is a `PuzzleSpec` record in `src/collections/<collection>/<name>.ts`, built with `puzzle()` and listed in `src/collections/<collection>.ts`. Singleton collections keep their puzzle in the collection module. There is no generated data file, and there must never be a second copy of the records.

1. Fixing one puzzle means editing its record. Declare only what the puzzle has; absent fields disappear from the serialized record.
2. A new puzzle gets its own file, a record built with `puzzle()` and its `chain`, an import, and an entry in the collection's `puzzles` list. Use a concise camelCase export such as `luckyLurkerVault2`, preserving the publisher's word boundaries without adding a redundant `Puzzle` segment. A puzzle needing custom behavior may still extend a chain base directly.
3. A new collection gets a class with a `static readonly key`, its author built with `party()`, a canonical instance exported from its module, and a `{ key, load }` entry in `src/collections/index.ts`. No `registerCollection()` call and no root export: the manifest is the registration. Its page goes under `docs/content/2.collections/`.
4. Write the address as a string; the factory reads its kind on the record's `chain`. Build keys, transactions, assets, parties, and the addresses a string can't carry (a published redeem or witness script, a CashAddr) with the constructors in `src/core/parts.ts`. Do not hand-write the record shapes.
5. Keep source URLs and on-chain evidence with the record.
6. Run `pnpm test`. The data gate checks unique identifiers, collection ownership, address and txid formats, private key derivation, WIF and BIP38 consistency, claimed public keys, asset paths, and that nothing serializes as null.
7. Run `pnpm fixtures` after a record or shared view helper changes the landing samples, statistics, or collection facts. `pnpm fixtures --check` reports stale output without writing.

What a record may say:

- **Identifiers** are `collection/name`, both segments kebab-case like the file names, asset directories and docs URLs. A singleton's ID is its bare collection key, such as `gsmg`.
- **Status** is stated, never derived, and defaults to `unsolved`. A claim transaction plus a published key still means `solved`.
- **A hint** records who gave it and where. Its `source` is the publication. An optional `confirmation` links an archive or another publication of the same hint by its author, never a solver's reconstruction; don't require a second URL or invent one. A hint never records whether it is right. A published answer goes into its `answer` part with its own source, never into the hint text and never automatically into the key. A hint that holds for every puzzle of a collection lives once on the collection, as the fourth constructor argument.
- **A technique** is a name from the `Technique` vocabulary in `src/core/technique.ts` plus the page that says it was used: the author's recipe or a published solution, never a guess. It goes on a stage, a record, or once on the collection as the fifth constructor argument. A new name needs its one line in `Technique`, the records whose sources state it, and the counts `test/unit/library.test.ts` pins.
- **A solver** with a name carries a kebab-case `key` on every puzzle it solved, with the same name and kind, and at least one sourced `fact`; a second solve repeats the key and adds only its own facts. A solver known only by an address has no key. A new key gets `docs/content/4.solvers/<n>.<key>.md` with `::solver-facts{solver="<key>"}`.

Fragile sources have [local reading copies with screenshots](assets/sources/README.md): every tweet a record cites, and every thread whose post or comments carry an answer key. When adding one, archive the page too and extend `test/unit/source-archives.test.ts`. Include an older web archive URL when one exists, with its capture date and whether its content was confirmed. Keep the original URL in the record.

## Changing the code

- **A new puzzle field** gets a method on `Puzzle` with a safe default, a line in `toJSON()`, a field in `PuzzleSpec` and the spec-backed puzzle, and a constructor in `parts.ts`.
- **A new agent tool** gets its executor and `facts` entry in `src/tool-operations.ts` and its `defineTool` in `puzzlesTools` in `src/tools.ts`. MCP, the remote server and both extensions pick it up without an edit. Extend the tool tests.
- **A tool with its own page** (an MCP App) is one `docs/app/mcp/<name>.vue` under `defineMcpApp`. The toolkit builds the tool and its `ui://` page from that file, and only the remote server serves it. Extend `test/unit/docs-mcp.test.ts`.
- **A command only the CLI needs** goes into `src/commands/<name>.ts` as a `defineTool` with its `cli` hint, into the list in `src/commands/index.ts`, and into `test/unit/cli.test.ts`.
- **A new public export** goes into `src/index.ts`. Build before checking the extensions, because they resolve `dist/index.d.mts`.

## Docs site

`pnpm run docs` serves it on port 3000. `pnpm exec nuxt typecheck` in `docs/` also checks the `.vue` files; read the `app/` and `server/` lines only, since Docus's own sources report errors under this config.

- Versions live in the `deps` and `dev` catalogs of `pnpm-workspace.yaml`, so one line moves the library and the site together. Nothing is hoisted: every package the site imports sits in `docs/package.json`, and `test/unit/docs-dependencies.test.ts` names the one you forgot.
- A count in prose comes from the library through `:dataset-count` or `::dataset-stats`, never typed in. README, frontmatter and config files don't quote a dataset count at all; `test/unit/docs-counts.test.ts` fails when one comes back.
- A record quoted in `content/` is a record from `src/collections/`, checked against the file.
- A frontmatter `description` has no `: `, which takes the page out of the prerender with a silent 500, and no commas, which the OG pipeline strips.
- An old page address moves with `moved()` in `nuxt.config.ts`, which answers a 301 from the worker.

## Pull requests

Create a focused branch, push it to your fork, and open a pull request against `main`. Keep unrelated formatting and data changes out of the same patch.

The commit scope is the layer, never the element. Anything under `src/collections/` is `collections`, with the identifier in the subject: `feat(collections): add movie-enigma`, `fix(collections): bits/135 solved`. Code takes the module name (`verify`, `dataset`, `cli`, `tools`).

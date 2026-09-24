# Contributing

Code fixes, new puzzle collections, and evidence-backed data updates are welcome.

## Development

```bash
pnpm install
pnpm --dir docs install
pnpm fixtures --check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:packed
```

The docs site is its own pnpm workspace whose postinstall runs `nuxt prepare`. `pnpm lint` and `pnpm test` both read what it generates: the linter type checks the docs through `.nuxt/`, and the landing test imports `docs/app/utils`, which vite compiles through the Nuxt tsconfig. `pnpm typecheck` builds the package first, then checks the library, the Pi extension, and the OMP extension. Node.js 24 or newer runs the TypeScript sources directly, so `node src/cli.ts stats` works without a loader.

## Adding or updating puzzle data

Each puzzle is a `PuzzleSpec` record in `src/collections/<collection>/<name>.ts`, built by a factory for its chain and listed in `src/collections/<collection>.ts`. Singleton collections keep their puzzle in the collection module. There is no generated data file.

1. Fixing one puzzle means editing its record. Declare only what the puzzle has; absent fields disappear from the serialized record.
2. A new puzzle gets its own file, a record built with the matching factory (`bitcoinPuzzle`, `ethereumPuzzle`, and so on), an import, and an entry in the collection's `puzzles` list. Use a concise camelCase export such as `luckyLurkerVault2`, preserving the publisher's word boundaries without adding a redundant `Puzzle` segment. A puzzle needing custom behavior may still extend a chain base directly.
3. A new collection gets a class with a `static readonly key`, a canonical instance exported from its module, and a `{ key, load }` entry in `src/collections/index.ts`. No `registerCollection()` call and no root export: the manifest is the registration.
4. Build addresses, keys, transactions, assets, and parties with the constructors in `src/core/parts.ts`. Do not hand-write the record shapes.
5. Keep source URLs and on-chain evidence with the record.
6. Run `pnpm test`. The data gate checks unique identifiers, collection ownership, address and txid formats, private key derivation, WIF and BIP38 consistency, claimed public keys, asset paths, and that nothing serializes as null.
7. Run `pnpm fixtures` after a record or shared view helper changes the landing samples, statistics, or collection facts. `pnpm fixtures --check` reports stale output without writing.

Fragile sources have [local reading copies with screenshots](assets/sources/README.md): every tweet a record cites, and every thread whose post or comments carry an answer key. When adding one, archive the page too and extend `test/unit/source-archives.test.ts`. Include an older web archive URL when one exists, with its capture date and whether its content was confirmed. Keep the original URL in the record.

## Pull requests

Create a focused branch, push it to your fork, and open a pull request against `main`. Keep unrelated formatting and data changes out of the same patch.

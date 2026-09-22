# AGENTS.md for `@agntn/puzzles`

## Scope

Repository-wide operating contract for agents changing this package. It supplements higher-priority safety and user instructions. A nested `AGENTS.md`, if introduced, overrides this file within its directory.

`@agntn/puzzles` is a dataset kept as code of public crypto bounties, puzzles, and challenges. Every puzzle is a typed record built by a factory for its chain; a collection is a list of those puzzles. The library, CLI, MCP server, and the Pi/OMP extensions all read the same registry. There is no build-time data artifact and no editable JSON.

## Architecture

- `src/core/puzzle.ts` holds the abstract `Puzzle`, the chain bases (`BitcoinPuzzle`, `EthereumPuzzle`, `LitecoinPuzzle`, `DecredPuzzle`, `ArweavePuzzle`, `MoneroPuzzle`), `Status`, `toJSON()`, and the `PuzzleSpec` record with its chain factories (`bitcoinPuzzle` … `moneroPuzzle`).
- `src/core/parts.ts` holds the constructors a puzzle class calls: addresses (`p2pkh`, `p2sh`, `p2wpkh`, `p2wsh`, `standard`), pubkeys, transactions, assets, parties, hints (`official`, `community`, `confirmation`), and the chained `Key` builder.
- `src/core/collection.ts` freezes and indexes the puzzle list and implements lookup, filters, balances, and verification once.
- `src/core/registry.ts` is a lazy manifest registry: a table seeded on first use from `builtins` in `src/collections/index.ts`, where each entry is a key plus a literal `import()` of the collection module. Keys, aliases, and `hasCollection()` answer synchronously; instances load on the first lookup for their key.
- `src/core/dataset.ts` computes the asynchronous aggregate views `all()`, `selectPuzzles()`, `get()`, `collectionSummaries()`, `stats()`, `dataVersion()`, `dataset()`; the cached ones are memoized per loaded snapshot, so a registration invalidates them by identity.
- `src/core/chains.ts` narrows `@agntn/chains` to the six supported chains and reads names, symbols, decimals, explorer bases, and the address and txid format checks from it.
- `src/core/balance.ts` holds the balance contract (`BalanceOptions` and the error classes); `src/core/providers.ts` maps each chain to its `@agntn/explorers` provider and is imported by `Puzzle.balance()` on first use.
- `src/core/verify.ts` resolves a record's secret and compares the derived address; `src/core/crypto.ts` maps each chain to its `@agntn/keys` wallet and translates a record's pubkey format and address kind into keys' options. Curves, checksums, WIF and seed derivation live in keys.
- `src/collections/index.ts` is the manifest; `src/collections/<key>.ts` is a collection: author and the puzzle list, published as `@agntn/puzzles/collections/<key>` and bundled as its own input.
- `src/collections/<key>/<name>.ts` is one puzzle record built with a factory for its chain. Singleton collections keep their single puzzle in the collection file.
- `src/commands/` and `src/cli.ts` are the citty commands and the `puzzles` entry point.
- `src/tool-operations.ts` implements every agent tool once, for MCP and both extensions, holds the `facts` table they register from (names, prose, parameter constraints, the status list), and enforces those constraints in the executors.
- `packages/shared/puzzles-tool-schemas.ts` builds the TypeBox parameter schemas from `facts` for Pi and the MCP server; the OMP wrapper rebuilds them from the host TypeBox build.
- `src/mcp.ts` runs the MCP server on the low-level SDK `Server` with the shared typebox schemas.
- `packages/{pi,omp}/extensions/puzzles.ts` are the harness-specific wrappers over `tool-operations.ts`.

## Invariants

- **Source of truth:** puzzle data lives in the collection modules' `PuzzleSpec` literals and nowhere else. Never reintroduce a generated JSONC artifact or a second data module that mirrors them.
- **A puzzle answers, it does not describe:** consumers read through methods: `id()`, `address()`, `sourceUrl()`, `startedAt()`, `chain()`, and the computed ones. The data itself is one `PuzzleSpec` literal handed to the matching chain factory; a hand-written subclass of a chain base stays valid for a puzzle that needs behavior of its own.
- **No nulls:** absent data means no spec field and no key in the serialized record. `toJSON()` omits, never nulls.
- **Status is explicit:** it defaults to `unsolved` and cannot be derived, because a claim transaction plus a published key still means `solved`.
- **Parts, not literals:** build addresses, keys, transactions, assets, parties, and hints with the `parts.ts` constructors so optional fields stay absent instead of empty. A hint records who gave it and where; its `source` is the publication evidence. Optional `confirmation` links to an archive or another publication of the same hint by its author, not a solver's reconstruction or general puzzle context. Do not require a second URL or invent corroboration. A hint never records whether it is right. A published answer belongs in its optional `answer` part, with its own source and optional publication date, never in the original hint text or automatically in the puzzle's key. A hint that holds for every puzzle of a collection lives on the collection once, as the fourth constructor argument, and `Collection.hintsById()` joins it with a puzzle's own.
- **Records stay as written:** the factory freezes the spec through with `frozen()` from `parts.ts`, `Key` freezes its data, `Collection` freezes the author, and `toJSON()` and the memoized dataset views freeze what they build, so every accessor hands back immutable data and the views memoized per registry snapshot stay true. New parts are plain objects and arrays, which the freeze walks; a class with private state freezes its own.
- **Registration is a lazy manifest:** `src/collections/index.ts` lists `{ key, load }` entries and imports no collection module statically; `src/core/registry.ts` seeds its table from that list on first use, so importing the package has no side effects and `sideEffects` names only the CLI entry. `registerCollection()` stays open for instances and for `{ key, load }` entries. A new collection needs a `static readonly key`, a manifest entry, and nothing else: `build.config.ts` reads the directory and `test/unit/library.test.ts` compares the modules on disk with the manifest and loads each entry.
- **Views are asynchronous:** everything that needs instances (`collections()`, `getCollection()`, `all()`, `get()`, `stats()`, `dataVersion()`, `dataset()`, the tools, the commands) awaits the loads; `collectionKeys()` and `hasCollection()` stay synchronous on the manifest. The root entry never re-exports a collection; consumers import one from `@agntn/puzzles/collections/<key>`.
- **One registry:** `src/core/registry.ts` is the only registry. Keep the `peter_todd` and `warpwallet` aliases.
- **Identifiers:** IDs stay `collection/name`; singleton IDs are `gsmg`, `bitaps`, `mineshop` and `movie_enigma`. A collection resolves a query only in the spelling its identifier uses, `71`, `"71"` or `"b1000/71"`, never a `Number()` reading such as `"0x47"` or `"7e1"`, and a query of another type is a miss, not a `TypeError`.
- **Data version:** `dataVersion()` is the first 12 hex characters of SHA-256 over the serialized collection array. It must stay free of timestamps and environment data.
- **Runtime split:** `src/core/` and `src/index.ts` stay neutral ESM with no APIs that need Node. Code that needs Node belongs to `src/cli.ts`, `src/commands/`, and `src/mcp.ts`.
- **Balances:** `Puzzle.balance()` is the one entry; collections forward to it. Base units are `bigint`, providers come from `@agntn/explorers` and load on the first lookup, and API keys are redacted from every error. Tests stub `globalThis.fetch` instead of injecting a transport.
- **Verification:** expected verification failures are values, not exceptions.
- **CLI output:** command output goes through `src/commands/output.ts`. Never print data with a logger, because consola silences machine-readable output under `NODE_ENV=test`.
- **Tools:** add an agent tool once in `src/tool-operations.ts`, with its entry in `facts` and its schema in `packages/shared/puzzles-tool-schemas.ts`; MCP and both extensions never restate a name, description, limit, or status list. Executors enforce the same argument limits the schemas declare and throw `InvalidArgumentError`; `test/unit/tool-schemas.test.ts` pins both sides. Discovery is one contract: `puzzles_collections` prints the rows of `puzzles collections`.
- **Extensions:** their factories are asynchronous because they load `tool-operations` first through literal `import()` specifiers, `src/` in a checkout and `dist/` when installed; their types come from `src/`, so typechecking them does not depend on a fresh `dist`. The MCP error path sanitizes control characters and quotes echoed values.
- **Verification is lazy:** `Collection.verify()` imports `verify.ts` on first use so keys stays out of CLI startup; keep `collection.ts` free of static imports from `verify.ts` and `crypto.ts`. The `verify` command imports it when it runs too, because citty resolves every subcommand for `--help` and for an unknown command, and `test/eval-packed.ts` checks that `puzzles --help` loads neither keys nor the MCP SDK.
- **Tests share module state:** vitest runs with `isolate: false`, so a test that mutates the registry works on a fresh module graph (`vi.resetModules()` plus a dynamic import) and resets the graph again when it is done.

## Change routing

- New puzzle: add `src/collections/<key>/<name>.ts` exporting a record built with the right chain factory, then import it and append it to the collection's `puzzles` list. New export names use concise camelCase, preserving the publisher's word boundaries, for example `luckyLurkerVault2`, without a redundant `Puzzle` segment; file names are the identifier segment in kebab-case.
- Puzzle data fix: edit the one record. `test/unit/validation.test.ts` re-checks identifiers, address and txid formats, key material, BIP38 payloads, claimed and swept public keys, asset paths, and the no nulls rule.
- New collection: follow the registration invariant, add its author with `party()` and any collection-wide hints as the fourth constructor argument, add its `{ key, load }` entry to the manifest, and extend `test/unit/library.test.ts`.
- New puzzle field: add the method to `Puzzle` with a safe default, extend `toJSON()`, `PuzzleSpec`, and the internal spec-backed puzzle, then teach `parts.ts` how to build it.
- New CLI command: add `src/commands/<name>.ts`, register it in `src/cli.ts`, cover it in `test/unit/cli.test.ts`.
- New agent tool: implement it in `src/tool-operations.ts`, add its `facts` entry and its schema in `packages/shared/puzzles-tool-schemas.ts`, register it in `src/mcp.ts` and both extensions, extend the tool test files.
- New public export: add it to `src/index.ts`; build before checking extensions because they resolve `dist/index.d.mts`.
- Commit and PR scope is the layer, never the element. Anything under `src/collections/` is `collections`, with the collection or puzzle identifier in the subject: `feat(collections): add movie_enigma`, `fix(collections): b1000/135 solved`. Code takes the module name (`verify`, `dataset`, `cli`, `tools`), so the scope vocabulary stays a dozen names and never grows with the dataset.

## Proof before handoff

```bash
pnpm lint
pnpm typecheck   # builds first, then checks src, Pi, and OMP
pnpm test
pnpm test:packed # packs the tarball and runs every published entry without src/
node src/cli.ts collections
```

`node src/cli.ts collections` must list all twenty collections. Node.js 24 or newer runs the TypeScript sources directly; no loader is required.

## Known debt

Do not mistake these for intentional architecture:

- `src/mcp.ts` uses the SDK's low-level `Server`, which the SDK marks deprecated; the high-level `McpServer` accepts only Zod schemas, and typebox is shared with the Pi and OMP wrappers.
- `dataVersion()` serializes the whole dataset on first use.
- Puzzle accessors rebuild their parts on every call; only the instances themselves are cached.
- Pi and OMP wrappers keep their own loader and schema code because OMP cannot re-export another module's extension and the two harnesses ship different typebox builds; the facts they register come from one table.
- Balance adapters have no retry, timeout, or rate-limit handling.

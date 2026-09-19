## [Unreleased]

### Added

- `hints` on a puzzle record: `official(text, source, confirmation)` for what the author published and `community(…)` for what anyone else said, right or not. Every hint names the URL it was published at and a `confirmation(url, description?)` that shows the source said it, an archive capture, a reply or a transaction, and the data gate refuses a hint whose text spans lines, whose URLs are not web URLs, or whose confirmation repeats its source. `puzzle.hints()` answers the list, `toJSON()` carries it as `hints`, and `puzzles_show` prints `hints: N` with one tab-separated line per hint. A hint that holds for a whole collection goes on the collection once, `super(key, author, puzzles, hints)`, where `collection.hints` reads it, `hintsFor(query)` and `hintsById(id)` join it with a puzzle's own, the dataset carries it once per collection, and `puzzles_show` prints it as `collection hints: N` above the puzzle's. The six WarpWallet records carry the hint Keybase printed next to each wallet, confirmed by Wayback captures. The hint files under `assets/` print as `hint assets:` now, so the two lines do not share a label.

### Changed

- Derive addresses, decode WIFs and walk seed paths through `@agntn/keys` instead of local secp256k1, hash and Base58 code. `@scure/bip32` and `@scure/bip39` leave the dependencies, `@noble/curves` and `@scure/base` stay only for the BIP38 test helper. A WIF now decodes against the chain of its record, so a Litecoin WIF verifies instead of failing on the Bitcoin version byte, and an Ethereum `derivedAddress` carries the EIP-55 checksum. A Decred seed answers `unavailable`, because keys derives no Decred HD wallet.

### Fixed

- `puzzles_show` prints the hints and the solver's notes as URLs. They used to print as bare file names, `hints: follow_the_white_rabbit.png` next to an `asset:` line with the full raw GitHub URL, so a model that only sees the text had nowhere to fetch them from. `assetLinks()` lists every file a record ships with its path and URL, the puzzle image in it as `assetPath()` and `assetUrl()` answer it.
- `puzzles --help`, `-h` and an unknown command no longer load `@agntn/keys` and `@noble/curves`. citty resolves every subcommand to print the usage or to look for an alias, and the `verify` command imported the verification crypto at module scope. It imports it when it runs, the way `mcp` imports the SDK.
- `NumericCollection` resolves a query only in the spelling its identifier uses. `Number()` used to read `b1000.get("0x47")`, `b1000.get(" 71 ")` and `b1000.get("71.0")` as puzzle 71 and `b1000.get("7e1")` as puzzle 70, so `require()`, `balance()` and `verify()` answered for a record the caller never named. A `NamedCollection` handed a non-string query answers `undefined` instead of throwing `TypeError: query.includes is not a function`.
- `collectionSummaries()`, `datasetCollections()`, `dataset()` and `toJSON()` hand back frozen data. The memoized views used to freeze only the outer array, so an assignment to a summary row or a serialized record, or a push into a collection's `puzzles`, rewrote the export for every later reader while `dataVersion()` kept the old hash.
- Puzzle records are frozen through. `address()`, `transactions()`, `keyData()`, `solver()`, `assets()` and `Collection.author` hand back immutable data, where an assignment through any of them used to rewrite the record for every other reader while the memoized `dataVersion()` kept the old hash.
- `puzzles_show` prints the whole record: the key in every form it has, the solve date, the solver, every transaction, the claim link and the assets. It used to stop at `private key known: yes`, and MCP clients never see `details`.

## [0.20.0] - 2026-09-18

### Changed

- Rename the package to `@agntn/puzzles` and the binary to `puzzles`.
- Rewrite the package as an ESM TypeScript library built around classes.
- Define puzzles as typed `PuzzleSpec` records built by a factory per chain and read through `Puzzle` methods. Collections hold the resulting instances.
- Read puzzle fields through methods: `puzzle.address()` instead of `puzzle.address`, and the same for every other field.
- Serialize without null placeholders. Absent data means no key at all, which also drops `address.chain` and the always-empty `witness_program`.
- Build addresses, keys, transactions, assets, and parties with constructors from `src/core/parts.ts`, including a chained `Key` builder.
- Split the data model: `src/core/puzzle.ts` holds the puzzle contract and chain bases, `src/core/parts.ts` holds the pieces.
- Rename the `Author` and `Solver` types to one `Party` type.
- Move lookup, balance, and verification behavior onto the abstract `Collection` contract.
- Replace the Rust CLI and build pipeline with pnpm, strict TypeScript, Vitest, and obuild.
- Rebuild the CLI on citty with one module per command and a new `collections` command.
- Adopt the agntn project template: Node.js 24+ baseline, TypeScript 7, oxlint/oxfmt, obuild, changelogen, and the shared GitHub workflows.
- Rename the base error class from `BohaError` to `PuzzlesError`.
- Replace the `collections` array with a lazy manifest registry. `builtins` lists `{ key, load }` entries, a collection module is imported on the first lookup for its key, and importing the package loads no records. `collectionKeys()` and `hasCollection()` stay synchronous. The views that need instances are asynchronous: `collections()`, `getCollection()`, `requireCollection()`, `all()`, `get()`, `requirePuzzle()`, `selectPuzzles()`, `stats()`, `dataVersion()` and `dataset()`. `registerCollection()` takes an instance or a `{ key, load }` entry.
- Publish every collection as its own entry, `@agntn/puzzles/collections/<key>`, with its class and canonical instance. The root entry no longer re-exports them.
- Build one bundle for the library, CLI, MCP server, tools and collections. They share one registry, no entry embeds a second copy of anything, and typebox is inlined for a faster MCP start.
- Enforce the argument limits the tool schemas declare inside the executors too. An unknown status, a fractional or out-of-range `limit`, or an too long identifier, collection key or API key throws `InvalidArgumentError`.
- Build the Pi and MCP parameter schemas once from `facts` in `packages/shared/puzzles-tool-schemas.ts`. The OMP extension rebuilds them from the host TypeBox build, labels itself and renders sanitized call lines.
- Load the shared tool executors in the extensions through literal `import()` specifiers, so OMP's compiled loader can see the dependencies, and type them from `src/` instead of `dist/`.
- Sanitize control characters out of MCP error text and quote the echoed name of an unknown tool.
- Derive `BalanceError` from `PuzzlesError`, so one base class covers every failure the package raises.
- Turn `dataVersion` into a lazily computed function instead of a generated constant.
- `Balance` derives `decimals` from its chain, so the constructor takes the chain and the two amounts only.
- `Collection.verify()` and `verifyById()` are asynchronous and load the verification crypto on first use, which keeps it out of CLI startup. `verifyPuzzle()` stays synchronous.
- `hasPrivateKey()` and verification read one `secretOf()` resolver, so a seed record with only a derivation path or an xpub no longer counts as a known private key.
- Drop the `bits` filler from the 38 records outside b1000. `bits` marks a search space width only, so `keyRange()` is undefined elsewhere and the validation gate checks every declared width.
- Agent tool names, titles, descriptions, parameter constraints, and the status list live once in `src/tool-operations.ts`. The tools import the library directly instead of receiving it, and the Pi and OMP extensions load that one module before registering.
- The validation gate decrypts BIP38 payloads with Node's native scrypt, pinned to the BIP-38 test vectors, instead of the `bip38` package.
- Fetch balances through `@agntn/explorers` from `puzzle.balance()`: Mempool for Bitcoin and Litecoin, Etherscan V2, Dcrdata and the Arweave gateway. Collections forward `balance(query)` to the puzzle. The providers load on the first lookup. `BalanceOptions` takes `apiKey`, `baseUrl` and `timeout`.
- Read chain names, symbols, decimals, explorer bases and address format rules from `@agntn/chains` instead of local tables. Bitcoin links now point at blockstream.info and Litecoin links at litecoinspace.org. `parseChain()` accepts the `@agntn/chains` aliases.
- `Puzzle.key()` and `PuzzleSpec.key` are typed `Readonly<Key>`: a record hands the builder to its factory and never mutates it.
- Lint and format follow the shared `@agntn/ox` policy: exported functions carry typed JSDoc, object parameters are `Readonly`, and `docs/` is checked like the rest of the repository.
- `pnpm test:packed` packs the tarball and runs the library, the MCP server, both extensions and the CLI bin from the packed layout, in CI and before publish. `pnpm test:live` runs the provider roundtrips. Unit tests never reach them, because `fetch` is stubbed to fail there.
- A Docus site under `docs/`, published at puzzles.agntn.dev. A guide, one page per collection with a facts strip read off the library, and one page per puzzle with its record, transactions, key material, assets and live balance. The landing walks fourteen records in the browser. The playground runs the real tool executors and the worker's balance route.
- Print one discovery row from `puzzles collections` and `puzzles_collections` alike, `key: N puzzles, N solved, N unsolved, by author`, through `formatCollection()`.
- Round the per currency prize totals of `stats()` to eight decimal places, so the CLI, the tools and the docs print `1058.06884913 BTC` instead of float carry.
- Load the verification crypto in `puzzles_verify` on the first call, the way `Collection.verifyById()` does, so registering the tools in MCP, Pi or OMP costs no secp256k1.

### Fixed

- `puzzles --help` no longer loads the MCP SDK: the `mcp` command imports the server when it runs.
- Refresh lazy dataset views, identifier lookups, statistics, and data versions when a collection is registered or replaced.
- Resolve historical aliases without inheriting Object prototype properties.
- Export the documented `passphrase()` key builder and don't count a WIF passphrase alone as a private key representation.
- Declare `sideEffects` as the CLI entry only, which is correct once the registry seeds itself instead of relying on collection modules registering on import.

### Added

- Regression tests for all six puzzle factories, optional fields, and registry mutations.
- MCP server (`puzzles mcp`) plus Pi and OMP extensions sharing one tool implementation.
- Data validation gate as tests, covering identifiers, chain agreement, address formats, key derivation, BIP38 payloads, claimed public keys, and asset paths.
- `isValidAddress(chain, address)` for chain-aware address format checks.
- `selectPuzzles({ collection, status, withPubkey })`, the one puzzle selection the CLI and agent tools share.
- `collectionSummaries()` and the `puzzles_collections` agent tool, which print the same rows as `puzzles collections`.
- `InvalidArgumentError` for arguments that break the shared tool contract.
- `secretOf(keyData)`, the private key representation a key record exposes.

### Removed

- The generated `data/generated.jsonc` artifact, the `src/generated/` module and the generator script. Use `dataset()` or `puzzles export` instead.
- Per-collection subpath exports. Import collections from the package root.
- Puzzle images from the published tarball, which drops it from 38 MB to under 3 MB. `assetUrl()` still resolves them from the repository.
- The Rust sources, `PKGBUILD`, AUR and crates.io workflows, and the `justfile`.
- The local balance adapters, `fetchBalance()`, `fetchPuzzleBalance()`, and the `fetch` and `baseURL` options. Stub `globalThis.fetch` in tests instead.

## [0.19.0] - 2026-08-01

### Features

- _(rushwallet)_ Add 30 RushWallet brainwallet contest puzzles (#152)
- _(b1000)_ Change `135` to solved (#159)

## [0.18.1] - 2026-05-09

### Features

- _(warp)_ Backfill keys + passphrases + KDF salt + schema fixes (#153)

### Documentation

- Fix README and skill drift (#151)

### Miscellaneous Tasks

- _(cli)_ Remove unused #[allow(dead_code)] annotations
- _(release)_ V0.18.1

## [0.18.0] - 2026-03-30

### Features

- _(puzzle)_ Add currency field for non-native token prizes (#143)
- _(balance)_ Add Arweave balance fetching (#144)
- _(arweave)_ Add weave9 puzzle (100 DAI on Ethereum) (#145)
- _(warp)_ Add WarpWallet challenge collection (#149)

### Bug Fixes

- _(cli)_ Reject unknown collections in list (#137)
- _(search)_ Honor case-sensitive fields (#139)
- _(search)_ Match chain symbols (BTC, LTC, XMR, DCR) (#142)
- _(balance)_ Add Decred support (#140)
- _(search)_ Include currency field in search results (#146)
- _(verify)_ Pass BIP39 passphrase to seed derivation (#147)

### Refactor

- _(collection)_ Centralize dispatch registry (#141)

### Miscellaneous Tasks

- _(release)_ V0.18.0

## [0.17.0] - 2026-03-15

### Features

- Add Display and FromStr for Chain and Status (#122)
- _(verify)_ Implement verify_puzzle with chain dispatch (#123)
- Add Chain::address_explorer_url and Puzzle::explorer_url (#129)
- _(hash_collision)_ Add solved() iterator (#126)
- _(balance)_ Add Litecoin balance fetching (#127)
- _(skills)_ Add agent skills (#133)

### Bug Fixes

- _(cli)_ Support ballet in author command (#120)
- Use PUZZLES.len() instead of hardcoded count() (#124)
- Accept mixed-case hex in Chain::is_valid_txid (#125)

### Documentation

- Add vusi and kangaroo to related tools

### Testing

- I32 IntoPuzzleNum edge cases (#121)
- Cover format_duration_human_readable edge cases
- Cover Chain::is_valid_txid across all formats (#128)
- Cover Chain methods (explorer URLs, symbol, name, ALL) (#130)

### Miscellaneous Tasks

- Remove community section from README.md
- Add PR lint caller
- Update README.md
- Update AGENTS.md
- Add clippy config (#135)
- _(release)_ V0.17.0

## [0.16.0] - 2026-02-21

### Features

- _(arweave)_ Add Arweave collection (#111)

### Refactor

- _(chain)_ Multichain prep (#109)
- _(zden)_ Normalize names to snake_case (#114)

### Miscellaneous Tasks

- _(release)_ V0.16.0

## [0.15.0] - 2026-01-27

### Features

- _(cli)_ Add search command (#94)
- _(build)_ Embed data version at build time (#97)
- _(cli)_ Add verify command (#98)
- _(data)_ Migrate from TOML to JSONC (#101)
- Add pubkey validation for claimed puzzles (#103)
- _(cli)_ Add export command (#106)

### Refactor

- _(scripts)_ Migrate from TOML to JSONC (#104)
- _(scripts)_ Unified typed address structs (#108)

### Documentation

- Standardize badges and add community section

### Miscellaneous Tasks

- _(release)_ V0.15.0

## [0.14.0] - 2026-01-13

### Features

- _(zden)_ Add private key for Level 1 puzzle (#81)
- _(build)_ WIF validation at build time (#93)

### Other

- _(zden)_ Add private key for Level 2 puzzle (#85)
- _(zden)_ Add Level 3 private key (#87)

### Refactor

- _(pubkey)_ Rename key to value and use inline TOML tables (#83)

### Documentation

- Update AGENTS.md metadata to current commit

### Miscellaneous Tasks

- _(release)_ V0.14.0

## [0.13.0] - 2026-01-05

### Features

- _(collection)_ Add Ballet challenge (#76)
- _(data)_ Add WIF format to solved puzzles (#79)
- _(release)_ Update README.md version during release

### Documentation

- Sync AGENTS.md with Ballet collection addition

### Miscellaneous Tasks

- _(release)_ V0.13.0

## [0.12.1] - 2026-01-05

### Bug Fixes

- _(package)_ Exclude assets from crates.io package

### Miscellaneous Tasks

- _(release)_ V0.12.1

## [0.12.0] - 2026-01-05

### Features

- _(solvers)_ Add `retired_coder` (#71)
- _(assets)_ Add puzzle assets support (#74)

### Documentation

- Add Related Tools section with vuke and vgen

### Miscellaneous Tasks

- _(release)_ V0.12.0

## [0.11.0] - 2026-01-04

### Features

- _(address)_ Add Address struct (#60)
- _(puzzle)_ Add Key struct (#61)
- _(cli)_ Add human-panic for friendly crash reports (#62)
- _(balance)_ Add Ethereum API support (#63)
- _(scripts)_ Add Decred API support (#64)
- _(address)_ Add SegWit support (#67)
- _(address)_ Add Taproot (P2TR) address type support (#68)
- _(bitaps)_ Add mnemonic challenge (#69)
- _(collections)_ Add bitimage puzzle collection (#70)

### Refactor

- _(solver)_ Extract solvers to dedicated TOML file (#72) (#73)

### Documentation

- Sync AGENTS.md with zden collection
- Update outdated code references
- Sync AGENTS.md with recent changes

### Miscellaneous Tasks

- Add `context7.json`
- _(release)_ V0.11.0

## [0.10.0] - 2026-01-02

### Features

- _(zden)_ Add visual crypto puzzles (#57)
- _(data)_ Add timestamps to dates (#59)

### Miscellaneous Tasks

- _(release)_ V0.10.0

## [0.9.0] - 2026-01-02

### Features

- _(puzzle)_ Add claim_txid accessors and explorer URLs (#43)
- _(puzzle)_ Add solver information for solved puzzles (#51)

### Testing

- Add pubkey to h160 validation (#41)
- _(balance)_ Add coverage for balance feature (#42)
- Add private-key-to-address derivation verification (#45)

### Miscellaneous Tasks

- _(release)_ V0.9.0

## [0.8.0] - 2026-01-02

### Features

- _(puzzle)_ Add transaction history (#34)

### Miscellaneous Tasks

- _(release)_ V0.8.0

## [0.7.0] - 2026-01-02

### Features

- _(puzzle)_ Add KeySource enum for key derivation semantics (#33)
- _(author)_ Add Author struct for collections (#36)

### Documentation

- Update AGENTS.md with code map and testing info

### Miscellaneous Tasks

- Add `deepwiki` badge
- Ad `deepwiki` badge
- _(release)_ V0.7.0

## [0.6.0] - 2025-12-31

### Features

- _(puzzle)_ Generalize key_range (#30)
- _(puzzle)_ Add solve_time field (#32)

### Miscellaneous Tasks

- _(release)_ V0.6.0

## [0.5.0] - 2025-12-31

### Features

- _(puzzle)_ Add h160 field for P2PKH addresses (#17)
- _(puzzle)_ Add script_hash for P2SH (#22)
- _(ci)_ Integrate autofix.ci for automatic formatting (#23)

### Refactor

- _(data)_ Rename btc field to prize in TOML files (#25)

### Documentation

- Add gsmg collection to AGENTS.md

### Miscellaneous Tasks

- _(release)_ V0.5.0

## [0.4.0] - 2025-12-31

### Features

- _(puzzle)_ Add Chain enum (#15)
- _(puzzle)_ Add pubkey_format field (#16)

### Miscellaneous Tasks

- _(release)_ V0.4.0

## [0.3.0] - 2025-12-31

### Features

- _(collections)_ Add GSMG puzzle collection (#10)

### Miscellaneous Tasks

- _(release)_ V0.3.0

## [0.2.0] - 2025-12-30

### Features

- _(puzzle)_ Add start_date field (#7)
- _(puzzle)_ Add source_url field (#8)

### Miscellaneous Tasks

- _(release)_ V0.2.0

## [0.1.0] - 2025-12-30

### Bug Fixes

- Limit version sed to package section only

### Other

- Crypto bounties, puzzles and challenges data library
- Update balances from mempool.space API

### Refactor

- Move hash_collision data to TOML source of truth

### Documentation

- Reorder README sections - CLI before Library
- Add boha list without args to README
- Add detailed puzzle list to Collections section
- Fix b1000 puzzle status breakdown
- Add CONTRIBUTING.md
- Add AGENTS.md project knowledge base

### Styling

- Fix formatting in cli.rs

### Miscellaneous Tasks

- Track Cargo.lock for reproducible builds
- _(release)_ V0.1.0

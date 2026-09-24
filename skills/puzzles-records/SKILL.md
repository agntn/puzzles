---
name: puzzles-records
description: Add or correct puzzle records in the agntn/puzzles repository. Use when a public crypto puzzle or bounty is missing from the dataset, a record's status, address, key, transaction or hint is wrong or out of date, or a new collection needs registering. For reading the data use puzzles; for consuming the package in code use puzzles-library.
metadata:
  author: oritwoen
  version: "0.21.2"
---

# puzzles-records

A record is one `PuzzleSpec` literal handed to the factory for its chain: `bitcoinPuzzle`, `ethereumPuzzle`, `litecoinPuzzle`, `decredPuzzle`, `arweavePuzzle` or `moneroPuzzle`. The collection modules are the only copy of the data. There is no JSON to regenerate.

The repository's `AGENTS.md` and `CONTRIBUTING.md` own the invariants. This skill is the path through them.

## Before writing anything

Check what is already there. `puzzles_list` with the `address` filter, or `puzzles list --address <addr>`, tells you whether the puzzle is recorded. `puzzles_collections` tells you whether its collection exists. Read the records next to it before you write your own.

A field goes in only when a citable source states it. Do not run a solver, a decoder or a key search to fill an address, seed or key the source never printed. Checking a published key against the address already on the record is verification, not solving.

## New puzzle

1. Create `src/collections/<key>/<name>.ts`. The file name is the identifier segment in kebab-case. The export is concise camelCase without a `Puzzle` suffix.
2. Build the record with the chain's factory and the constructors from `src/core/parts.ts`. Leave out every field the puzzle does not have. See [parts.md](references/parts.md).
3. Import it in `src/collections/<key>.ts` and append it to `static readonly puzzles`.

```ts
import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { funding, official, p2pkh } from "../../core/parts.ts";

export const exampleLevel1 = bitcoinPuzzle({
  id: "example/level_1",
  address: p2pkh("1…"),
  sourceUrl: "https://…",
  startedAt: "2026-01-01 00:00:00",
  transactions: [funding("txid…", "2026-01-01 00:00:00", 0.5)],
  hints: [official("The first clue, as written.", "https://…")],
});
```

## Fixing a record

Edit that one record. Status is explicit and defaults to `unsolved`. It is never derived: a claim transaction plus a published key still means `solved`. A hint keeps its text as published. An answer published later goes into its `answer` part with its own source, never into the hint text and never automatically into the key.

## New collection

A class with a `static readonly key`, its author built with `party()`, any hint that holds for every puzzle as the fourth constructor argument, and a `{ key, load }` entry in `src/collections/index.ts`. Nothing else registers it. The build and `test/unit/library.test.ts` read the directory and the manifest. The docs site gets a page under `docs/content/2.collections/`.

## Fragile sources

Every X/Twitter URL a record cites needs an `assets/sources/<collection>/<handle>-<date>.{md,png}` pair and a row in `test/unit/source-archives.test.ts`. A forum or Reddit thread whose post or comments hold the answer, the address or the author's explanation gets the same treatment. See `assets/sources/README.md`.

## Proof

```bash
pnpm test                   # identifiers, formats, key derivation, BIP38, pubkeys, assets, no nulls
node src/cli.ts verify <id> # the key you recorded derives the address
pnpm fixtures --check       # landing samples and counts still match
```

Then `pnpm lint`, `pnpm typecheck` and `pnpm test:packed` as the repository's `AGENTS.md` lists them. The commit scope is `collections`, with the identifier in the subject: `feat(collections): add example`, `fix(collections): b1000/135 solved`.

## Related

- [puzzles](../puzzles/SKILL.md) to look records up before and after.
- [puzzles-library](../puzzles-library/SKILL.md) and its [api.md](../puzzles-library/references/api.md) for the read contract and serialized shapes.

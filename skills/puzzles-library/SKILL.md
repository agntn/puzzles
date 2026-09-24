---
name: puzzles-library
description: Write TypeScript against the @agntn/puzzles library. Use when code imports `@agntn/puzzles` or `@agntn/puzzles/collections/<key>`, reads puzzle records, filters the registry, fetches balances, verifies key material, or registers its own collection. For answering a question about the data use puzzles; for changing the records in the repository use puzzles-records.
metadata:
  author: oritwoen
  version: "0.21.2"
---

# puzzles-library

```bash
pnpm add @agntn/puzzles
```

Node.js 24 or newer, or any runtime that runs neutral ESM: browsers and edge workers too.

## Discover, don't hardcode

The registry is the list of collections. Code that needs one should get it from there, not from a key typed into the source, unless it really targets that collection.

```ts
import { collectionKeys, collectionSummaries, get, selectPuzzles } from "@agntn/puzzles";

collectionKeys(); // synchronous, from the manifest, nothing loaded
await collectionSummaries(); // { key, author, total, solved, unsolved, ... }[]
await selectPuzzles({ chain: "ethereum", status: "unsolved" }); // filtered across every collection
await selectPuzzles({ address: "1FLAMEN6rq2BqMnkUmsJBqCGWdwgVKcegd" }); // the puzzle paying there
await get("b1000/66"); // Puzzle | undefined, loads one collection
```

Importing the package loads no records. The manifest holds keys only, and a collection module is imported on the first lookup for its key. That is why every view that needs instances is async: `all`, `get`, `requirePuzzle`, `selectPuzzles`, `stats`, `collections`, `getCollection`, `collectionSummaries`, `dataVersion`, `dataset`. Only `collectionKeys()` and `hasCollection()` answer synchronously.

A module that works with one collection imports it directly, and from then on the lookups are synchronous:

```ts
import { b1000 } from "@agntn/puzzles/collections/b1000";

const puzzle = b1000.require(66); // throws when missing
b1000.get(999); // undefined when a miss is normal
```

The root entry never exports a collection. `import { b1000 } from "@agntn/puzzles"` does not work.

## Reading a puzzle

Reads are methods: `puzzle.address().value`, `puzzle.status()`, `puzzle.prize()`. An optional read returns `undefined` when the record does not have it, and `toJSON()` leaves the key out. Nothing is null. Records are frozen, so change a key with the builder, which returns a copy: `puzzle.key()?.wif(found)`.

Every collection has the same methods from `Collection`: `get`, `require`, `all`, `solved`, `unsolved`, `withPubkey`, `count`, `hintsFor`, `balance`, `verify`, plus the `...ById` forms that take a full identifier.

## Network and crypto load late

- `puzzle.balance(options)` goes through `@agntn/explorers` and loads the provider on the first call. Amounts are `bigint` base units. Ethereum needs an Etherscan key. There is no retry or rate limiting.
- `collection.verify(query)` loads the key derivation on the first call. An expected failure is a `VerifyResult` with `verified: false`, not an exception. `verify(puzzle)` does the same for a puzzle already in hand.
- `dataVersion()` serializes the whole dataset once, then caches. Fine at startup, wasteful in a loop.

## Own collections

`registerCollection()` takes an instance, or `{ key, load }` for a lazy one. It can add a collection or replace the one under the same key, built-ins included. The aggregate views are memoized per registry snapshot, so a registration invalidates them.

## Reference

[api.md](references/api.md) has the read contract, the serialized shapes, chains, balances, verification, the registry calls and the error classes. Read it when you need a signature, not up front.

## Related

- [puzzles](../puzzles/SKILL.md) for the agent tools and the CLI.
- [puzzles-records](../puzzles-records/SKILL.md) for building records with the part constructors.

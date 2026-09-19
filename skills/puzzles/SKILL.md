---
name: puzzles
description: Use @agntn/puzzles for crypto puzzle and bounty data, either as a TypeScript library, the `puzzles` CLI, or the puzzles_* agent tools. Trigger when code imports `@agntn/puzzles`, when running `puzzles` commands, or when looking up Bitcoin puzzle transactions, hash-collision bounties, brainwallet contests, or other public crypto challenges.
metadata:
  author: oritwoen
  version: "0.20.0"
---

# puzzles

Eleven collections, 333 puzzles, six chains: Bitcoin, Ethereum, Litecoin, Monero, Decred, Arweave. Every puzzle is a typed record built by a factory for its chain (`bitcoinPuzzle({...})`), and a collection is a list of those puzzles. Importing the package loads no records: the registry is a manifest of keys, a collection module is imported on the first lookup for its key, and `@agntn/puzzles/collections/<key>` serves one collection directly. No JSON file, no fetch, no init.

Reads are methods, not properties. `puzzle.address()`, not `puzzle.address`. A puzzle with no solver or prize simply leaves those fields out of its record, which is why nothing in the dataset is null.

## Install

```bash
pnpm add @agntn/puzzles          # library
pnpm dlx @agntn/puzzles stats    # CLI without installing
```

Node.js 24 or newer. The library builds as neutral ESM, so browsers and edge workers run it too.

## Puzzle ID format

IDs are `collection/identifier`. Three singletons have no slash, which trips people up more than anything else here.

| Collection       | ID example              | Query type                                        |
| ---------------- | ----------------------- | ------------------------------------------------- |
| `b1000`          | `b1000/66`              | number 1-256 or string                            |
| `arweave`        | `arweave/weave1`        | name                                              |
| `ballet`         | `ballet/AA007448`       | serial number                                     |
| `bitaps`         | `bitaps`                | singleton, no argument                            |
| `bitimage`       | `bitimage/kitten`       | name                                              |
| `gsmg`           | `gsmg`                  | singleton, no argument                            |
| `hash_collision` | `hash_collision/sha256` | sha1, sha256, ripemd160, hash160, hash256, op_abs |
| `movie_enigma`   | `movie_enigma`          | singleton, no argument                            |
| `rushwallet`     | `rushwallet/9`          | name "1"-"30"                                     |
| `warp`           | `warp/challenge_1`      | challenge_1-4, warp_challenge_1-2                 |
| `zden`           | `zden/level_1`          | snake_case level name                             |

Old names still resolve: `peter_todd` gives you `hash_collision`, `warpwallet` gives you `warp`.

## Library

```ts
import { all, collectionKeys, collections, get, stats } from "@agntn/puzzles";
import { b1000 } from "@agntn/puzzles/collections/b1000";
import { hashCollision } from "@agntn/puzzles/collections/hash_collision";

const puzzle = b1000.require(66); // collection query, throws when missing, synchronous
const same = await get("b1000/66"); // universal ID, loads b1000 only
const missing = await get("nope"); // undefined, no throw

console.log(puzzle.address().value, puzzle.status(), puzzle.prize());

const targets = b1000.unsolved().filter((p) => p.hasPubkey());
const range = b1000.require(90).keyRange(); // [2n ** 89n, 2n ** 90n - 1n]

console.log(collectionKeys().length); // from the manifest, nothing loaded
console.log((await stats()).unsolved, (await all()).length, (await collections()).length); // loads everything
console.log(hashCollision.require("sha256").explorerUrl());
```

The aggregate views (`all`, `get`, `requirePuzzle`, `selectPuzzles`, `stats`, `collections`, `collectionSummaries`, `dataVersion`, `dataset`) are asynchronous because they load collections on demand. `collectionKeys()` and `hasCollection()` read the manifest synchronously.

Every collection inherits the same methods from the abstract `Collection`: `get()`, `require()`, `requireId()`, `all()`, `solved()`, `unsolved()`, `withPubkey()`, `count()`, `solvedCount()`, `unsolvedCount()`, `balance()`, `balanceById()`, `verify()`, `verifyById()`. Pick `get()` when a miss is normal and `require()` when it is a bug.

### Balances

```ts
const balance = await b1000.require(71).balance();
console.log(balance.confirmed, balance.totalUnits()); // bigint base units, then a float
```

`balance()` sits on the puzzle and goes through `@agntn/explorers`: Mempool for Bitcoin and Litecoin, Etherscan V2 for Ethereum, Dcrdata for Decred, the Arweave gateway for Arweave. `collection.balance(query)` forwards to the selected puzzle. Ethereum needs a key. Monero has no provider at all, so that call rejects instead of guessing. The providers load on the first call, not at import.

```ts
await b1000.balance(71, { apiKey: "etherscan-key", baseUrl: "https://…", timeout: 5000 });
```

There is no retry and no rate limiting. Loop over 300 addresses and the provider will start refusing you.

### Verification

```ts
const result = await b1000.verify(1);
result.verified ? result.derivedAddress : result.error;
```

Direct hex keys, decrypted WIFs, and complete BIP39 seed records all verify through the same call. Collection verification is asynchronous because the signing crypto loads on first use; `verifyPuzzle(puzzle)` is synchronous. A puzzle with no key material is a normal failure result, not an exception, so `--all` runs stay quiet. `hasPrivateKey()` answers from the same `secretOf()` resolver, so a seed with only a derivation path or an xpub counts as no key in both places.

### Dataset snapshot

```ts
import { dataset, dataVersion } from "@agntn/puzzles";

dataVersion(); // 12-char hash of the class data, stable across runtimes
dataset(); // { version, data_version, collections }
```

`dataVersion()` serializes the whole dataset the first time you call it, then caches. Fine once, wasteful in a loop.

## CLI

```bash
puzzles stats [--json]
puzzles collections [--json]
puzzles show b1000/90 [--json]
puzzles list [collection] [--status unsolved] [--with-pubkey] [--json]
puzzles balance b1000/71 [--api-key KEY] [--json]
puzzles verify b1000/1 | puzzles verify --all [--quiet] [--json]
puzzles export [--compact]
puzzles mcp
```

Plain output is tab-separated as `id  status  prize  address`, so `cut` and `awk` work. `verify` exits non-zero when a puzzle that has key material fails to derive its address, which makes it usable as a CI gate. Ethereum balances read `ETHERSCAN_API_KEY` unless you pass `--api-key`.

## Agent tools

MCP (`puzzles mcp`) and the Pi/OMP extensions expose the same six operations:

| Tool                  | Arguments                                     | Reaches the network |
| --------------------- | --------------------------------------------- | ------------------- |
| `puzzles_stats`       | none                                          | no                  |
| `puzzles_collections` | none                                          | no                  |
| `puzzles_show`        | `id`                                          | no                  |
| `puzzles_list`        | `collection`, `status`, `withPubkey`, `limit` | no                  |
| `puzzles_verify`      | `id`                                          | no                  |
| `puzzles_balance`     | `id`, `apiKey`                                | yes                 |

`puzzles_collections` prints the same rows as `puzzles collections` on the CLI, so an agent can discover keys without loading anything else first.

`puzzles_list` returns 50 puzzles by default, 500 at most, and the header tells you how many actually matched. Filter by collection or status before raising the limit.

## Adding a puzzle

One file per puzzle, listed in its collection:

```ts
// src/collections/zden/level-6.ts
import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { funding, p2pkh } from "../../core/parts.ts";

/** Puzzle `zden/level_6`. */
export const zdenPuzzleLevel6 = bitcoinPuzzle({
  id: "zden/level_6",
  address: p2pkh("1…", "hash160…"),
  sourceUrl: "https://crypto.haluska.sk/",
  startedAt: "2026-01-01 00:00:00",
  transactions: [funding("txid…", "2026-01-01 00:00:00", 0.5)],
});
```

Then import it in `src/collections/zden.ts` and append it to `static readonly puzzles`. Leave out every field the puzzle does not have: an absent field is how "no data" is spelled. A hint goes in as `official(text, source, confirmation(url))` or `community(…)`, with the URL it was published at and a second URL that shows the source said it, an archive capture for instance; one that holds for the whole collection goes to the collection constructor once, not into every record. `pnpm test` re-checks identifiers, key derivation, assets, hints, and the no nulls rule.

## References

- [collections.md](references/collections.md) for what sits in each collection.
- [types.md](references/types.md) for the read contract, the part constructors, and serialized shapes.

## Limitations

- Puzzle data is frozen inside the collection modules. Nothing loads it, nothing overrides it.
- Monero puzzles have neither balances nor verification. Arweave has balances but no key derivation.
- `keyRange()` needs `key.bits`, which only b1000 sets.

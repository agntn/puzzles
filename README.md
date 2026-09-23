# @agntn/puzzles

[![npm version](https://npmx.dev/api/registry/badge/version/@agntn/puzzles)](https://npmx.dev/package/@agntn/puzzles)
[![npm downloads](https://npmx.dev/api/registry/badge/downloads/@agntn/puzzles)](https://npmx.dev/package/@agntn/puzzles)
[![license](https://npmx.dev/api/registry/badge/license/@agntn/puzzles)](https://npmx.dev/package/@agntn/puzzles)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/agntn/puzzles)

349 public crypto puzzles and bounties in twenty collections, as typed records. You ask for a puzzle, you get its address, its key material and what happened on chain.

## Why?

Every puzzle thread has the same three things: the addresses, the prizes, and who solved what. Every scanner and tracker re-types them from the thread, slightly differently each time. So they live here once, as code. A puzzle is a TypeScript record. The type checker reads it before a test does. The CLI, the MCP server and the Pi and OMP extensions read one registry.

Docs, one page per puzzle and a live playground: [puzzles.agntn.dev](https://puzzles.agntn.dev).

> [!WARNING]
> Pre-1.0. The API, the CLI flags and the data model can still move. Pin an exact version if you build on it.

## ✨ Features

- 🧾 **Data as code.** One `PuzzleSpec` literal per puzzle, built by a factory for its chain. No JSON, no build step.
- 🕳️ **Absent means absent.** A puzzle without a solver or a prize has no such key. Nothing serializes as null.
- 🔑 **Key material in every shape.** Hex, WIF, a BIP38 payload, a seed phrase, secret shares, or just a bit width. One builder.
- 💤 **Lazy registry.** Importing the package loads no records. `get("b1000/71")` imports one collection module.
- ✅ **Verification is a value.** A published key derives the address or it doesn't. Nothing throws for a bad record.
- 💰 **Live balances.** `puzzle.balance()` through `@agntn/explorers`. Base units as `bigint`, API keys redacted from errors.
- 🤖 **Nine agent tools.** One executor behind MCP, Pi and OMP. Same answer everywhere.
- 🌐 **Runs anywhere.** Neutral ESM on the Fetch API. Node, browsers, edge workers.

## 📦 Install

```bash
pnpm add @agntn/puzzles
```

Node.js 24 or newer for the CLI.

## 🚀 First call

```bash
npx @agntn/puzzles stats
```

```text
Total: 349
Solved: 143
Unsolved: 95
Claimed: 12
Swept: 96
Expired: 3
With pubkey: 249
```

No key, no config, no network. The records ship inside the package. The bare `puzzles` below is `pnpm exec puzzles` after a local `pnpm add`, or just `puzzles` after `pnpm add -g @agntn/puzzles`.

```bash
puzzles show b1000/71
```

```text
b1000/71	unsolved	7.100226 BTC	1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU
```

### Commands

| Command                     | What it prints                                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `puzzles stats`             | Totals and status counts. `--json` adds the prize sums                                                                  |
| `puzzles collections`       | One row per collection: key, counts, author                                                                             |
| `puzzles authors [key]`     | One row per author, or one author's record with its sourced facts                                                       |
| `puzzles show <id>`         | One puzzle. `--json` for the whole record                                                                               |
| `puzzles hints <id>`        | The collection's hints, the puzzle's own, then its hint files. `--json` for both                                        |
| `puzzles list [collection]` | One puzzle per line. `--address`, `--chain`, `--status` and `--with-pubkey` narrow it, `--limit` and `--offset` page it |
| `puzzles verify [id]`       | A published key against its address. `--all` for every puzzle, exit 1 on a mismatch                                     |
| `puzzles balance <id>`      | The live balance. `--api-key` or `ETHERSCAN_API_KEY` for Ethereum                                                       |
| `puzzles export`            | The whole dataset with its `data_version`                                                                               |
| `puzzles mcp`               | The MCP server over stdio                                                                                               |

`--json` is the same serializer everywhere, `bigint` as strings and absent fields left out. The flags and exit codes are in the [CLI guide](https://puzzles.agntn.dev/guide/cli).

## 🧠 Library

```ts
import { get, stats, verifyPuzzle } from "@agntn/puzzles";
import { b1000 } from "@agntn/puzzles/collections/b1000";

const puzzle = await get("b1000/71"); // loads the b1000 collection, nothing else
puzzle?.address().value; // "1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU"
puzzle?.keyRange(); // [2n ** 70n, 2n ** 71n - 1n]

verifyPuzzle(b1000.require(1)).verified; // true, key 1 derives its address
(await stats()).unsolved; // 95
(await b1000.require(71).balance()).totalUnits(); // 7.10190014 when I ran it, mempool.space decides
```

That's most of it, really. A collection is its own entry and everything on it is synchronous. The views that span collections await a load. Errors descend from `PuzzlesError`, balances have their own family under `BalanceError`. The rest is in the guides: [records](https://puzzles.agntn.dev/guide/records), [registry](https://puzzles.agntn.dev/guide/registry), [lookups](https://puzzles.agntn.dev/guide/lookups), [verification](https://puzzles.agntn.dev/guide/verification), [balances](https://puzzles.agntn.dev/guide/balances).

## 🗺️ Collections

| Key                     | Puzzles | Chains                              | What it is                              |
| ----------------------- | ------: | ----------------------------------- | --------------------------------------- |
| `b1000`                 |     256 | bitcoin                             | Keys of 1 to 256 bits, one address each |
| `rushwallet`            |      30 | bitcoin                             | Brainwallets from a 2014 contest        |
| `zden`                  |      16 | bitcoin, ethereum, litecoin, decred | Zden's visual puzzles                   |
| `arweave`               |      12 | arweave, ethereum                   | Tiamat's weave puzzles                  |
| `warp`                  |       6 | bitcoin                             | Keybase's scrypt brainwallet challenges |
| `hash_collision`        |       6 | bitcoin                             | Peter Todd's P2SH collision bounties    |
| `quizchain`             |       4 | bitcoin                             | Quiz blocks chained by their keys       |
| `ballet`                |       3 | bitcoin                             | BIP38 keys printed on physical wallets  |
| `dug`                   |       3 | bitcoin                             | 2025 student seed hunt                  |
| `bitimage`              |       2 | bitcoin                             | Seeds hashed from photographs           |
| `luckylurker`           |       2 | bitcoin                             | Two Bitcoin Vault seed challenges       |
| `bitaps`                |       1 | bitcoin                             | A 3 of 5 secret sharing scheme          |
| `gsmg`                  |       1 | bitcoin                             | A multi phase image puzzle              |
| `movie_enigma`          |       1 | bitcoin                             | Film titles as seed words, solved 2026  |
| `ledger_donjon`         |       1 | bitcoin                             | Scissors Secret Sharing from the CTF    |
| `coin_artist`           |       1 | bitcoin                             | TORCHED H34R7S painting                 |
| `genesis`               |       1 | bitcoin                             | Genesis block OP_RETURN puzzle          |
| `mineshop`              |       1 | ethereum                            | A seed split between a video and a post |
| `satoshi_birthday_quiz` |       1 | bitcoin                             | Seven quiz answers hashed into a wallet |
| `book_quiz`             |       1 | bitcoin                             | A book quiz nobody won in time          |

Identifiers are `collection/name`. The six singletons, `gsmg`, `bitaps`, `mineshop`, `movie_enigma`, `satoshi_birthday_quiz` and `book_quiz`, are just the key. Each collection has a page with the story, the quirks and every puzzle: [puzzles.agntn.dev/collections](https://puzzles.agntn.dev/collections).

## 🤖 Agents

```bash
claude mcp add puzzles --scope user -- npx -y @agntn/puzzles mcp
pi install npm:@agntn/puzzles
```

```json
{
  "mcpServers": {
    "puzzles": { "command": "npx", "args": ["-y", "@agntn/puzzles", "mcp"] }
  }
}
```

Nine tools: `puzzles_stats`, `puzzles_collections`, `puzzles_authors`, `puzzles_author`, `puzzles_show`, `puzzles_hints`, `puzzles_list`, `puzzles_verify` and `puzzles_balance`. Only the last one leaves the process, and its annotations say so. What the text carries and where the limits live: the [agents guide](https://puzzles.agntn.dev/guide/agents).

## 🚫 What this does not do

It doesn't solve anything. No scanner, no kangaroo, no brainwallet cracker, and no guessing a status from a transaction list. `solved`, `swept`, `claimed` and `expired` are written down by hand, because a claim transaction plus a published key still means solved. Chain facts come from `@agntn/chains`, key derivation from `@agntn/keys` and balances from `@agntn/explorers`. This package doesn't reimplement any of them.

## 🧩 Adding a puzzle

One record file under `src/collections/<key>/` and one line in the collection module. Then `pnpm test` runs the data gate: unique ids, address and txid formats, key derivation, BIP38 payloads, asset paths, no nulls. The shape of a record is in [Puzzle records](https://puzzles.agntn.dev/guide/records) and the rules in [CONTRIBUTING.md](./CONTRIBUTING.md).

## 🛠️ Development

```bash
pnpm install
pnpm --dir docs install   # the docs site; lint and test read the Nuxt types it generates
pnpm lint         # vp lint and vp fmt, docs included
pnpm typecheck    # builds first, then checks src, Pi and OMP
pnpm test         # unit tests and the data gate
pnpm test:packed  # packs the tarball and runs every published entry without src/
pnpm docs         # the Docus site on localhost
```

## 💛 Thanks

This package exists thanks to the open source programs at Anthropic and OpenAI: [Claude for Open Source](https://claude.com/contact-sales/claude-for-oss) and [Codex for Open Source](https://developers.openai.com/community/codex-for-oss).

## 📄 License

[MIT](./LICENSE)

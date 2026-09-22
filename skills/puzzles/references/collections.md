# Collections

Counts come from the records. Run `puzzles collections` after a data change instead of trusting the numbers below.

## b1000

[Bitcoin Puzzle Transaction](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx), 256 puzzles. Puzzle N holds its private key in `[2^(N-1), 2^N - 1]`, which is the entire reason anyone brute-forces this collection. Unsolved puzzles above 130 expose public keys at every fifth index, so they are the interesting targets.

```ts
import { b1000 } from "@agntn/puzzles/collections/b1000";

const puzzle = b1000.require(66); // number or string
const [low, high] = puzzle.keyRange() ?? [];
```

## arweave

Tiamat's Arweave bounties from chronobot.io, 12 puzzles. Balances resolve through arweave.net. Key derivation does not work on this chain, so `verify()` returns a failure value rather than a match.

```ts
arweave.require("weave1");
```

## ballet

Bobby Lee's Ballet Crypto puzzles, 3 physical Bitcoin notes with BIP38-encrypted keys. The passphrase is the puzzle.

```ts
ballet.require("AA007448");
```

## bitaps

One Shamir secret sharing puzzle, 3 of 5 threshold with 2 shares published. Two more shares to go.

```ts
bitaps.require();
```

## bitimage

Keys derived from files with `SHA256(Base64(file))` as BIP39 entropy. Two puzzles: `kitten` is solved, `kitten_passphrase` still needs a passphrase nobody has.

```ts
bitimage.require("kitten");
```

## book_quiz

AoiNakamoto's follow-up to the birthday quiz, posted to r/YangForPresidentHQ the next day. Same recipe, seven answer sentences hashed into BIP39 entropy, but four of the seven questions had no objective answer and the window was one hour. Nobody made it, and the author moved the 7,000,000 satoshis back out. Status `expired`, and the answer key published afterwards is on the first hint.

```ts
bookQuiz.require().key()?.data().seed?.entropy?.hash;
```

## coin_artist

TORCHED H34R7S, the last painting of coin_artist's _The Legend of Satoshi Nakamoto_, made with Rhea Myers. The key to `1FLAMEN6rq2BqMnkUmsJBqCGWdwgVKcegd` was drawn into the flames as binary and XORed with the ribbon mask. Solved, and the wallet was emptied in February 2018. The published key only matches the address with an uncompressed public key, which the record stores.

```ts
coinArtist.require("torched-h34r7s").pubkey()?.format; // "uncompressed"
```

## dug

Dug's 2025 Student Treasure Hunt, three Bitcoin prizes on one seed. Twelve words sat in lecture slides, and a Nostr post by the author gave away the last one, `kingdom`. The published BIP39 phrase has an empty passphrase and derives all three at `m/84'/0'/0'/0/0` through `/2`, so stopping at index 0 leaves two unchecked. All three are solved and verify.

```ts
dug.require("2025-1").key()?.data().seed?.path; // "m/84'/0'/0'/0/1"
```

## genesis

The Genesis Block Wallet Puzzle, announced in an `OP_RETURN` in August 2026 and still unsolved. The target is a P2WSH address, 2-of-2 multisig by the author's replies, both keys from the same field of Bitcoin's first block. The record holds nineteen `OP_RETURN` messages as hints. They are the author's claims, not a verified recipe, and the record has no witness script or pubkeys.

```ts
genesis.hintsFor("block"); // the nineteen messages, oldest first
```

## gsmg

GSMG.IO multi-phase challenge, one puzzle. The prize halves at every Bitcoin halving, so it shrinks while you think.

```ts
gsmg.require();
```

## hash_collision

Peter Todd's P2SH hash-collision bounties: `sha1`, `sha256`, `ripemd160`, `hash160`, `hash256`, `op_abs`. SHA-1 fell in 2017. The `peter_todd` alias still works.

```ts
hashCollision.require("sha256");
await get("peter_todd/sha256"); // the registry lookup is async
```

## ledger_donjon

Ledger Donjon's Capture the Fortress CTF. Scissors Secret Sharing is solved, with the published BIP39 phrase and BIP44 path. It awarded 100 CTF points, not a BTC bounty, so the record leaves `prize` absent.

```ts
ledgerDonjon.require("scissors_secret_sharing");
```

## luckylurker

Paul Jones's two Bitcoin Vaults. `vault_1` is solved with the published Electrum SegWit seed at `m/0'/0/1`; its record stores the derived private key and keeps the twelve clues separate from their published answers. `vault_2` has a 1 BTC funding transaction; public hints are scheduled from October 12, 2026.

```ts
import { luckyLurker } from "@agntn/puzzles/collections/luckylurker";

luckyLurker.require("vault_2");
```

## mineshop

Guntis Vitolins's 10 ETH challenge from February 2020. Six of the twelve seed words hide in a YouTube video, six in the blog post it links to. The author still spends from the wallet, so the balance falls without anyone solving it: 8.61 ETH left of the original 10.

```ts
mineshop.require();
```

## movie_enigma

Bitcoin Movie Enigma, one puzzle by klems: 34 film stills, each title turned into a BIP39 word, ten intruders to drop. Solved in 2026. The 24-word phrase fails the BIP39 checksum and still derives the address, and `verify()` confirms it.

```ts
movieEnigma.require();
```

## quizchain

AoiNakamoto's numbered quiz blocks on r/bitcoinpuzzles, addressed by block number like `b1000`. Block 1 hashed one multiple-choice answer plus the last three characters of the author's favorite address into BIP39 entropy. The post gave the funding txid, not the address, and the author published the SHA-256 and the WIF in the comments, so the key is a WIF with the entropy hash beside it and no seed phrase.

```ts
quizchain.require(1).key()?.data().seed?.entropy?.hash;
```

## rushwallet

Dmitri Kryptokov and KryptoKit's RushWallet brainwallet contest from September 2014. 30 P2PKH targets derived as `sha256(passphrase)` into an uncompressed key. 28 passphrases came back out of contest videos, OCR, morse audio, and social clue carriers. #26 is claimed on-chain with the passphrase still unknown, #30 is untouched. All 30 contest UTXOs were funded by `1GShq18eb4V6uBtqgwxkmuPTUHCtyBcNYA`.

```ts
rushwallet.require("9").key()?.data().wif?.passphrase;
```

## satoshi_birthday_quiz

AoiNakamoto's giveaway for Satoshi's birthday, April 5, 2019. Seven multiple-choice questions about Bitcoin history; the correct answer sentences joined by single spaces, hashed with SHA-256, and fed to iancoleman.io/bip39 as entropy. The prize sat at the first address of that wallet, `m/44'/0'/0'/0/0`, and was swept five hours later. The author published the answer key in the thread, so `verify()` derives the address from the record's seed.

```ts
satoshiBirthdayQuiz.require().key()?.data().seed?.entropy?.hash;
```

## warp

Keybase WarpWallet challenges, 6 puzzles. Four solved, two expired and later reclaimed by Keybase.

```ts
warp.require("challenge_1");
```

## zden

Visual crypto puzzles by Zden, 16 across Bitcoin, Ethereum, Litecoin, and Decred. Keys hide in images, animations, and visual patterns, so the asset matters as much as the record. Seven solved ones also ship the solution image from his page.

```ts
zden.require("level_4").assetUrl(); // raw asset URL
```

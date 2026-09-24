---
title: Zden's puzzles
icon: i-lucide-image
description: Sixteen visual puzzles by Zden on Bitcoin and Ethereum and Litecoin and Decred. Every one ships its image. Fourteen solved and level 5 claimed in September 2026.
---

::collection-facts{collection="zden"}
::

## The puzzle

Zden publishes images with a key hidden in them, on [crypto.haluska.sk](https://crypto.haluska.sk/). Most levels are a single image. Autonomy combines images and animation across several stages. The prize sits on the address. The solver posts the key. The series moved across four chains, so this is the one collection that uses every chain factory except Arweave's and Monero's. `zden/decred_janus` paid 460 DCR, `zden/litecoin_segwit` 230 LTC, `zden/xixoio` 6 ETH.

## What the records carry

Every Zden record has an `assets({ puzzle })` entry pointing at the image under `assets/zden/` in the repository, so `assetPath()` and `assetUrl()` answer for all sixteen. Fourteen carry the public key, six carry the private key. A `solved` status doesn't mean the record has enough key material for `verify`; without it, verification answers `unavailable`.

`zden/decred_autonomy` was left out because the live catalog didn't show an address. The [original page's archived HTML](https://web.archive.org/web/20170430210807/https://decred.org/autonomy_puzzle/) links `DseEpHK49hHrTJhxwop3B86K1dryv4CYz8N` below its reward counter, so there's no need for a special addressless record. [Scott Burke's account for BlockCrushr Labs](https://medium.com/blockcrushr-labs/solving-decreds-autonomy-puzzle-aedac18f18f3) dates the launch to 25 April 2017 and documents their solution. The record ships Zden's [gate render](https://crypto.haluska.sk/gate_full.jpg), not the entire interactive puzzle. It leaves the exact solve time, final prize and claim transaction unset rather than guessing from the address history. The article's publication date isn't a solve date.

Seven of those solved records also ship the solution image he posted next to the puzzle. Levels 1, 2, 3, SFX, XM17, Nethemba and XIXOIO. The page linked them. The records didn't. `assets({ solution })` is the same field Movie Enigma already used, and `puzzles_show` prints it as `solution asset:`.

```ts
assets: assets({
  puzzle: "level_1/puzzle.png",
  solution: "level_1/solver.png",
  sourceUrl: "https://crypto.haluska.sk/crypto1.png",
}),
```

The hints Zden published are on the records too, in the shape they came in. Codex Protocol got two more renderings, Litecoin SegWit three SVG drawings and Decred Janus a stripped down tree, so those three list the files under `assets({ hints })` and `puzzles_show` prints them as `hint assets:`. The Janus file also comments `33*bbb`. That's the hint, so the record carries it as `official(…)` with a 2018 Wayback capture of the SVG. Demobit and XIXOIO were hinted on Twitter, so those two carry `official(…)` entries with the tweet as the source and a Wayback capture behind it. `puzzles_hints` answers the text ones. The image ones are files, and `assetLinks()` is where a script picks them up.

```ts [src/collections/zden/decred_janus.ts]
export const zdenPuzzleDecredJanus = decredPuzzle({
  id: "zden/decred_janus",
  address: p2pkh("DsRaAja82UvgnqYaBHYFuyCKURFX2rCyEJ8"),
  sourceUrl: "https://crypto.haluska.sk/decred_tree.svg",
  startedAt: "2017-03-07 04:20:56",
  status: Status.Solved,
  pubkey: compressed("02278753666ec31c29b755a39421017bd80744d728204da0f7ff452846112b618b"),
  prize: 460,
  solvedAt: "2017-03-18 13:51:29",
  transactions: [
    funding("900e…05f2", "2017-03-07 04:20:56", 100),
    increase("47c3…60c2", "2017-03-07 04:31:20", 100),
    increase("f968…6581", "2017-03-07 04:48:32", 100),
    increase("2a06…e90e", "2017-03-07 20:38:42", 150),
    increase("327a…4b13", "2017-03-07 20:55:54", 5),
    increase("77f5…4719", "2017-03-07 21:00:08", 5),
    claim("2af4…5467", "2017-03-18 13:51:29", 460),
  ],
  assets: assets({ puzzle: "decred_janus/puzzle.svg", hints: ["decred_janus/hint.svg"] }),
  hints: [
    official(
      "33*bbb",
      "https://crypto.haluska.sk/decred_tree_hint.svg",
      confirmation(
        "https://web.archive.org/web/20181219152809/http://crypto.haluska.sk/decred_tree_hint.svg",
        "Wayback capture of the hint SVG",
      ),
    ),
  ],
});
```

`prize: 460` is in DCR because the factory is `decredPuzzle` and `prizeCurrency()` reads the chain's symbol from `@agntn/chains`. A `currency` field is only written when the prize isn't the native token.

The 777 sat tx on `zden/1bitcoin_white_paper` isn't the claim. It pays the notarization address and sends change back. The actual sweep lands four days later. His page says the image's SHA-256 is that wallet's private key, so the record quotes that as `official(…)`. The puzzle wallet key is a different one: JTobcat, Ziot and Motive printed it in their writeup, and the record stores that hex and WIF.

## Status

One puzzle is still open: `zden/level_halv`, the halving puzzle from April 2024. The only thing the author said about it, that it is way easier than level 5, is on the record. Level 5 itself is `claimed`, the story is below. The rest is solved. Want to see what a solved multi chain record looks like? This is the collection.

## Level 5, claimed after eight years

`zden/level_5` was the longest wait in this collection. Zden funded `1cryptoGeCRiTzVgxBQcKFFjSVydN1GW7` on 20 October 2018 and topped it up three times to 0.0055555 BTC. On 12 December 2021 Zden relaunched it with a corrected image and new hints, because the 2018 release was, in Zden's own words, incomplete. The record quotes that statement and the 2018 hint tweet, so `puzzles_hints` on `zden/level_5` says which image the winner had to work from.

On 22 September 2026 at 18:34:35 UTC, in block 968171, all four outputs left in one transaction, [`e254…8e8e`](https://blockstream.info/tx/e2544433184d0fe4157ca10a8e1ce753bb52a7b0bbcf833740d7448ed25e8e8e): 0.00551745 BTC after a 3,805 sat fee, to `bc1qw50q83k7psugw5z5548kwnxqqjxjxvx2pkvz0s`, an address with no earlier history. Spending a P2PKH output puts the public key on chain. This one is uncompressed, and it's on the record now.

That's everything the chain says. As of 23 September 2026 nobody has posted the key or a writeup, and Zden's page still lists the level as unsolved. So the record says `claimed`, not `solved`: the prize is gone, the solution isn't public, and a fresh address names nobody as the solver.

```ts [src/collections/zden/level-5.ts]
status: Status.Claimed,
pubkey: uncompressed("0488d3d2…ccbb9a"),
solvedAt: "2026-09-22 18:34:35",
// …
claim("e254…8e8e", "2026-09-22 18:34:35", 0.00551745),
```

Looking for the solution? It isn't out there yet. The image, the hints and the relaunch statement are on the [puzzle page](/collections/zden/level_5). Once the winner or Zden publishes the key, the record moves to `solved` with the key and the name.

## Every puzzle

One page each: the record, the transactions and the live balance.

::collection-puzzles{collection="zden"}
::

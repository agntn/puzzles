# Dug's Student Treasure Hunt, 2025 edition

The `dug` collection contains three puzzles, one per funded address.
Each record has its own BIP84 path, prize, funding transaction and claim.
They share a published seed and the author's final-word hint.

## Published solution

[Dug's signed Nostr post][slide] on 2025-10-07 includes a [lecture slide][image]
with `12. Kingdom`. That direct post is the official hint source.
According to [floflo777's recovery account][source], a public Seed Cipher sheet
encoded the same phrase and made recovery possible without the private lecture slides.

The published mnemonic is:

```text
profit general lava hover jar visa joy immense install first give kingdom
```

The wallet uses BIP84, an empty passphrase and `m/84'/0'/0'/0/i`.
Each record keeps the seed with its address index. Its public key also appears
in the corresponding claim transaction's witness.

## Address ledger

| Puzzle       | Address                                      | Prize (satoshis) | Claimed (UTC)       |
| ------------ | -------------------------------------------- | ---------------: | ------------------- |
| `dug/2025-0` | `bc1qych2me6h85j38s3xmfwdkcvpqakpld3yr2y5ss` |           75,082 | 2026-07-08 14:43:50 |
| `dug/2025-1` | `bc1qphfklk568cf93267yetpngqsz0mthw4z4x2q69` |           63,216 | 2026-08-02 12:12:29 |
| `dug/2025-2` | `bc1qnclravnmv7vta9fhnp44hu3y85z3tfgz0n33wl` |           20,888 | 2026-07-08 14:43:50 |

The collection's prize total is **159,186 satoshis**, not the 63,216 satoshis
in the source's title. Each record starts at its address's funding block time.
Index 0 was funded on 2025-06-26. Indices 1 and 2 were funded on 2026-06-26.

[The earlier claim][earlier] spends 95,970 satoshis from indices 0 and 2.
It pays 95,792 satoshis after a 178 satoshi fee. The write-up doesn't identify
that claimant, so neither record assigns a solver.

[The index-1 claim][claim] spends 63,216 satoshis and pays 59,916 satoshis after
a 3,300 satoshi fee. Its solver is [floflo777](https://github.com/floflo777),
also [0xFlorent_ on Twitter](https://twitter.com/0xFlorent_). The attribution
comes from their recovery account, not from the transaction alone.

A record's claim amount is the input spent from **that target address**.
The shared transaction doesn't become two 95,792 satoshi payouts, and its fee
isn't arbitrarily divided between indices 0 and 2.

## Sources and limits

- [Recovery account and address ledger][source].
- [Dug's final-word post][slide] and [its attached image][image].
- Both claim transactions above confirm the spent inputs and output amounts.

The source mentions annual hunts since 2023, but doesn't supply target addresses
or solutions for 2023 and 2024. Those editions aren't included.
Its cipher publication dates also conflict: the introduction says December 2025,
while its author-post transcription dates the sheet to 2026-02-12. No cipher
publication date is asserted here.

[source]: https://github.com/floflo777/open-crypto-puzzles/tree/main/4-solved/dug-student-treasure-hunt-63ksats
[slide]: https://njump.me/note157473tjlhl8046c4uhxk6889nwgflwsjtlpwgzfuqp0lmq8vvzas0km4hc
[image]: https://blossom.primal.net/394004c70b8907504a2424865e866b10fe5746c89122899a968f3dbcd18ad6b3.jpg
[earlier]: https://mempool.space/tx/bcc2154f4eb33c361973313b9fe81131568b2f4ee3ef5a2c3e98dc327afd8074
[claim]: https://mempool.space/tx/ee70de514686588173b64fc31fc317ae15f1e903c742cc99140d2cf1bb2e8db1

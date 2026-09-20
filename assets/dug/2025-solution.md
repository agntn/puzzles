# Dug's 2025 Bitcoin treasure hunt: seed and claim ledger

Three addresses, one published seed, two claim transactions. The `dug` collection
covers all three targets, worth **159,186 satoshis** in total. The 63,216 sats in
[floflo777's write-up][source] was the prize he recovered, not the whole pot.

## The BIP39 seed behind all three addresses

[Dug's October 7, 2025 Nostr post][slide] includes a [lecture slide][image]
with `12. Kingdom`. According to the recovery account, a public Seed Cipher
sheet supplied a route to the full phrase without access to the private lectures:

```text
profit general lava hover jar visa joy immense install first give kingdom
```

Use BIP84 with an **empty passphrase** and `m/84'/0'/0'/0/i`, where `i` is 0,
1 or 2. All three paths reproduce the addresses below. The public keys also
match those exposed in the claim transactions.

This seed is public. Use it to check the solution, not to store money.

## Bitcoin addresses and claim dates

| Puzzle       | Address                                      | Prize (satoshis) | Claimed (UTC)       |
| ------------ | -------------------------------------------- | ---------------: | ------------------- |
| `dug/2025-0` | `bc1qych2me6h85j38s3xmfwdkcvpqakpld3yr2y5ss` |           75,082 | 2026-07-08 14:43:50 |
| `dug/2025-1` | `bc1qphfklk568cf93267yetpngqsz0mthw4z4x2q69` |           63,216 | 2026-08-02 12:12:29 |
| `dug/2025-2` | `bc1qnclravnmv7vta9fhnp44hu3y85z3tfgz0n33wl` |           20,888 | 2026-07-08 14:43:50 |

Index 0 was funded on June 26, 2025. Indices 1 and 2 followed on June 26, 2026.
Each record's start date is its own funding block timestamp.

## Who claimed what, and where did the fees go?

The arithmetic is less mysterious than the cipher.

[The July 8 transaction][earlier] spends **95,970 sats** from indices 0 and 2.
It pays **95,792 sats**, with **178 sats** going to fees. The recovery account
doesn't identify that claimant, so those two records leave the solver field empty.

[The August 2 transaction][claim] spends **63,216 sats** from index 1.
It pays **59,916 sats**, with a **3,300 sat fee**. [floflo777][solver], also
[0xFlorent_ on Twitter][twitter], describes this recovery in his write-up.
That's the source of his solver credit. A transaction alone doesn't identify a person.

The claim amount in each puzzle record is the input spent from **that address**.
For the shared July transaction, that's 75,082 sats on index 0 and 20,888 sats on
index 2. Neither record claims the entire joint payout, and the fee isn't split
between them by guesswork.

## Sources and the disputed Seed Cipher date

- [Dug's signed Nostr post][slide] and [attached slide][image] are the official clue.
- [floflo777's recovery account][source] supplies the seed and solver attribution.
- [July 8 claim][earlier] and [August 2 claim][claim] confirm the inputs and payouts.

The source mentions annual hunts since 2023, but doesn't give targets or solutions
for the 2023 and 2024 editions. Those aren't included here.

There's also a date mismatch in the source: its introduction says the Seed Cipher
appeared in December 2025, while its author-post transcription says February 12, 2026. Neither date is needed to verify the published seed. The exact cipher
publication date remains unconfirmed.

[source]: https://github.com/floflo777/open-crypto-puzzles/tree/main/4-solved/dug-student-treasure-hunt-63ksats
[slide]: https://njump.me/note157473tjlhl8046c4uhxk6889nwgflwsjtlpwgzfuqp0lmq8vvzas0km4hc
[image]: https://blossom.primal.net/394004c70b8907504a2424865e866b10fe5746c89122899a968f3dbcd18ad6b3.jpg
[earlier]: https://mempool.space/tx/bcc2154f4eb33c361973313b9fe81131568b2f4ee3ef5a2c3e98dc327afd8074
[claim]: https://mempool.space/tx/ee70de514686588173b64fc31fc317ae15f1e903c742cc99140d2cf1bb2e8db1
[solver]: https://github.com/floflo777
[twitter]: https://twitter.com/0xFlorent_

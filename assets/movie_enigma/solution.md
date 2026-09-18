# Bitcoin Movie Enigma, the solve

rabbidbird announced the solve and the payout in [floflo777/open-crypto-puzzles#24](https://github.com/floflo777/open-crypto-puzzles/issues/24) on 2026-09-08, twelve minutes after the claim confirmed in block 965998, and moved the puzzle to that repository's solved tier in [PR #25](https://github.com/floflo777/open-crypto-puzzles/pull/25). What follows is that announcement, quoted where the wording matters.

> The Bitcoin Movie Enigma prize is solved and claimed. The payout confirmed in block 965998 (2026-09-08 UTC / 2026-09-07 America/New_York).

The ten intruders are panels 1, 3, 8, 12, 14, 19, 21, 26, 32 and 34. Each of five thematic groups has two outliers: Kubrick films, 1979 releases, Jean Reno appearances, films of at least two hours, and second installments. The Kubrick films belong in the answer, they are not themselves intruders.

For each retained title, drop a leading A or The and expand its opening prefix to the English BIP39 word: four letters where a matching prefix exists, otherwise the unique three-letter prefix. In panel order:

```text
path mad alien apology escape spare miss goddess leopard crime visit clock start first blade guard close barrel term screen matrix toy ghost shine
```

> The significant oracle bug: this phrase has an invalid BIP39 checksum. Its encoded checksum byte is 47, but its entropy requires 119. It still produces the exact escrow address using PBKDF2-HMAC-SHA512, 2048 rounds, salt `mnemonic`, an empty passphrase, then BIP84 m/84'/0'/0'/0/0. Do not repair the last word.

The claim's witness spends with the same public key, `022c17f7486b4107b42a243a62e4d0919af3e8ee858a272319bffb0536486b9405`, which is why every search that filtered candidates on the checksum discarded the answer. The full title to word table for the 24 panels is in [4-solved/bitcoin-movie-enigma-100ksats](https://github.com/floflo777/open-crypto-puzzles/tree/main/4-solved/bitcoin-movie-enigma-100ksats) of the same repository.

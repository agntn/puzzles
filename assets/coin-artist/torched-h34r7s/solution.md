# TORCHED H34R7S

coin_artist painted the final stage of _The Legend of Satoshi Nakamoto_. Rhea Myers helped encode the wallet key. The [forum announcement](https://bitcointalk.org/index.php?topic=766000.msg8633825#msg8633825) links the painting's public release on April 3, 2015 and identifies the target as `1FLAMEN6rq2BqMnkUmsJBqCGWdwgVKcegd`. The thread started in 2014, but that isn't the release date of this final painting.

## Preserved image

`puzzle.jpg` is the unmodified 2160 x 1658 JPEG from [ynohtna92's public mirror](https://raw.githubusercontent.com/ynohtna92/1FLAMEN6/64f6eff0cb6541f7a4209fc567a37dce33cb9039/The%20Legend%20of%20Satoshi%20Nakamoto.jpg), pinned to commit `64f6eff0cb6541f7a4209fc567a37dce33cb9039`. SHA-256: `9653ff4d7131db16186d004e90e6f1f7231e4b33a408aa962e6803a5ab1f662f`. It shows birds above a chessboard, a ribboned key at the lower right and coloured flames around the border. Artwork attribution remains with coin-artist.

## Published solution

[Motherboard's account](https://www.vice.com/en/article/heres-the-solution-to-the-3-year-old-dollar50000-bitcoin-puzzle/) describes the solution with confirmation from the creators. Each flame encodes four bits through its height, border colour, width and interior colour. The inner flames are read clockwise, then the outer flames counterclockwise. The ribbons around the painted key encode `011010`, which is repeated for XOR decoding. The result contains a phrase referring to Shakespeare's _The Phoenix and the Turtle_ and a wallet key.

The [public key listing](https://privatekeys.pw/puzzles/1flamen6-puzzle) gives this private scalar:

```text
ac928bf050d1292b8a3a1ef1139fd1e74cefc50005f29720d6bf309169537452
```

It derives the target with an **uncompressed** public key. Compressed serialization gives a different address. The record's public key also appears in the input scripts of the claim transaction, so this isn't just a match between two secondary sources.

## Claim evidence

[Transaction cb0156fa](https://blockstream.info/tx/cb0156faa1716186b96f7e668a59204061a3419a746810ce151052d2860ac7cf) was confirmed in block 507114 on February 1, 2018 at 15:09:42 UTC. Its ten inputs spend 5.001337 BTC from the puzzle address. The single output sends 4.99676152 BTC to `15x25pXex9ZFUr4kAkTL9ayPCap7VLW8Vx`, with a 0.00457548 BTC fee.

The record keeps the announcement's 4.87 BTC prize separate from the claim amount: 5.001337 BTC spent from the target before fees, not the 4.99676152 BTC payout. Later deposits and sweeps aren't part of the original claim. `solvedAt` records the claim's block time, not the moment the solver decoded the painting. No precise solve duration is recorded because the release date is only known to the day here.

The solver is called "Isaac" in the article, explicitly a pseudonym chosen by the publication. The record leaves solver identity unset.

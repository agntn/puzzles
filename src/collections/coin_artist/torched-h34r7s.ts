import { assets, claim, hex, p2pkh, uncompressed } from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** TORCHED H34R7S, the final painting in The Legend of Satoshi Nakamoto. */
export const torchedH34r7s = bitcoinPuzzle({
  id: "coin_artist/torched-h34r7s",
  address: p2pkh("1FLAMEN6rq2BqMnkUmsJBqCGWdwgVKcegd", "9d3177de11e79cdfdc2f0c55aa4824d24a0c9184"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=766000.msg8633825#msg8633825",
  startedAt: "2015-04-03",
  status: Status.Solved,
  pubkey: uncompressed(
    "04af0f6203b43276804c2cbbda0d10c797e61805b56e7abb5dd0cd90f69113dc1bbbaa4bae9c7eee1fde4cab190d54a0da60bca489702a8f7daa895fcaebd2b136",
  ),
  key: hex("ac928bf050d1292b8a3a1ef1139fd1e74cefc50005f29720d6bf309169537452"),
  prize: 4.87,
  solvedAt: "2018-02-01 15:09:42",
  transactions: [
    claim(
      "cb0156faa1716186b96f7e668a59204061a3419a746810ce151052d2860ac7cf",
      "2018-02-01 15:09:42",
      5.001337,
    ),
  ],
  assets: assets({
    puzzle: "torched-h34r7s/puzzle.jpg",
    solution: "torched-h34r7s/solution.md",
    sourceUrl:
      "https://raw.githubusercontent.com/ynohtna92/1FLAMEN6/64f6eff0cb6541f7a4209fc567a37dce33cb9039/The%20Legend%20of%20Satoshi%20Nakamoto.jpg",
  }),
});

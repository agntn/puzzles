import { assets, claim, digest, hex, technique, uncompressed } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Motherboard's account of the solution, with the creators confirming the decoding. */
const SOLUTION =
  "https://www.vice.com/en/article/heres-the-solution-to-the-3-year-old-dollar50000-bitcoin-puzzle/";

/** TORCHED H34R7S, the final painting in The Legend of Satoshi Nakamoto. */
export const torchedH34r7s = puzzle({
  id: "coin-artist/torched-h34r7s",
  chain: "bitcoin",
  address: "1FLAMEN6rq2BqMnkUmsJBqCGWdwgVKcegd",
  sourceUrl: "https://bitcointalk.org/index.php?topic=766000.msg8633825#msg8633825",
  startedAt: "2015-04-03",
  status: Status.Solved,
  pubkey: uncompressed(
    "04af0f6203b43276804c2cbbda0d10c797e61805b56e7abb5dd0cd90f69113dc1bbbaa4bae9c7eee1fde4cab190d54a0da60bca489702a8f7daa895fcaebd2b136",
  ),
  key: hex("ac928bf050d1292b8a3a1ef1139fd1e74cefc50005f29720d6bf309169537452"),
  techniques: [technique("steganography", SOLUTION), technique("xor", SOLUTION)],
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
    digests: [
      digest(
        "torched-h34r7s/puzzle.jpg",
        "9653ff4d7131db16186d004e90e6f1f7231e4b33a408aa962e6803a5ab1f662f",
        1040730,
        {
          url: "https://raw.githubusercontent.com/ynohtna92/1FLAMEN6/64f6eff0cb6541f7a4209fc567a37dce33cb9039/The%20Legend%20of%20Satoshi%20Nakamoto.jpg",
          archive:
            "https://web.archive.org/web/20260926203254id_/https://raw.githubusercontent.com/ynohtna92/1FLAMEN6/64f6eff0cb6541f7a4209fc567a37dce33cb9039/The%20Legend%20of%20Satoshi%20Nakamoto.jpg",
        },
      ),
      digest(
        "torched-h34r7s/solution.md",
        "b459f84e1e67a8abe97e358c3e94964d6ca8a039cc22655f3fc8126f86044846",
        2878,
      ),
    ],
  }),
});

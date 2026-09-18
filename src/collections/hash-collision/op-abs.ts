import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, p2sh, redeemScript } from "../../core/parts.ts";

/** Puzzle `hash_collision/op_abs`. */
export const hashCollisionPuzzleOpAbs = bitcoinPuzzle({
  id: "hash_collision/op_abs",
  address: p2sh(
    "3QsT6Sast6ghfsjZ9VJj9u8jkM2qTfDgHV",
    "fe441065b6532231de2fac563152205ec4f59c74",
    redeemScript("fe441065b6532231de2fac563152205ec4f59c74", "6e879169907c9087"),
  ),
  sourceUrl: "https://bitcointalk.org/index.php?topic=293382.0",
  startedAt: "2013-09-13 04:58:06",
  status: Status.Claimed,
  prize: 0.001,
  solvedAt: "2018-05-15 00:40:36",
  solveTime: 147296550,
  transactions: [
    funding(
      "aa7768318c367b8d9b59d1529da9f6aa5eac45255f4752e01a58bdb80b4751bf",
      "2013-09-13 04:58:06",
      0.001,
    ),
    claim(
      "d48e41c95bb491f3077e27b8f3a0ebb40722381e5f6ff1a26c7c03ebf946603b",
      "2018-05-15 00:40:36",
      0.0001,
    ),
  ],
});

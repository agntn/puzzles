import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/83`. */
export const b1000Puzzle83 = bitcoinPuzzle({
  id: "b1000/83",
  address: p2pkh("14MdEb4eFcT3MVG5sPFG4jGLuHJSnt1Dk2", "24cef184714bbd030833904f5265c9c3e12a95a2"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(83),
  prize: 8.30002,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.083,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.747,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      7.47,
    ),
    increase(
      "cead5b26ed54835eeb0ac603c983a9c052512eb5d2655e6bfb60e6a8e3fb74d9",
      "2024-12-05 00:52:40",
      0.00000546,
    ),
    increase(
      "2d87bb6d81ae091a0c07a69131c404c32b68d55070d913a41263389a1f5a244b",
      "2025-10-28 12:50:52",
      0.000015,
    ),
  ],
});

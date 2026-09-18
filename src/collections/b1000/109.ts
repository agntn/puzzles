import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/109`. */
export const b1000Puzzle109 = bitcoinPuzzle({
  id: "b1000/109",
  address: p2pkh("1GvgAXVCbA8FBjXfWiAms4ytFeJcKsoyhL", "aeb0a0197442d4ade8ef41442d557b0e22b85ac0"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(109),
  prize: 10.900105,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.109,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.981,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      9.81,
    ),
    increase(
      "5478d5178f0d80ad412b5f5de7d28bb1f31ec1d0eecd0c74f4447bad6d31fc3d",
      "2025-11-21 18:58:34",
      0.000105,
    ),
  ],
});

import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/81`. */
export const b1000Puzzle81 = bitcoinPuzzle({
  id: "b1000/81",
  address: p2pkh("15qsCm78whspNQFydGJQk5rexzxTQopnHZ", "351e605fac813965951ba433b7c2956bf8ad95ce"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(81),
  prize: 8.100015,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.081,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.729,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      7.29,
    ),
    increase(
      "3f83b6358b828308e0e64bca18b727c0169636519ecb6643118c9a68d302b9e2",
      "2025-10-14 12:07:24",
      0.000015,
    ),
  ],
});

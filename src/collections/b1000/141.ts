import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/141`. */
export const b1000Puzzle141 = bitcoinPuzzle({
  id: "b1000/141",
  address: p2pkh("1CD91Vm97mLQvXhrnoMChhJx4TP9MaQkJo", "7af50f73fd580f1713af3a6f9c5de49643ec6fc6"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(141),
  prize: 14.100148,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.141,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.269,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      12.69,
    ),
    increase(
      "51fd194a442ad0955b0fc4a0f725d50c196c1b09c6c1d64699b8e48c3880a15e",
      "2024-12-11 23:00:49",
      0.00005924,
    ),
    increase(
      "1bfba1dc3d340b4c4b416f9c1e5c5df4c13324e49113624dc2639941043a8fda",
      "2024-12-12 00:52:52",
      0.00008922,
    ),
  ],
});

import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/159`. */
export const b1000Puzzle159 = bitcoinPuzzle({
  id: "b1000/159",
  address: p2pkh("14u4nA5sugaswb6SZgn5av2vuChdMnD9E5", "2ac1295b4e54b3f15bb0a99f84018d2082495645"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(159),
  prize: 15.900026,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.159,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.431,
    ),
    increase(
      "e1f668b8cc9915fcd3de6ec922acf98cdf4c14f75de9530b6ad750693d44076b",
      "2021-08-19 15:55:55",
      0.00001,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      14.31,
    ),
    increase(
      "a22040a32e5f5772ff9def5c371150e03ac4a5736bad0df527063882f03ac8cc",
      "2024-07-13 19:07:25",
      0.00001,
    ),
    increase(
      "5603c7ee6b025c823009b28e4ccb476e72eec94ef202155cfbc10f5cc94ea697",
      "2025-01-28 07:26:42",
      0.000006,
    ),
  ],
});

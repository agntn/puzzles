import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/97`. */
export const b1000Puzzle97 = bitcoinPuzzle({
  id: "b1000/97",
  address: p2pkh("18ywPwj39nGjqBrQJSzZVq2izR12MDpDr8", "578d94dc6f40fff35f91f6fba9b71c46b361dff2"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(97),
  prize: 9.700026,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.097,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.873,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      8.73,
    ),
    increase(
      "41ea4b706003301ad5481e7a15125fa056a0179aa2daf774477b4afc44415194",
      "2025-10-23 08:05:49",
      0.00002613,
    ),
  ],
});

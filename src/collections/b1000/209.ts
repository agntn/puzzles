import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/209`. */
export const b1000Puzzle209 = bitcoinPuzzle({
  id: "b1000/209",
  address: p2pkh("1JgrGoQbvJS7UnX6j4myiCxo6Q3gyo5Ujk", "c2037dcac7d46e66c4e06c289c3ccd3170438332"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0243874c891b55668295d5fb6a734fa8b9c4f73eb80cd4f3be3ed7de520e974e9f"),
  key: bits(209),
  prize: 0.209,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.209,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.209,
    ),
  ],
});

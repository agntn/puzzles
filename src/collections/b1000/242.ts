import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/242`. */
export const b1000Puzzle242 = bitcoinPuzzle({
  id: "b1000/242",
  address: p2pkh("1EMhTbC4Kp8DYBk5zoLsTqZ2YakhiTgQYh", "9283ba38d0bb048fb69d6aafc9a32b666f1c0977"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0387d4589510248cb352b5c82d7ee75454c507574cb281042eaf5dee2547abd2b2"),
  key: bits(242),
  prize: 0.242,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.242,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.242,
    ),
  ],
});

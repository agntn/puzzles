import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/193`. */
export const b1000Puzzle193 = bitcoinPuzzle({
  id: "b1000/193",
  address: p2pkh("1NHh2fQDm7KyBs8HRFkVtHgMzkmufk6mNW", "e982b609d7049607fb087a936464fe8915087aee"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02a7cbaf2cc78bf6686b7a2a2cbcd2d0ed6e03e56f481e18212508364b682ca711"),
  key: bits(193),
  prize: 0.193,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.193,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.193,
    ),
  ],
});

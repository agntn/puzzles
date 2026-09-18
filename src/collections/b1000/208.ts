import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/208`. */
export const b1000Puzzle208 = bitcoinPuzzle({
  id: "b1000/208",
  address: p2pkh("15TJ3wPvdviupvKQFm8hLeXSzeMSq7LSJ2", "30d98d22a09bf062c9b3706af3c059a72bcb7879"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03762e52fe281f880581dcd00bf80a7fd949af3439b479aba16b6fa5b04733f4b4"),
  key: bits(208),
  prize: 0.208,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.208,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.208,
    ),
  ],
});

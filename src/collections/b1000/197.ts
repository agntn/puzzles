import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/197`. */
export const b1000Puzzle197 = bitcoinPuzzle({
  id: "b1000/197",
  address: p2pkh("12gDPuHvZBh6FSjyhHhyDDkM38Y2wyDGQt", "1262b1eb58a0e55dc874e8c2d097e61194358388"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("028ab0a2c3a3413f9ea995a2bd5c7a72b79b2c6f76bf7cf49d840028a618046fd3"),
  key: bits(197),
  prize: 0.197,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.197,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.197,
    ),
  ],
});

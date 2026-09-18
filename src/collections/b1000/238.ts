import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/238`. */
export const b1000Puzzle238 = bitcoinPuzzle({
  id: "b1000/238",
  address: p2pkh("1DxBvzRMdvzop21DhnDJv4xJDYFGVtu7KZ", "8e11830db460be44112d0d0150016fed31172246"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("039a1c77eb960be561f622d14ad0de0d2660245e629c1b11033f769aec28270b77"),
  key: bits(238),
  prize: 0.238,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.238,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.238,
    ),
  ],
});

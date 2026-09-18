import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/210`. */
export const b1000Puzzle210 = bitcoinPuzzle({
  id: "b1000/210",
  address: p2pkh("14Xm5DjBUQTJCzeGhyrhVsxkK8p35srk1S", "26b9a572ce3f674c9c8d3a0f15386d6848783c25"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03628e54188ca8c8c0b73fdb12064f195417f9fd98a7b0763d83eda2518c526f44"),
  key: bits(210),
  prize: 0.21,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.21,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.21,
    ),
  ],
});

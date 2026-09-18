import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/245`. */
export const b1000Puzzle245 = bitcoinPuzzle({
  id: "b1000/245",
  address: p2pkh("1HzpmnHxpu4tCJ23ZS9TfWCoX8mXfpdHiq", "ba7199b9bcac99a8ee39e6f103ab3cb049e7dd86"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03c763aeffae32371612f8585c10710aaf7bf4a211a632c8a18b969a4f4e42db54"),
  key: bits(245),
  prize: 0.245,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.245,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.245,
    ),
  ],
});

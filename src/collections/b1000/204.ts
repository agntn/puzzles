import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/204`. */
export const b1000Puzzle204 = bitcoinPuzzle({
  id: "b1000/204",
  address: p2pkh("14CMU6qvv55Y7xJdVw64ey5yfUP4BZAjct", "230e09c32f5aa23763f8e7c770cee5b5cf4359c1"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("038e2790adcbe6d0c89c0c23763c52608ad0fe2a757e9910550f45bfb1855ad54c"),
  key: bits(204),
  prize: 0.204,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.204,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.204,
    ),
  ],
});

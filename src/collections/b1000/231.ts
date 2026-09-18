import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/231`. */
export const b1000Puzzle231 = bitcoinPuzzle({
  id: "b1000/231",
  address: p2pkh("18aBXRctVrWN9naDGhKrLdZViNfLJfCdbF", "530f6487090bda616a7846f68160ddd886fbdf24"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0378a0cae3e8275916f41b25838e45a8f4c8829c3b1b937c1b1749fd77b23177c1"),
  key: bits(231),
  prize: 0.231,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.231,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.231,
    ),
  ],
});

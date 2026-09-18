import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/235`. */
export const b1000Puzzle235 = bitcoinPuzzle({
  id: "b1000/235",
  address: p2pkh("1Pp61TfkztZ9ckpdeUVCzbyA7vMqXAVsdV", "fa3a7f736604e038a0a7fe5945a114467baba159"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02df2647ed50cded7c031a702c72b5b09209e5fd4a48c7cee7bf847f88c85bf4bd"),
  key: bits(235),
  prize: 0.235,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.235,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.235,
    ),
  ],
});

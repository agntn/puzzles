import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/256`. */
export const b1000Puzzle256 = bitcoinPuzzle({
  id: "b1000/256",
  address: p2pkh("1FMcotmnqqE5M2x9DDX3VfPAPuBWArGisa", "9d77f8bcfd56b6a095703aae85bbe003a9cff5eb"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("029125aed5e5342de7c6163a4158a716ac982ba7d2ed85835c6ff99c68702ce710"),
  key: bits(256),
  prize: 0.256,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.256,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.256,
    ),
  ],
});

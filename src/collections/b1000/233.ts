import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/233`. */
export const b1000Puzzle233 = bitcoinPuzzle({
  id: "b1000/233",
  address: p2pkh("1NnefTEeKQQAts37cQHzVx8oPrUu8LWyUK", "eefccc98b21f6748888b7b682d9f3ead55796890"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("021b6cde6068c69f1156c044dabdf4cf4bef6cc4eb020ff0dc74e03633f72403a8"),
  key: bits(233),
  prize: 0.233,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.233,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.233,
    ),
  ],
});

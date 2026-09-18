import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/200`. */
export const b1000Puzzle200 = bitcoinPuzzle({
  id: "b1000/200",
  address: p2pkh("1DEDEKJVEmXvEqwg3wbq8c1ZNobo4tNw4h", "8621202a5e010769fb0fd1a08027f41e173c3bb5"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03fe993e313ad3c5e8ae4d7e99a8cd5131ae04896270e48082d5965dba9616032d"),
  key: bits(200),
  prize: 0.2,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.2,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.2,
    ),
  ],
});

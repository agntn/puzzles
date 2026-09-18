import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/225`. */
export const b1000Puzzle225 = bitcoinPuzzle({
  id: "b1000/225",
  address: p2pkh("16YvGEYhAwjf2duwvH8jbFMfVCnY6XiQTq", "3ce1fc3304d09e7984c5766fd1134c1e8979821a"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03e1819c7597f314943bf847e6ec36c4c95ac1b3ead9948b90e9a2729357712ff7"),
  key: bits(225),
  prize: 0.225,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.225,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.225,
    ),
  ],
});

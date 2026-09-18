import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/169`. */
export const b1000Puzzle169 = bitcoinPuzzle({
  id: "b1000/169",
  address: p2pkh("1G3uazv67BcKRmPFvgvX4ijBTa2898cvCm", "a5169d8bc79e8cc94a36246de6bde7596cc9f4bb"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("026efbd90dfd84d5bfb7a8ceb2755155d1d39a16be88db336ff18a8d844a269cba"),
  key: bits(169),
  prize: 0.169,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.169,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.169,
    ),
  ],
});

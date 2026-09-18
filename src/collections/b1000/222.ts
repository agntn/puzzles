import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/222`. */
export const b1000Puzzle222 = bitcoinPuzzle({
  id: "b1000/222",
  address: p2pkh("17A75vEkPPVeY9MMMXUY9M2JUHbbNyVAWC", "438993e343b3317a4833a709894145f2374a95f9"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("021536a0aa8cdb5061debba4f236d311a570f6de6d483419fa23c147f543765602"),
  key: bits(222),
  prize: 0.222,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.222,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.222,
    ),
  ],
});

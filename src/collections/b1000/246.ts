import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/246`. */
export const b1000Puzzle246 = bitcoinPuzzle({
  id: "b1000/246",
  address: p2pkh("1LrrNP28PYg1N1z5Uo1gR8cmoPc8h4orBZ", "d9d7fb9cf1d10075b0515591e2570c7efabc80c1"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0396ba2cc3d83caad1a3970670557417e627b7cf32ba4e6219604f8f5e7ca09752"),
  key: bits(246),
  prize: 0.246,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.246,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.246,
    ),
  ],
});

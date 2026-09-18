import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/224`. */
export const b1000Puzzle224 = bitcoinPuzzle({
  id: "b1000/224",
  address: p2pkh("1F6yxcbDzjumeN77DiABMXzPcvtAdnaoPF", "9ab3633c60100b0dd631bf1c6755abaea7bc0445"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02a1cf7a8cb1bdd05701aa57ef6e5a9ce28950d93e2369d5fa11ec5bdc8d4ce9d1"),
  key: bits(224),
  prize: 0.224,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.224,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.224,
    ),
  ],
});

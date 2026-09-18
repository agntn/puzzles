import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/234`. */
export const b1000Puzzle234 = bitcoinPuzzle({
  id: "b1000/234",
  address: p2pkh("1FYbLcutmRbvu4yUeLmC4TES2Q3ChhXYY", "02c031f6bc39053653a093d95511eb1197c5029c"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02d274968fe3b7f79074b9aad3221d71f42f4c0be9bb3a8e22e20396b9a63a847d"),
  key: bits(234),
  prize: 0.234,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.234,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.234,
    ),
  ],
});

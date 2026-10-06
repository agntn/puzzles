import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/230`. */
export const bits230 = puzzle({
  id: "bits/230",
  chain: "bitcoin",
  address: "13Jtm1mm33Uke7PbmTBYGNZGU7rXUsVs3e",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0216dc9de7fd808beff7fb3bc63767ef34beb0a51b4daf40151bc346781185ceec"),
  key: bits(230),
  prize: 0.23,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.23,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.23,
    ),
  ],
});

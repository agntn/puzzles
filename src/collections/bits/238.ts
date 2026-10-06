import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/238`. */
export const bits238 = puzzle({
  id: "bits/238",
  chain: "bitcoin",
  address: "1DxBvzRMdvzop21DhnDJv4xJDYFGVtu7KZ",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("039a1c77eb960be561f622d14ad0de0d2660245e629c1b11033f769aec28270b77"),
  key: bits(238),
  prize: 0.238,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.238,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.238,
    ),
  ],
});

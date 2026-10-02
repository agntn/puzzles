import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/226`. */
export const b1000Puzzle226 = puzzle({
  id: "b1000/226",
  chain: "bitcoin",
  address: "1HtbZg9mPjYcMDMDNyXaFjHX5e7ZPUwWAp",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("020d896eac113fac98c2a4a44b1488087b3b4c2d8f2563d2a41789f0324ad62cc7"),
  key: bits(226),
  prize: 0.226,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.226,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.226,
    ),
  ],
});

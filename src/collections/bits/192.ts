import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/192`. */
export const bits192 = puzzle({
  id: "bits/192",
  chain: "bitcoin",
  address: "1GWTEv76C8cusq4h5gV3rLjeFhBkGBHSKg",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("024e1799de117b044ea4778a77f0a6267bb84b182f55093be7ed0e8f703b74e5bd"),
  key: bits(192),
  prize: 0.192,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.192,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.192,
    ),
  ],
});

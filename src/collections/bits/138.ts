import { puzzle } from "../../core/puzzle.ts";
import { bits, funding, increase } from "../../core/parts.ts";

/** Puzzle `bits/138`. */
export const bits138 = puzzle({
  id: "bits/138",
  chain: "bitcoin",
  address: "1Ab4vzG6wEQBDNQM1B2bvUz4fqXXdFk2WT",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(138),
  prize: 13.8,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.138,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.242,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      12.42,
    ),
  ],
});

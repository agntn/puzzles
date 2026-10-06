import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/212`. */
export const bits212 = puzzle({
  id: "bits/212",
  chain: "bitcoin",
  address: "1JXw9i8dEZGH29mUiuKjWXK9L27r2TerLQ",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("020df4abc8bae9c000ea2357b014befe3e6d13dd63951ac0b2b66b37eab76b7ead"),
  key: bits(212),
  prize: 0.212,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.212,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.212,
    ),
  ],
});

import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/201`. */
export const bits201 = puzzle({
  id: "bits/201",
  chain: "bitcoin",
  address: "1DA2RexqNkbVhzfkmQDHRMfKrdesgyMMdQ",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03346fd1b1ca7a7eb88e4b7af48d678a42e8ca8d607d8e4e2967d16394c360d014"),
  key: bits(201),
  prize: 0.201,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.201,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.201,
    ),
  ],
});

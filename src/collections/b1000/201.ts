import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/201`. */
export const b1000Puzzle201 = bitcoinPuzzle({
  id: "b1000/201",
  address: p2pkh("1DA2RexqNkbVhzfkmQDHRMfKrdesgyMMdQ", "85567151f330b69bac3eba86bb3aedd8813ec2b7"),
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

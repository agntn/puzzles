import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/241`. */
export const b1000Puzzle241 = puzzle({
  id: "b1000/241",
  chain: "bitcoin",
  address: "1L7ZNx5gFPvdVPfdgFBnEUgA64woQwopqr",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03fbf9615ddcc9c0c9e88fb69ed62465ba694f4694f0ea94a7f3476dbf666ba56d"),
  key: bits(241),
  prize: 0.241,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.241,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.241,
    ),
  ],
});

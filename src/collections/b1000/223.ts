import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/223`. */
export const b1000Puzzle223 = puzzle({
  id: "b1000/223",
  chain: "bitcoin",
  address: "1NUVBXgX35Uax4fpziV7VGMJyji3mUzZbt",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("034cfb3bcb83ed739ecc9abc84f68ffaa430f2d685bebfaf8cefaaabcd2b53d984"),
  key: bits(223),
  prize: 0.223,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.223,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.223,
    ),
  ],
});

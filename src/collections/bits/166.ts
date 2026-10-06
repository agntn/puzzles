import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/166`. */
export const bits166 = puzzle({
  id: "bits/166",
  chain: "bitcoin",
  address: "12BtvPaamiBCpXmoDrsCxAa1b6hMRnASZ4",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02b02f753542201387815c4754b66202ef6dc4b3415e4c4cc826d6534394702f50"),
  key: bits(166),
  prize: 0.166,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.166,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.166,
    ),
  ],
});

import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/239`. */
export const bits239 = puzzle({
  id: "bits/239",
  chain: "bitcoin",
  address: "1QLHLvM6XKwygyWqo2cCPbfbf6woZzGEKH",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02dd983a8c8c8c25d3a16b014ad3e09b8188a3dc0333fc3d4b1504b1d3013b344e"),
  key: bits(239),
  prize: 0.239,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.239,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.239,
    ),
  ],
});

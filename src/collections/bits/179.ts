import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/179`. */
export const bits179 = puzzle({
  id: "bits/179",
  chain: "bitcoin",
  address: "12fXbBE7kTfqYk8dYyU9bw7XfKVwEqXnzg",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02064bbc39fd98afca5085c5e9a006c8bb0e466adef24a911e635f835c8061c15f"),
  key: bits(179),
  prize: 0.179,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.179,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.179,
    ),
  ],
});
